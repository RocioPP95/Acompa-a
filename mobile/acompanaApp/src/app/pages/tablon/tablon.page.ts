import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CabeceraComponent } from 'src/app/componentes/cabecera/cabecera.component';
import { BotonPanicoComponent } from 'src/app/componentes/boton-panico/boton-panico.component';

@Component({
  selector: 'app-tablon',
  templateUrl: './tablon.page.html',
  styleUrls: ['./tablon.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, CabeceraComponent, BotonPanicoComponent],
})
export class TablonPage {}
