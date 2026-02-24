import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss'],
})
export class CabeceraComponent implements OnInit, OnDestroy {

  nombre = '';
  fechaHora = '';
  private timer: any;

  ngOnInit() {
    // Usuario
    const raw = localStorage.getItem('usuario');
    if (raw) {
      const u = JSON.parse(raw);
      this.nombre = u.nombrePublico || '';
    }

    // Fecha y hora
    this.actualizarFechaHora();
    this.timer = setInterval(() => {
      this.actualizarFechaHora();
    }, 60000); // cada minuto
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  actualizarFechaHora() {
    const ahora = new Date();

    const fecha = ahora.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const hora = ahora.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });

    this.fechaHora = `${fecha} · ${hora}`;
  }
}
