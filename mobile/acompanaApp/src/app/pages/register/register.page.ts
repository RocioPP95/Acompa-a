import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/servicios/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class RegisterPage {

  rol = 'familia';
  nombrePublico = '';
  email = '';
  contrasena = '';
  error = '';
  cargando = false;

  constructor(private api: ApiService, private router: Router) {}

  registrar() {
    this.error = '';
    this.cargando = true;

    this.api.register(this.rol, this.email, this.contrasena, this.nombrePublico)
      .subscribe({
        next: () => {
          this.cargando = false;
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          this.cargando = false;
          if (err?.status === 409) {
            this.error = 'Ese email ya existe';
          } else {
            this.error = 'No se pudo registrar';
          }
        }
      });
  }
}
