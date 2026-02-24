import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Recurso } from 'src/app/servicios/api.service';

@Component({
  selector: 'app-tarjeta-recurso',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './tarjeta-recurso.component.html',
  styleUrls: ['./tarjeta-recurso.component.scss'],
})
export class TarjetaRecursoComponent {
  @Input() recurso!: Recurso;
  @Output() detalle = new EventEmitter<number>();

  onClickCard() {
    this.detalle.emit(this.recurso.id);
  }

  abrirWeb(url: string | null | undefined) {
    if (!url) return;
    window.open(url, '_blank');
  }
}
