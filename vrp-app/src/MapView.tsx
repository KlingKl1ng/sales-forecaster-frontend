import { useEffect, useRef } from 'react';
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap, type Marker } from 'maplibre-gl';
import { customers, depots, routes } from './mock-data';

interface MapViewProps {
  selectedRouteId: string | null;
  onSelectRoute: (routeId: string | null) => void;
  onSelectCustomer: (customerId: string) => void;
  dark: boolean;
}

const isLocal = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
const tileUrl = import.meta.env.VITE_VRP_TILE_URL || (isLocal ? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' : '/map-tiles/{z}/{x}/{y}.png');

function routeFeature(routeId: string) {
  const route = routes.find((item) => item.id === routeId)!;
  return {
    type: 'Feature' as const,
    properties: { id: route.id },
    geometry: {
      type: 'LineString' as const,
      coordinates: route.coordinates,
    },
  };
}

export default function MapView({ selectedRouteId, onSelectRoute, onSelectCustomer, dark }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      center: [13.31, 52.52],
      zoom: 9.55,
      minZoom: 7,
      maxZoom: 16,
      attributionControl: false,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [tileUrl],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          { id: 'osm', type: 'raster', source: 'osm', paint: { 'raster-saturation': -0.45, 'raster-contrast': 0.04 } },
        ],
      },
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      routes.forEach((route) => {
        map.addSource(`route-${route.id}`, {
          type: 'geojson',
          data: routeFeature(route.id),
        });
        map.addLayer({
          id: `route-shadow-${route.id}`,
          type: 'line',
          source: `route-${route.id}`,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#0f172a',
            'line-width': 8,
            'line-opacity': 0.12,
          },
        });
        map.addLayer({
          id: `route-line-${route.id}`,
          type: 'line',
          source: `route-${route.id}`,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': route.color,
            'line-width': 4.5,
            'line-opacity': 0.82,
          },
        });
        map.on('click', `route-line-${route.id}`, () => onSelectRoute(route.id));
        map.on('mouseenter', `route-line-${route.id}`, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', `route-line-${route.id}`, () => { map.getCanvas().style.cursor = ''; });
      });

      depots.forEach((depot) => {
        const element = document.createElement('button');
        element.type = 'button';
        element.className = 'map-depot-marker';
        element.setAttribute('aria-label', depot.name);
        element.innerHTML = '<span aria-hidden="true"></span>';
        const marker = new maplibregl.Marker({ element, anchor: 'center' })
          .setLngLat(depot.coordinate)
          .setPopup(new maplibregl.Popup({ offset: 22, closeButton: false }).setHTML(`<strong>${depot.name}</strong><small>${depot.id} · ${depot.window}</small>`))
          .addTo(map);
        markersRef.current.push(marker);
      });

      customers.forEach((customer) => {
        const route = routes.find((item) => item.id === customer.routeId)!;
        const element = document.createElement('button');
        element.type = 'button';
        element.className = 'map-customer-marker';
        element.style.setProperty('--route-color', route.color);
        element.textContent = String(customer.sequence);
        element.setAttribute('aria-label', `${customer.name}, stop ${customer.sequence}`);
        element.dataset.routeId = route.id;
        element.addEventListener('click', (event) => {
          event.stopPropagation();
          onSelectRoute(route.id);
          onSelectCustomer(customer.id);
        });
        const marker = new maplibregl.Marker({ element, anchor: 'center' })
          .setLngLat(customer.coordinate)
          .setPopup(new maplibregl.Popup({ offset: 18, closeButton: false }).setHTML(`<strong>${customer.name}</strong><small>${customer.timeWindow} · ${customer.demand} units</small>`))
          .addTo(map);
        markersRef.current.push(marker);
      });

      const bounds = new maplibregl.LngLatBounds();
      depots.forEach((item) => bounds.extend(item.coordinate));
      customers.forEach((item) => bounds.extend(item.coordinate));
      map.fitBounds(bounds, { padding: { top: 80, right: 60, bottom: 80, left: 60 }, duration: 0 });
    });

    mapRef.current = map;
    const observer = new ResizeObserver(() => map.resize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [onSelectCustomer, onSelectRoute]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    routes.forEach((route) => {
      const selected = !selectedRouteId || selectedRouteId === route.id;
      if (map.getLayer(`route-line-${route.id}`)) {
        map.setPaintProperty(`route-line-${route.id}`, 'line-opacity', selected ? 0.9 : 0.15);
        map.setPaintProperty(`route-line-${route.id}`, 'line-width', selectedRouteId === route.id ? 6.5 : 4.5);
      }
    });

    markersRef.current.forEach((marker) => {
      const element = marker.getElement();
      const routeId = element.dataset.routeId;
      if (routeId) element.classList.toggle('is-muted', Boolean(selectedRouteId && selectedRouteId !== routeId));
    });

    if (selectedRouteId) {
      const route = routes.find((item) => item.id === selectedRouteId);
      if (route) {
        const bounds = new maplibregl.LngLatBounds();
        route.coordinates.forEach((coordinate) => bounds.extend(coordinate));
        map.fitBounds(bounds, { padding: { top: 100, right: 100, bottom: 100, left: 100 }, duration: 650, maxZoom: 11.8 });
      }
    }
  }, [selectedRouteId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getLayer('osm')) return;
    map.setPaintProperty('osm', 'raster-brightness-max', dark ? 0.62 : 1);
    map.setPaintProperty('osm', 'raster-brightness-min', dark ? 0.11 : 0);
    map.setPaintProperty('osm', 'raster-saturation', dark ? -0.72 : -0.45);
  }, [dark]);

  return <div ref={containerRef} className="map-canvas" aria-label="Interactive route map" />;
}
