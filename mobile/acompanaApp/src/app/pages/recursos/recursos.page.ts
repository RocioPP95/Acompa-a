import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Recurso } from 'src/app/servicios/api.service';
import * as L from 'leaflet';

// FIX iconos leaflet
const iconDefault = L.icon({
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

(L.Marker.prototype as any).options.icon = iconDefault;

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.page.html',
  styleUrls: ['./recursos.page.scss'],
  standalone: false,
})
export class RecursosPage implements OnInit, AfterViewInit {
  recursos: Recurso[] = [];
  cargando = false;
  error = '';

  //  recurso seleccionado para mostrar tu app-tarjeta-recurso
  seleccionado: Recurso | null = null;

  //  leaflet
  private mapa!: L.Map;
  private markersLayer!: L.LayerGroup;

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.cargarRecursos();
  }

  ngAfterViewInit() {
    this.initMapa();
  }

  private initMapa() {
    this.mapa = L.map('map', { zoomControl: true }).setView([40.4168, -3.7038], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.mapa);

    this.markersLayer = L.layerGroup().addTo(this.mapa);
    this.centrarEnMiUbicacion();

    //  IMPORTANTE para Ionic: recalcular tamaño
    setTimeout(() => {
      this.mapa.invalidateSize();
    }, 300);
  }

  cargarRecursos(event?: any) {
    this.error = '';
    this.cargando = true;

    this.api.obtenerRecursos().subscribe({
      next: (data) => {
        this.recursos = data;
        this.cargando = false;
        event?.target?.complete?.();

        // ✅ pintar marcadores cuando ya tengamos mapa
        if (this.mapa) {
          this.pintarMarcadores();
        }
      },
      error: () => {
        this.error = 'No se pudieron cargar los recursos';
        this.cargando = false;
        event?.target?.complete?.();
      },
    });
  }

  private pintarMarcadores() {
    if (!this.markersLayer) return;

    // limpiar marcadores anteriores
    this.markersLayer.clearLayers();

    const coordsValidas: [number, number][] = [];

    this.recursos.forEach((r) => {
      const lat = Number(r.latitud);
      const lng = Number(r.longitud);
      if (!isFinite(lat) || !isFinite(lng)) return;

      coordsValidas.push([lat, lng]);

      const marker = L.marker([lat, lng]);

      marker.on('click', () => {
        this.seleccionado = r;
      });

      marker.addTo(this.markersLayer);
    });

    // Ajustar zoom para que se vean todos (si hay recursos)
    if (coordsValidas.length) {
      const bounds = L.latLngBounds(coordsValidas);
      this.mapa.fitBounds(bounds, { padding: [30, 30] });
    }
  }

  // tu componente emite (detalle) con el id
  verDetalle(id: number) {
    console.log('ID recurso:', id);
    // Si más adelante tienes una pantalla detalle:
    // this.router.navigate(['/recurso', id]);
  }
  centrarEnMiUbicacion() {
  if (!navigator.geolocation) {
    console.warn('Geolocalización no soportada');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // Centrar el mapa en tu ubicación (zoom 14 aprox. “alrededores”)
      this.mapa.setView([lat, lng], 14);

      // (Opcional) marcador “tú estás aquí”
      L.circleMarker([lat, lng], {
        radius: 8,
      }).addTo(this.mapa).bindPopup('Estás aquí').openPopup();
    },
    (err) => {
      console.error(err);
      // si el usuario no da permiso, no pasa nada: se queda en Madrid
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}
}