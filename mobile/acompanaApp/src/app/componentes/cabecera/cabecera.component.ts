import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit() {

    const raw = localStorage.getItem('usuario');
    if (raw) {
      const u = JSON.parse(raw);
      this.nombre = u.nombrePublico || '';
    }

    this.actualizarFechaHora();

    this.timer = setInterval(() => {
      this.actualizarFechaHora();
    }, 60000);
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

  irPerfil() {
    this.router.navigate(['/perfil']);
  }

}