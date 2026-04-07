import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from 'src/app/servicios/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
})
export class PerfilPage {
  usuario: any = {};
  nombrePublico = '';
  avatarUrl = '';
  mensaje = '';
  error = '';
  misPosts: any[] = [];

  constructor(private api: ApiService, private router:Router) { }

  ionViewWillEnter() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.nombrePublico = this.usuario?.nombrePublico || '';
    this.avatarUrl = this.usuario?.avatarUrl || '';
    this.api.obtenerPostsUsuario(this.usuario.id).subscribe((data: any) => {
      this.misPosts = data;
    });
  }

  guardar() {
    this.mensaje = '';
    this.error = '';

    if (!this.usuario?.id) {
      this.error = 'No hay usuario logueado';
      return;
    }

    //  VALIDACIÓN DEL NOMBRE
    if (!this.nombrePublico.trim()) {
      this.error = "El nombre público no puede estar vacío";
      return;
    }

    // Llamada al backend
    this.api.actualizarUsuario(this.usuario.id, {
      rol: this.usuario.rol,
      email: this.usuario.email,
      nombrePublico: this.nombrePublico,
      avatarUrl: this.avatarUrl || null,
    }).subscribe(
      () => {
        this.usuario.nombrePublico = this.nombrePublico;
        this.usuario.avatarUrl = this.avatarUrl || null;
        localStorage.setItem("usuario", JSON.stringify(this.usuario));
        this.mensaje = "Perfil actualizado ✅";
      },
      () => this.error = "No se pudo guardar"
    );
  }
  logout() {
  localStorage.removeItem('usuario');
  this.router.navigate(['/login']);
}
}