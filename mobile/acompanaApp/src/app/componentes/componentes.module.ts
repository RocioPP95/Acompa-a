import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TarjetaRecursoComponent } from './tarjeta-recurso/tarjeta-recurso.component';

@NgModule({
  declarations: [TarjetaRecursoComponent],
  imports: [CommonModule, IonicModule],
  exports: [TarjetaRecursoComponent]
})
export class ComponentesModule {}
