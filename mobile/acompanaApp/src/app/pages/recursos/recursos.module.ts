import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecursosPageRoutingModule } from './recursos-routing.module';

import { RecursosPage } from './recursos.page';
import { TarjetaRecursoComponent } from 'src/app/componentes/tarjeta-recurso/tarjeta-recurso.component';
import { CabeceraComponent } from 'src/app/componentes/cabecera/cabecera.component';
import { BotonPanicoComponent } from 'src/app/componentes/boton-panico/boton-panico.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecursosPageRoutingModule,TarjetaRecursoComponent,CabeceraComponent,BotonPanicoComponent
    
  ],
  declarations: [RecursosPage]
})
export class RecursosPageModule {}
