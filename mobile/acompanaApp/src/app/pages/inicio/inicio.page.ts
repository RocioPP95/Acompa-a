import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { CabeceraComponent } from 'src/app/componentes/cabecera/cabecera.component';
import { BotonPanicoComponent } from 'src/app/componentes/boton-panico/boton-panico.component';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, CabeceraComponent,BotonPanicoComponent],
})
export class InicioPage {

  nombre = '';

  constructor(private router: Router) {
    const raw = localStorage.getItem('usuario');
    if (raw) {
      const usuario = JSON.parse(raw);
      this.nombre = usuario.nombrePublico || '';
    }
  }

  irARecursos() {
    this.router.navigateByUrl('/recursos');
  }
  irATablon() {
    this.router.navigateByUrl('/tablon');
  }
}
