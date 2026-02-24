import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boton-panico',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './boton-panico.component.html',
  styleUrls: ['./boton-panico.component.scss'],
})
export class BotonPanicoComponent {
  constructor(private router: Router) {}

  irASos() {
    this.router.navigateByUrl('/sos');
  }
}
