export type DataKind = 'depots' | 'customers' | 'vehicleTypes' | 'vehicles';
export type InspectorTab = 'summary' | 'routes' | 'validation';

export interface Depot {
  id: string;
  name: string;
  coordinate: [number, number];
  window: string;
  reloadMinutes: number;
  vehicles: number;
}

export interface Customer {
  id: string;
  name: string;
  coordinate: [number, number];
  demand: number;
  timeWindow: string;
  serviceMinutes: number;
  depotId: string;
  routeId: string;
  sequence: number;
}

export interface VehicleType {
  id: string;
  name: string;
  capacity: number;
  fixedCost: number;
  distanceCost: number;
  profile: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  typeId: string;
  depotId: string;
  shift: string;
  trips: number;
  utilization: number;
  routeId: string;
}

export interface Trip {
  id: string;
  label: string;
  vehicleId: string;
  depotId: string;
  start: string;
  end: string;
  startMinute: number;
  endMinute: number;
  customerIds: string[];
  distanceKm: number;
  load: number;
  capacity: number;
  color: string;
}

export interface Route {
  id: string;
  vehicleId: string;
  label: string;
  color: string;
  distanceKm: number;
  duration: string;
  stops: number;
  trips: number;
  cost: number;
  coordinates: [number, number][];
}

export interface ValidationItem {
  id: string;
  level: 'warning' | 'info' | 'success';
  title: string;
  detail: string;
  entity?: string;
}
