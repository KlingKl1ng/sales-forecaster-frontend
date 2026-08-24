import { lazy, Suspense, useCallback, useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CloudUpload,
  Download,
  FileSpreadsheet,
  Filter,
  Focus,
  Gauge,
  Info,
  Layers3,
  LayoutDashboard,
  ListFilter,
  LoaderCircle,
  MapPin,
  Menu,
  Moon,
  MoreHorizontal,
  PackageCheck,
  PanelBottomClose,
  PanelBottomOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Route as RouteIcon,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Table2,
  Truck,
  Upload,
  UsersRound,
  Warehouse,
  X,
  Zap,
} from 'lucide-react';
import { customers, depots, routes, trips, validationItems, vehicles, vehicleTypes } from './mock-data';
import type { DataKind, InspectorTab } from './types';
import operartisLogo from '../../operartis-logo.svg';

const MapView = lazy(() => import('./MapView'));

const dataNav: Array<{ kind: DataKind; label: string; description: string; count: number; icon: typeof Warehouse }> = [
  { kind: 'depots', label: 'Depots', description: 'Dispatch & reload', count: depots.length, icon: Warehouse },
  { kind: 'customers', label: 'Customers', description: 'Demand & windows', count: customers.length, icon: UsersRound },
  { kind: 'vehicleTypes', label: 'Vehicle types', description: 'Capacity & costs', count: vehicleTypes.length, icon: Truck },
  { kind: 'vehicles', label: 'Physical fleet', description: 'Home depot & shift', count: vehicles.length, icon: Gauge },
];

const inspectorTabs: Array<{ id: InspectorTab; label: string }> = [
  { id: 'summary', label: 'Summary' },
  { id: 'routes', label: 'Routes' },
  { id: 'validation', label: 'Validation' },
];

const minutesToPercent = (minutes: number) => `${Math.max(0, Math.min(100, (minutes / 720) * 100))}%`;

function useTheme() {
  const initialTheme = window.getOperartisTheme?.() || 'system';
  const [theme, setThemeState] = useState(initialTheme);
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  const dark = theme === 'dark' || (theme === 'system' && systemDark);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ theme?: 'light' | 'dark' | 'system' }>).detail;
      setThemeState(detail?.theme || window.getOperartisTheme?.() || 'system');
    };
    window.addEventListener('operartis:theme-change', handler);
    return () => window.removeEventListener('operartis:theme-change', handler);
  }, []);

  const toggle = () => {
    const next = dark ? 'light' : 'dark';
    window.setOperartisTheme?.(next);
    if (!window.setOperartisTheme) {
      document.documentElement.classList.toggle('dark', next === 'dark');
      setThemeState(next);
    }
  };

  return { dark, toggle };
}

function App() {
  const { dark, toggle: toggleTheme } = useTheme();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>('R-01');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('summary');
  const [dataManager, setDataManager] = useState<DataKind | null>(null);
  const [entityDialog, setEntityDialog] = useState<DataKind | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [timelineCollapsed, setTimelineCollapsed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationStage, setOptimizationStage] = useState('Verified plan');
  const [progress, setProgress] = useState(100);
  const [toast, setToast] = useState<string | null>(null);
  const [mapFitRequest, setMapFitRequest] = useState(0);

  const selectedRoute = routes.find((route) => route.id === selectedRouteId) || null;
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) || null;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleSelectRoute = useCallback((routeId: string | null) => {
    setSelectedRouteId(routeId);
    setSelectedCustomerId(null);
    if (routeId) setInspectorTab('routes');
  }, []);

  const handleSelectCustomer = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId);
    setInspectorTab('summary');
  }, []);

  const runOptimization = async () => {
    if (optimizing) return;
    setOptimizing(true);
    setProgress(8);
    const stages = [
      ['Building road matrix', 24],
      ['Assigning customer depots', 42],
      ['Constructing feasible trips', 63],
      ['Packing physical vehicles', 79],
      ['Verifying hard constraints', 94],
      ['Verified plan', 100],
    ] as const;
    for (const [label, value] of stages) {
      setOptimizationStage(label);
      setProgress(value);
      await new Promise((resolve) => window.setTimeout(resolve, value === 100 ? 300 : 420));
    }
    setOptimizing(false);
    setInspectorTab('summary');
    setSelectedRouteId(null);
    setToast('Verified route plan generated · 18 customers served');
    window.OperartisApi?.broadcastDashboardDataChanged('vrp');
  };

  return (
    <div className="vrp-app">
      <header className="app-header glass-chrome">
        <div className="header-brand-group">
          <button className="icon-button mobile-menu-button" type="button" onClick={() => setMobileSidebarOpen(true)} aria-label="Open scenario navigation">
            <Menu size={19} />
          </button>
          <a className="brand-lockup" href="/" aria-label="Operartis home">
            <img src={operartisLogo} alt="" />
            <span>OPERARTIS</span>
          </a>
          <span className="header-divider" />
          <div className="module-identity">
            <span className="eyebrow">Operational planning</span>
            <strong>Vehicle Routing</strong>
          </div>
        </div>

        <button className="scenario-selector" type="button" aria-label="Choose scenario">
          <span className="scenario-status-dot" />
          <span>
            <small>Scenario</small>
            <strong>Berlin pilot · 24 Aug</strong>
          </span>
          <ChevronDown size={15} />
        </button>

        <div className="header-actions">
          <button className="button button-quiet hide-compact" type="button" onClick={() => setImportOpen(true)}>
            <Upload size={16} /> Import
          </button>
          <button className="icon-button hide-compact" type="button" onClick={() => setToast('Scenario draft saved locally')} aria-label="Save scenario">
            <Save size={17} />
          </button>
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label={dark ? 'Use light theme' : 'Use dark theme'}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="button button-primary" type="button" onClick={runOptimization} disabled={optimizing}>
            {optimizing ? <LoaderCircle className="spin" size={17} /> : <Sparkles size={17} />}
            <span>{optimizing ? 'Optimizing' : 'Optimize'}</span>
          </button>
          <div id="operartis-auth-topbar-slot" className="auth-slot">
            <button className="account-fallback" type="button" aria-label="Account menu">
              <span>LT</span><ChevronDown size={14} />
            </button>
          </div>
        </div>
      </header>

      <div className="app-body">
        <aside className={`scenario-sidebar ${sidebarCollapsed ? 'is-collapsed' : ''} ${mobileSidebarOpen ? 'is-mobile-open' : ''}`}>
          <div className="sidebar-heading">
            <div>
              <span className="eyebrow">Scenario data</span>
              <h2>Berlin pilot</h2>
            </div>
            <button className="icon-button" type="button" onClick={() => setSidebarCollapsed((value) => !value)} aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              {sidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            </button>
            <button className="icon-button mobile-sidebar-close" type="button" onClick={() => setMobileSidebarOpen(false)} aria-label="Close scenario navigation"><X size={18} /></button>
          </div>

          <nav className="data-navigation" aria-label="Scenario data">
            {dataNav.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.kind} className="data-nav-item" type="button" onClick={() => { setDataManager(item.kind); setMobileSidebarOpen(false); }}>
                  <span className="data-nav-icon"><Icon size={18} /></span>
                  <span className="data-nav-copy">
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                  <span className="count-pill">{item.count}</span>
                  <ChevronRight className="nav-chevron" size={15} />
                </button>
              );
            })}
          </nav>

          <div className="sidebar-section">
            <span className="sidebar-section-label">Planning rules</span>
            <button className="rule-row" type="button" onClick={() => setToast('Fixed home-depot policy is active')}>
              <RouteIcon size={17} />
              <span><strong>Fixed home depots</strong><small>Return & reload at home</small></span>
              <Check size={14} />
            </button>
            <button className="rule-row" type="button" onClick={() => setToast('All customer windows are hard constraints')}>
              <Clock3 size={17} />
              <span><strong>Hard time windows</strong><small>No lateness allowed</small></span>
              <Check size={14} />
            </button>
            <button className="rule-row" type="button" onClick={() => setToast('One delivery-capacity dimension is active')}>
              <PackageCheck size={17} />
              <span><strong>Delivery demand</strong><small>Single capacity unit</small></span>
              <Check size={14} />
            </button>
          </div>

          <div className="sidebar-ready-card">
            <div className="ready-card-head">
              <ShieldCheck size={19} />
              <div><strong>Ready to optimize</strong><small>0 blocking errors</small></div>
            </div>
            <div className="ready-progress"><span style={{ width: '100%' }} /></div>
            <button type="button" onClick={() => setInspectorTab('validation')}>Review 2 warnings <ChevronRight size={14} /></button>
          </div>
        </aside>
        {mobileSidebarOpen && <button className="mobile-backdrop" type="button" onClick={() => setMobileSidebarOpen(false)} aria-label="Close navigation" />}

        <main className="planning-workspace">
          <section className="map-workspace">
            <Suspense fallback={<div className="map-loading"><LoaderCircle className="spin" size={22} /><span>Loading route map</span></div>}>
              <MapView selectedRouteId={selectedRouteId} onSelectRoute={handleSelectRoute} onSelectCustomer={handleSelectCustomer} dark={dark} fitRequest={mapFitRequest} />
            </Suspense>

            <div className="map-toolbar map-toolbar-left glass-panel">
              <button className="toolbar-back" type="button" onClick={() => { setSelectedRouteId(null); setSelectedCustomerId(null); setMapFitRequest((value) => value + 1); }} aria-label="Show all routes"><ArrowLeft size={17} /></button>
              <span />
              <button type="button" onClick={() => { setSelectedRouteId(null); setMapFitRequest((value) => value + 1); }}><Focus size={16} /> All routes</button>
              <span />
              <button type="button" onClick={() => setDataManager('customers')}><Table2 size={16} /> Data table</button>
            </div>

            <div className="map-toolbar map-toolbar-right glass-panel">
              <button type="button" onClick={() => setToast('Route and stop layers are visible')}><Layers3 size={16} /> Layers</button>
              <button type="button" onClick={() => setToast('Map filters cleared')} aria-label="Filter map"><Filter size={16} /></button>
              <button type="button" onClick={() => { setMapFitRequest((value) => value + 1); setToast('Map centered on scenario'); }} aria-label="Fit map"><Focus size={16} /></button>
            </div>

            <div className="map-legend glass-panel" aria-label="Map legend">
              <span><i className="legend-depot" /> Depot</span>
              <span><i className="legend-stop" /> Customer</span>
              <span><i className="legend-cluster" /> Grouped stops</span>
              <span><i className="legend-route" /> Vehicle route</span>
            </div>

            <div className="plan-status glass-panel">
              <span className="verified-icon"><Check size={13} /></span>
              <span><small>Current solution</small><strong>{optimizationStage}</strong></span>
              <span className="status-metric"><b>18/18</b><small>served</small></span>
            </div>
          </section>

          <aside className="route-inspector">
            <div className="inspector-header">
              <div>
                <span className="eyebrow">Solution</span>
                <h2>Route plan</h2>
              </div>
              <button className="icon-button" type="button" aria-label="Solution actions"><MoreHorizontal size={18} /></button>
            </div>

            <div className="segmented-tabs" role="tablist" aria-label="Solution views">
              {inspectorTabs.map((tab) => (
                <button key={tab.id} className={inspectorTab === tab.id ? 'is-active' : ''} type="button" onClick={() => setInspectorTab(tab.id)} role="tab" aria-selected={inspectorTab === tab.id}>
                  {tab.label}
                  {tab.id === 'validation' && <span className="tab-count">2</span>}
                </button>
              ))}
            </div>

            <div className="inspector-content scroller">
              {inspectorTab === 'summary' && (
                <SummaryPanel selectedRoute={selectedRoute} selectedCustomer={selectedCustomer} onOpenRoutes={() => setInspectorTab('routes')} />
              )}
              {inspectorTab === 'routes' && (
                <RoutesPanel selectedRouteId={selectedRouteId} onSelectRoute={handleSelectRoute} />
              )}
              {inspectorTab === 'validation' && <ValidationPanel />}
            </div>
          </aside>

          <section className={`timeline-panel ${timelineCollapsed ? 'is-collapsed' : ''}`}>
            <div className="timeline-header">
              <div className="timeline-title">
                <button className="icon-button" type="button" onClick={() => setTimelineCollapsed((value) => !value)} aria-label={timelineCollapsed ? 'Expand vehicle timeline' : 'Collapse vehicle timeline'}>
                  {timelineCollapsed ? <PanelBottomOpen size={17} /> : <PanelBottomClose size={17} />}
                </button>
                <div><span className="eyebrow">Vehicle schedule</span><h3>Trips & reloads</h3></div>
              </div>
              <div className="timeline-actions">
                <span className="timeline-note"><span /> Hard-window feasible</span>
                <button className="button button-quiet" type="button" onClick={() => setToast('Timeline exported as part of the operational workbook')}><Download size={15} /> Export</button>
              </div>
            </div>
            {!timelineCollapsed && <VehicleTimeline selectedRouteId={selectedRouteId} onSelectRoute={handleSelectRoute} />}
          </section>
        </main>
      </div>

      {optimizing && (
        <div className="optimization-strip" role="status" aria-live="polite">
          <span className="optimization-copy"><LoaderCircle className="spin" size={16} /> {optimizationStage}</span>
          <span className="optimization-progress"><i style={{ width: `${progress}%` }} /></span>
          <b>{progress}%</b>
        </div>
      )}

      {dataManager && (
        <DataManager kind={dataManager} onClose={() => setDataManager(null)} onAdd={() => setEntityDialog(dataManager)} onToast={setToast} />
      )}
      {entityDialog && <EntityDialog kind={entityDialog} onClose={() => setEntityDialog(null)} onSaved={(message) => { setEntityDialog(null); setToast(message); }} />}
      {importOpen && <ImportDialog onClose={() => setImportOpen(false)} onImported={() => { setImportOpen(false); setToast('Scenario workbook validated · 27 records ready'); }} />}

      {toast && (
        <div className="toast" role="status">
          <span><CheckCircle2 size={20} /></span>
          <div><strong>Success</strong><p>{toast}</p></div>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification"><X size={15} /></button>
        </div>
      )}
    </div>
  );
}

function SummaryPanel({ selectedRoute, selectedCustomer, onOpenRoutes }: {
  selectedRoute: (typeof routes)[number] | null;
  selectedCustomer: (typeof customers)[number] | null;
  onOpenRoutes: () => void;
}) {
  if (selectedCustomer) {
    return (
      <div className="inspector-stack">
        <div className="selection-card">
          <div className="selection-card-head">
            <span className="selection-icon"><MapPin size={18} /></span>
            <div><small>Selected customer</small><strong>{selectedCustomer.name}</strong><span>{selectedCustomer.id}</span></div>
          </div>
          <dl className="detail-list">
            <div><dt>Time window</dt><dd>{selectedCustomer.timeWindow}</dd></div>
            <div><dt>Demand</dt><dd>{selectedCustomer.demand} units</dd></div>
            <div><dt>Service</dt><dd>{selectedCustomer.serviceMinutes} min</dd></div>
            <div><dt>Assigned depot</dt><dd>{selectedCustomer.depotId}</dd></div>
          </dl>
          <div className="feasible-banner"><CheckCircle2 size={15} /> Hard-window feasible</div>
        </div>
        <button className="button button-quiet button-full" type="button" onClick={onOpenRoutes}><RouteIcon size={16} /> View assigned route</button>
      </div>
    );
  }

  return (
    <div className="inspector-stack">
      <div className="metric-grid">
        <MetricCard icon={MapPin} label="Customers" value="18 / 18" meta="100% served" accent="emerald" />
        <MetricCard icon={Truck} label="Fleet used" value="5 / 5" meta="7 trips" />
        <MetricCard icon={RouteIcon} label="Distance" value="186.4" meta="kilometres" />
        <MetricCard icon={CircleDollarSign} label="Plan cost" value="€ 482" meta="€2.59 / km" accent="gold" />
      </div>

      <div className="inspector-card objective-card">
        <div className="card-heading"><span><BarChart3 size={17} /> Objective</span><span className="verified-badge"><Check size={12} /> Verified</span></div>
        <div className="objective-row"><span>Vehicle activation</span><strong>€ 262</strong><i><b style={{ width: '54%' }} /></i></div>
        <div className="objective-row"><span>Distance cost</span><strong>€ 188</strong><i><b style={{ width: '39%' }} /></i></div>
        <div className="objective-row"><span>Working time</span><strong>€ 32</strong><i><b style={{ width: '7%' }} /></i></div>
      </div>

      {selectedRoute ? (
        <div className="inspector-card selected-route-card" style={{ '--route-color': selectedRoute.color } as CSSProperties}>
          <div className="card-heading"><span><i className="route-color-dot" /> {selectedRoute.label}</span><button type="button" onClick={onOpenRoutes}>Details <ChevronRight size={13} /></button></div>
          <div className="route-kpis"><span><strong>{selectedRoute.stops}</strong><small>stops</small></span><span><strong>{selectedRoute.distanceKm} km</strong><small>distance</small></span><span><strong>{selectedRoute.duration}</strong><small>duration</small></span></div>
        </div>
      ) : (
        <div className="inspector-card coverage-card">
          <div className="card-heading"><span><Warehouse size={17} /> Depot workload</span><button type="button">Balanced</button></div>
          <div className="depot-workload"><span><b>BER-01</b><i><em style={{ width: '62%' }} /></i><small>11 stops · 3 vehicles</small></span><span><b>BER-02</b><i><em style={{ width: '38%' }} /></i><small>7 stops · 2 vehicles</small></span></div>
        </div>
      )}

      <div className="inspector-card carbon-card">
        <span className="carbon-icon"><Zap size={17} /></span>
        <div><small>Vehicle reuse</small><strong>2 vehicles perform a second trip</strong><p>One additional activation avoided by depot reload scheduling.</p></div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, meta, accent }: { icon: typeof MapPin; label: string; value: string; meta: string; accent?: 'gold' | 'emerald' }) {
  return (
    <div className={`metric-card ${accent ? `accent-${accent}` : ''}`}>
      <span><Icon size={16} /></span>
      <small>{label}</small>
      <strong>{value}</strong>
      <p>{meta}</p>
    </div>
  );
}

function RoutesPanel({ selectedRouteId, onSelectRoute }: { selectedRouteId: string | null; onSelectRoute: (routeId: string | null) => void }) {
  return (
    <div className="route-list">
      <div className="route-list-tools">
        <label><Search size={15} /><input placeholder="Find route or vehicle" /></label>
        <button type="button" aria-label="Filter routes"><ListFilter size={16} /></button>
      </div>
      <button className={`route-card route-card-all ${selectedRouteId === null ? 'is-selected' : ''}`} type="button" onClick={() => onSelectRoute(null)}>
        <span className="route-overview-icon"><LayoutDashboard size={17} /></span>
        <span><strong>All vehicle routes</strong><small>5 vehicles · 7 trips · 18 stops</small></span>
        <ChevronRight size={15} />
      </button>
      {routes.map((route) => {
        const vehicle = vehicles.find((item) => item.id === route.vehicleId)!;
        return (
          <button key={route.id} className={`route-card ${selectedRouteId === route.id ? 'is-selected' : ''}`} type="button" onClick={() => onSelectRoute(route.id)} style={{ '--route-color': route.color } as CSSProperties}>
            <span className="route-number"><i />{route.id.replace('R-', '')}</span>
            <span className="route-card-copy"><strong>{vehicle.plate}</strong><small>{route.label} · {route.trips} {route.trips === 1 ? 'trip' : 'trips'}</small><em>{route.stops} stops · {route.distanceKm} km · {route.duration}</em></span>
            <span className="route-cost">€{route.cost}<ChevronRight size={14} /></span>
          </button>
        );
      })}
    </div>
  );
}

function ValidationPanel() {
  return (
    <div className="validation-stack">
      <div className="validation-score-card">
        <span className="score-ring"><b>100</b><small>/100</small></span>
        <div><span className="eyebrow">Feasibility score</span><strong>Verified solution</strong><p>All launch-version hard constraints passed.</p></div>
      </div>
      <div className="constraint-pills">
        <span><CheckCircle2 size={13} /> Capacity</span><span><CheckCircle2 size={13} /> Time windows</span><span><CheckCircle2 size={13} /> Shifts</span><span><CheckCircle2 size={13} /> Reloads</span>
      </div>
      {validationItems.map((item) => (
        <article key={item.id} className={`validation-item level-${item.level}`}>
          <span className="validation-item-icon">{item.level === 'warning' ? <AlertTriangle size={17} /> : item.level === 'success' ? <ShieldCheck size={17} /> : <Info size={17} />}</span>
          <div><strong>{item.title}</strong><p>{item.detail}</p>{item.entity && <button type="button">Open {item.entity} <ChevronRight size={13} /></button>}</div>
        </article>
      ))}
    </div>
  );
}

function VehicleTimeline({ selectedRouteId, onSelectRoute }: { selectedRouteId: string | null; onSelectRoute: (routeId: string | null) => void }) {
  const timelineVehicles = vehicles.filter((vehicle) => !selectedRouteId || vehicle.routeId === selectedRouteId);
  const timeLabels = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
  return (
    <div className="timeline-body scroller">
      <div className="timeline-axis-row">
        <div className="vehicle-column-head"><Truck size={14} /> Physical vehicle</div>
        <div className="timeline-axis">{timeLabels.map((label) => <span key={label}>{label}</span>)}</div>
      </div>
      {timelineVehicles.map((vehicle) => {
        const route = routes.find((item) => item.id === vehicle.routeId)!;
        const vehicleTrips = trips.filter((trip) => trip.vehicleId === vehicle.id);
        return (
          <button key={vehicle.id} className="timeline-row" type="button" onClick={() => onSelectRoute(vehicle.routeId)} style={{ '--route-color': route.color } as CSSProperties}>
            <span className="vehicle-label"><i /><span><strong>{vehicle.plate}</strong><small>{vehicle.id} · {vehicle.utilization}% utilized</small></span><em>{vehicleTrips.length}T</em></span>
            <span className="timeline-track">
              {timeLabels.slice(0, -1).map((label) => <i className="timeline-gridline" key={label} />)}
              {vehicleTrips.map((trip, index) => (
                <span key={trip.id} className="trip-block" style={{ left: minutesToPercent(trip.startMinute), width: minutesToPercent(trip.endMinute - trip.startMinute) }}>
                  <span className="trip-main"><Warehouse size={12} /><b>{trip.label}</b><small>{trip.start}–{trip.end}</small></span>
                  <span className="trip-stop-dots">{trip.customerIds.map((id, stopIndex) => <i key={id} title={id}>{stopIndex + 1}</i>)}</span>
                  {index < vehicleTrips.length - 1 && <span className="reload-label">reload</span>}
                </span>
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DataManager({ kind, onClose, onAdd, onToast }: { kind: DataKind; onClose: () => void; onAdd: () => void; onToast: (message: string) => void }) {
  const [activeKind, setActiveKind] = useState(kind);
  const [query, setQuery] = useState('');
  const title = dataNav.find((item) => item.kind === activeKind)!.label;
  const rows = getDataRows(activeKind).filter((row) => Object.values(row).join(' ').toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="modal-layer" role="presentation">
      <div className="data-manager" role="dialog" aria-modal="true" aria-label={`Manage ${title}`}>
        <header className="data-manager-header">
          <div><span className="eyebrow">Scenario data</span><h2>Manage operational inputs</h2><p>Changes are validated before they enter the routing model.</p></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close data manager"><X size={19} /></button>
        </header>
        <div className="data-manager-tabs">
          {dataNav.map((item) => {
            const Icon = item.icon;
            return <button key={item.kind} className={activeKind === item.kind ? 'is-active' : ''} type="button" onClick={() => setActiveKind(item.kind)}><Icon size={16} />{item.label}<span>{item.count}</span></button>;
          })}
        </div>
        <div className="data-manager-toolbar">
          <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}`} /></label>
          <button className="button button-quiet" type="button" onClick={() => onToast(`${title} template downloaded`)}><Download size={15} /> Template</button>
          <button className="button button-quiet" type="button" onClick={() => onToast(`${title} table validated`)}><ShieldCheck size={15} /> Validate</button>
          <button className="button button-primary" type="button" onClick={onAdd}><Plus size={16} /> Add {singular(activeKind)}</button>
        </div>
        <div className="data-table-wrap scroller">
          <table className="data-table">
            <thead><tr>{Object.keys(rows[0] || {}).map((column) => <th key={column}>{column}</th>)}<th aria-label="Actions" /></tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={`${activeKind}-${rowIndex}`}>{Object.values(row).map((value, index) => <td key={`${rowIndex}-${index}`}>{index === 0 ? <strong>{value}</strong> : value}</td>)}<td><button type="button" aria-label="Edit row"><MoreHorizontal size={16} /></button></td></tr>)}</tbody>
          </table>
        </div>
        <footer className="data-manager-footer"><span><CheckCircle2 size={15} /> {rows.length} valid records · 0 blocking errors</span><div><button className="button button-quiet" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="button" onClick={() => { onToast(`${title} changes applied`); onClose(); }}><Save size={15} /> Apply changes</button></div></footer>
      </div>
    </div>
  );
}

function EntityDialog({ kind, onClose, onSaved }: { kind: DataKind; onClose: () => void; onSaved: (message: string) => void }) {
  const label = singular(kind);
  const submit = (event: FormEvent) => { event.preventDefault(); onSaved(`${label} added and validated`); };
  return (
    <div className="modal-layer modal-layer-top" role="presentation">
      <form className="entity-dialog" onSubmit={submit} role="dialog" aria-modal="true" aria-label={`Add ${label}`}>
        <header><div><span className="entity-dialog-icon">{kind === 'depots' ? <Warehouse size={20} /> : kind === 'customers' ? <MapPin size={20} /> : <Truck size={20} />}</span><span><small>Scenario data</small><h2>Add {label}</h2></span></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></header>
        <div className="form-section"><div className="form-section-title"><span>01</span><div><strong>General information</strong><small>Identity and operational ownership</small></div></div><div className="form-grid"><label><span>{label} ID *</span><input required placeholder={kind === 'customers' ? 'C-019' : kind === 'depots' ? 'BER-03' : 'VEH-06'} /></label><label><span>Name *</span><input required placeholder={`New ${label.toLowerCase()}`} /></label><label><span>Home depot *</span><select defaultValue="BER-01"><option>BER-01 · Berlin Central</option><option>BER-02 · Spandau</option></select></label><label><span>Status</span><select><option>Active</option><option>Draft</option></select></label></div></div>
        <div className="form-section"><div className="form-section-title"><span>02</span><div><strong>{kind === 'customers' ? 'Demand & service' : 'Operating constraints'}</strong><small>Hard constraints used by the solver</small></div></div><div className="form-grid"><label><span>{kind === 'customers' ? 'Demand (units) *' : 'Capacity (units) *'}</span><input required type="number" placeholder="24" /></label><label><span>{kind === 'customers' ? 'Service time (min) *' : 'Reload time (min)'}</span><input required type="number" placeholder="15" /></label><label><span>Window start *</span><input required type="time" defaultValue="08:00" /></label><label><span>Window end *</span><input required type="time" defaultValue="17:00" /></label></div></div>
        {(kind === 'customers' || kind === 'depots') && <div className="form-section"><div className="form-section-title"><span>03</span><div><strong>Location</strong><small>WGS84 coordinates are canonical</small></div></div><div className="form-grid"><label className="form-span-2"><span>Address label</span><input placeholder="Street, city" /></label><label><span>Longitude *</span><input required type="number" step="any" placeholder="13.4050" /></label><label><span>Latitude *</span><input required type="number" step="any" placeholder="52.5200" /></label></div></div>}
        <footer><span><ShieldCheck size={15} /> Backend validation runs again on save</span><div><button className="button button-quiet" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit"><Check size={16} /> Add {label}</button></div></footer>
      </form>
    </div>
  );
}

function ImportDialog({ onClose, onImported }: { onClose: () => void; onImported: () => void }) {
  const [fileName, setFileName] = useState<string | null>(null);
  return (
    <div className="modal-layer modal-layer-top" role="presentation">
      <div className="import-dialog" role="dialog" aria-modal="true" aria-label="Import scenario data">
        <header><div><span className="entity-dialog-icon"><FileSpreadsheet size={20} /></span><span><small>Scenario data</small><h2>Import routing workbook</h2></span></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></header>
        <label className={`drop-zone ${fileName ? 'has-file' : ''}`}><input type="file" accept=".xlsx,.xls,.csv,.json" onChange={(event) => setFileName(event.target.files?.[0]?.name || null)} />{fileName ? <><CheckCircle2 size={30} /><strong>{fileName}</strong><span>Ready for schema and constraint validation</span></> : <><CloudUpload size={32} /><strong>Drop a workbook here</strong><span>or click to browse · XLSX, CSV, or JSON</span></>}</label>
        <div className="import-structure"><span className="eyebrow">Expected workbook sheets</span><div><span><Warehouse size={16} /> Depots <b>2</b></span><span><UsersRound size={16} /> Customers <b>18</b></span><span><Truck size={16} /> Vehicles <b>5</b></span><span><Settings2 size={16} /> Settings <b>1</b></span></div></div>
        <footer><button className="button button-quiet" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="button" onClick={onImported} disabled={!fileName}><ShieldCheck size={16} /> Validate & import</button></footer>
      </div>
    </div>
  );
}

function singular(kind: DataKind) {
  return kind === 'depots' ? 'depot' : kind === 'customers' ? 'customer' : kind === 'vehicleTypes' ? 'vehicle type' : 'vehicle';
}

function getDataRows(kind: DataKind): Array<Record<string, string>> {
  if (kind === 'depots') return depots.map((item) => ({ ID: item.id, Name: item.name, 'Operating window': item.window, Reload: `${item.reloadMinutes} min`, Fleet: String(item.vehicles), Coordinates: `${item.coordinate[1].toFixed(4)}, ${item.coordinate[0].toFixed(4)}` }));
  if (kind === 'customers') return customers.map((item) => ({ ID: item.id, Customer: item.name, Depot: item.depotId, Demand: `${item.demand} units`, 'Time window': item.timeWindow, Service: `${item.serviceMinutes} min`, Route: item.routeId }));
  if (kind === 'vehicleTypes') return vehicleTypes.map((item) => ({ ID: item.id, Type: item.name, Capacity: `${item.capacity} units`, 'Fixed cost': `€${item.fixedCost}`, 'Distance cost': `€${item.distanceCost.toFixed(2)} / km`, Profile: item.profile }));
  return vehicles.map((item) => ({ ID: item.id, Plate: item.plate, Type: item.typeId, 'Home depot': item.depotId, Shift: item.shift, Trips: String(item.trips), Utilization: `${item.utilization}%` }));
}

export default App;
