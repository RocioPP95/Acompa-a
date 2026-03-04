import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CabeceraComponent } from 'src/app/componentes/cabecera/cabecera.component';
import { ApiService, ContactoConfianza } from 'src/app/servicios/api.service';

@Component({
  selector: 'app-sos',
  templateUrl: './sos.page.html',
  styleUrls: ['./sos.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, CabeceraComponent],
})
export class SosPage {
  cargando = false;
  ok = false;
  error = '';

  contactos: ContactoConfianza[] = [];
  alertaActivaId: number | null = null;

  // Anti-spam: evita mandar SOS seguidos (15s)
  private ultimoSOS: number | null = null;

  constructor(private api: ApiService) { }

  // Se ejecuta cada vez que entras a la pantalla
  ionViewWillEnter() {
    this.cargarContactos();
  }

  activarSOS() {
    // Evitar doble click mientras está enviando
    if (this.cargando) return;

    // Cooldown 15s
    const ahora = Date.now();
    if (this.ultimoSOS && ahora - this.ultimoSOS < 15000) {
      this.error = 'Ya enviaste un SOS hace poco. Espera unos segundos.';
      this.ok = false;
      return;
    }

    this.ok = false;
    this.error = '';
    this.cargando = true;

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario?.id) {
      this.cargando = false;
      this.error = 'No hay usuario guardado. Inicia sesión otra vez.';
      return;
    }

    if (!navigator.geolocation) {
      this.cargando = false;
      this.error = 'Este dispositivo/navegador no soporta geolocalización.';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        this.api.crearAlerta({ user_id: usuario.id, lat, lng }).subscribe(
          (resp: any) => {
            this.ok = true;
            this.cargando = false;
            this.ultimoSOS = Date.now();

            // guardar id de alerta creada
            this.alertaActivaId = resp?.id ?? null;

            window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
          },
          (e) => {
            console.error(e);
            this.error = 'Error enviando SOS al servidor.';
            this.cargando = false;
          }
        );
      },
      (err) => {
        console.error(err);
        this.error =
          'No se pudo obtener la ubicación. Acepta el permiso de ubicación en el navegador.';
        this.cargando = false;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // ---------- CONTACTOS DE CONFIANZA ----------

  cargarContactos() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario?.id) return;

    this.api.obtenerContactosUsuario(usuario.id).subscribe({
      next: (data) => (this.contactos = data),
      error: (e) => console.error(e),
    });
  }

  anadirContacto() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario?.id) {
      this.error = 'No hay usuario guardado.';
      return;
    }

    const nombre = prompt('Nombre del contacto:');
    if (!nombre) return;

    const telefono = prompt('Teléfono:');
    if (!telefono) return;

    this.api.crearContacto({ user_id: usuario.id, nombre, telefono }).subscribe({
      next: () => this.cargarContactos(),
      error: (e) => {
        console.error(e);
        this.error = 'No se pudo crear el contacto.';
      },
    });
  }

  eliminarContacto(id: number) {
    this.api.borrarContacto(id).subscribe({
      next: () => {
        this.contactos = this.contactos.filter((c) => c.id !== id);
      },
      error: (e) => {
        console.error(e);
        this.error = 'No se pudo borrar el contacto.';
      },
    });
  }
  cerrarAlerta() {
  if (!this.alertaActivaId) return;

  this.api.cerrarAlerta(this.alertaActivaId).subscribe(
    () => {
      this.alertaActivaId = null;
      this.ok = false;
      this.error = '';
    },
    (e) => {
      console.error(e);
      this.error = 'No se pudo cerrar la alerta.';
    }
  );
}
}