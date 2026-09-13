const assert = require('node:assert/strict');
const {test} = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../forecaster.html'), 'utf8');
const helpers = source.slice(source.indexOf('const preparedActualChartData ='), source.indexOf('const CompactChartTooltip ='));
const translations = source.slice(source.indexOf('const TRANSLATIONS ='), source.indexOf('const MenuIcon ='));
const compactLabel = source.slice(source.indexOf('const chartTooltipLabel ='), source.indexOf('// Display prepared values in Actual'));
const {display,label} = new Function(translations + compactLabel + helpers + '; return {display:preparedActualChartData,label:chartTooltipEntryLabel};')();
const replaySource = source.slice(source.indexOf('const buildReplayChartData ='), source.indexOf('const ReplayWindowLabel ='));
const replay = new Function('preparedActualChartData', replaySource + ';return buildReplayChartData;')(display);

test('chart Actual uses prepared values while raw observations and fits stay unchanged', () => {
 const rows = [
  {date:'2026-01-06',actual_train:null,fitted:103,prepared_actual:105,preparation_method:'interpolation'},
  {date:'2026-01-07',actual_test:null,val_forecast:108,prepared_actual:0,preparation_method:'zero'},
  {actual_history:110,prepared_actual:999},
  {actual_history:null,prepared_actual:null},
  {actual_history:0,closed:true,prepared_actual:9},
  {future_forecast:120}
 ];
 const before = structuredClone(rows), chart = display(rows);
 assert.equal(chart[0].actual_train,105);assert.equal(chart[0].fitted,103);
 assert.equal(chart[0].actual_test,undefined);
 assert.deepEqual(chart[0].prepared_actual_keys,['actual_train']);
 assert.equal(chart[1].actual_test,0);assert.equal(chart[1].val_forecast,108);
 assert.equal(chart[2].actual_history,110);assert.equal(chart[3].actual_history,null);
 assert.equal(chart[4].actual_history,0);assert.equal(chart[5].actual_history,undefined);
 assert.deepEqual(rows,before);
 assert.equal(display(undefined),undefined);
});

test('all filling methods use localized Estimation labels only for estimated tooltip values', () => {
 for (const method of ['interpolation','forward','backward','seasonal','zero']) {
  for (const [locale,base,train,testLabel] of [['en-US','Estimation','Train','Test'],['vi-VN','Ước tính','Huấn luyện','Kiểm tra'],['de-DE','Schätzung','Training','Test']]) {
   for (const [key,suffix] of [['actual_train',train],['training',train],['actual_test',testLabel],['actual',testLabel],['actual_history',null]]) {
    const point = display([{[key]:null,prepared_actual:method==='zero'?0:105,preparation_method:method}],[key])[0];
    const entry={dataKey:key,name:'Actual',payload:point};
    assert.equal(label(entry,false,locale),suffix?`${base} (${suffix})`:base);
    assert.equal(label(entry,true,locale),base);
    assert.equal(label({...entry,payload:{[key]:105}},false,locale),'Actual');
    assert.equal(label({dataKey:'final_fit',name:'Fit',payload:point},false,locale),'Fit');
   }
  }
 }
});

test('simulation estimates respect training windows and actual reveal phase', () => {
 const history = Array.from({length:5},(_,i)=>({date:String(i),value:null,prepared_actual:105+i,preparation_method:'forward'}));
 const fold = {start:1,end:2,points:[{actual:null,forecast:110}]};
 for (const phase of [0,1,2]) {
  const chart = replay(history,fold,phase);
  assert.equal(chart[0].training,undefined);
  assert.equal(chart[1].training,106);assert.equal(chart[2].training,107);
  assert.equal(chart[3].training,undefined);
  assert.equal(chart[3].actual,phase===2?108:undefined);
  assert.equal(chart[3].forecast,phase>=1?110:null);
  assert.equal(chart[4].actual,undefined);
 }
 assert.equal(fold.points[0].actual,null);assert.equal(history[1].value,null);
});


test('closed test days reveal calendar zeros without changing raw validation targets', () => {
 const buildSource=source.slice(source.indexOf('const buildValidationReplay ='),source.indexOf('const buildReplayChartData ='));
 const build=new Function(buildSource+';return buildValidationReplay;')();
 for(const closedActual of [null,250]) {
  const dates=['2026-03-25','2026-03-26','2026-03-27','2026-03-28','2026-03-29','2026-03-30','2026-03-31'];
  const pairs=dates.slice(1).map((date,i)=>({origin:dates[0],date,lead:i+1,actual:i===2||i===3?closedActual:100,closed:i===2||i===3,forecast:i===2||i===3?0:102}));
  const data={preparation:{operating_calendar:{enabled:true}},validation_method:'simple',
   forecast_data:dates.map((date,i)=>({date,actual_history:i===3||i===4?0:100,closed:i===3||i===4})),
   validation_summary:{training_window:1,validation_period:6,forecast_horizon:6,evaluations:1,all_forecasts:pairs}};
  const before=structuredClone(data),result=build(data),fold=result.folds[0];
  assert.equal(fold.scoredCount,4);assert.equal(fold.metrics.mae,2);
  for(const phase of [0,1,2]) {
   const chart=replay(result.history,fold,phase);
   for(const i of [3,4]) {
    assert.equal(chart[i].actual,phase===2?0:undefined);
    assert.equal(chart[i].prepared_actual_keys,undefined);
   }
   assert.equal(chart[5].actual,phase===2?100:undefined);
  }
  assert.deepEqual(data,before);
 }
});
