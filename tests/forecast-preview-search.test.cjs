const assert=require('node:assert/strict');
const {test}=require('node:test');
const fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../forecaster.html'),'utf8');
const constants=source.match(/const PREPARATION_METHODS = .*?;/)[0];
const helpers=source.slice(source.indexOf('const filterPreparationRecords ='),source.indexOf('const MissingDataReview ='));
const {preparationPreviewCells:cells,previewSearchTerms:terms,indexPreviewRows:index,searchPreviewRows:search,filterPreparationRecords:filter}=new Function(constants+helpers+';return {preparationPreviewCells,previewSearchTerms,indexPreviewRows,searchPreviewRows,filterPreparationRecords};')();
const find=(rows,q)=>search(index(rows,cells),terms(q));
test('search spans all rows, columns and displayed status labels without changing source',()=>{
 const rows=Array.from({length:50},(_,i)=>({unique_id:`CAL-${i}`,ds:'2026-02-14',original:i,prepared:i}));
 rows.push({unique_id:'Café',ds:'2026-02-15',original:null,original_kind:'absent_period',prepared:0,closed:true});
 const before=JSON.stringify(rows);
 assert.deepEqual(find(rows,'cal-49'),[rows[49]]);
 assert.deepEqual(find(rows,'CAFE "missing period" "no record" 0'),[rows[50]]);
 assert.deepEqual(find(rows,'cal-49 2026-02-14 49 observed'),[rows[49]]);
 assert.equal(JSON.stringify(rows),before);
});
test('literal words, quoted phrases, blanks and punctuation are safe and predictable',()=>{
 const rows=[['Alpha [x]','Two words'],['ALPHA','Two unrelated words']];
 const indexed=index(rows,row=>row);
 assert.deepEqual(search(indexed,terms('alpha "two words"')),[rows[0]]);
 assert.deepEqual(search(indexed,terms('[x]')),[rows[0]]);
 assert.deepEqual(search(indexed,terms('   ""  ')),rows);
 assert.deepEqual(search(indexed,terms('.*')),[]);
 assert.deepEqual(search(indexed,terms('ALPHA words')),rows);
});
test('distinguishes observed, missing, conflict and resolved calendar states',()=>{
 const rows=[{original:null,prepared:null,missing:true,kind:'empty_quantity'}, {original:144,prepared:null,conflict:true}, {original:144,prepared:0,closed:true,calendar_conflict_resolved:true}, {original:144,prepared:144,calendar_conflict_resolved:true}];
 assert.deepEqual(find(rows,'empty unresolved'),[rows[0]]);
 assert.deepEqual(find(rows,'"calendar conflict"'),[rows[1]]);
 assert.deepEqual(find(rows,'"closed · conflict resolved"'),[rows[2]]);
 assert.deepEqual(find(rows,'observed resolved'),[rows[3]]);
});
test('search composes with ID, unresolved and open-day filters',()=>{
 const a={unique_id:'A',ds:'2026-02-14',original:4,prepared:null,closed:true,conflict:true};
 const b={unique_id:'B',ds:'2026-02-14',original:4,prepared:4};
 const review={records:find([a,b],'2026-02'),items:[],policy:{}};
 assert.deepEqual(filter(review,'A',true,true),[a]);
 assert.deepEqual(filter(review,'B',true,false),[]);
});
test('template item selection uses the mapped column and combines with search for both layouts',()=>{
 const {rawPreviewItemIds:ids,filterRawPreviewItems:filterItems}=new Function(helpers+';return {rawPreviewItemIds,filterRawPreviewItems};')();
 const vertical=[['2026-01-01','A',10],['2026-01-02','A',12],['2026-01-01','B',10]];
 assert.deepEqual(ids(vertical,1),['A','B']);
 assert.deepEqual(filterItems(search(index(vertical,r=>r),terms('2026-01-02')),1,'A'),[vertical[1]]);
 assert.deepEqual(filterItems(vertical,1,'B'),[vertical[2]]);
 const horizontal=[[100,2,3],[200,4,5]];
 assert.deepEqual(ids(horizontal,0),['100','200']);
 assert.deepEqual(filterItems(search(index(horizontal,r=>r),terms('5')),0,'200'),[horizontal[1]]);
 assert.deepEqual(filterItems(horizontal,0,''),horizontal);
 assert.deepEqual(ids(vertical,-1),[]);
});
