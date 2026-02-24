import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/servicios/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class LoginPage {

  email = '';
  contrasena = '';
  error = '';
  cargando = false;

  constructor(private api: ApiService, private router: Router) {}

  hacerLogin() {
    this.error = '';
    this.cargando = true;

    this.api.login(this.email, this.contrasena).subscribe({
      next: (usuario) => {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.cargando = false;
        this.router.navigateByUrl('/inicio');
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
        this.cargando = false;
      }
    });
  }
}
