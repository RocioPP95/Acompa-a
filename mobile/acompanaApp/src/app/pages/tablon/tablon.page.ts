import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CabeceraComponent } from 'src/app/componentes/cabecera/cabecera.component';
import { BotonPanicoComponent } from 'src/app/componentes/boton-panico/boton-panico.component';
import { ApiService } from 'src/app/servicios/api.service';

@Component({
  selector: 'app-tablon',
  templateUrl: './tablon.page.html',
  styleUrls: ['./tablon.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    CabeceraComponent,
    BotonPanicoComponent
  ],
})
export class TablonPage {

  posts: any[] = [];
  comentariosPorPost: { [postId: number]: any[] } = {};

  constructor(private api: ApiService) { }

  ionViewWillEnter() {

    this.cargarPosts();

  }

  cargarPosts() {

    this.api.obtenerPosts().subscribe((data: any) => {

      this.posts = data;
      this.posts = data;
this.posts.forEach((p: any) => this.cargarComentarios(p.id));

    });

  }

  crearPost() {

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    const titulo = prompt("Título del anuncio");
    if (!titulo) return;

    const contenido = prompt("Contenido del anuncio");
    if (!contenido) return;

    this.api.crearPost({
      user_id: usuario.id,
      titulo,
      contenido
    }).subscribe(() => {

      this.cargarPosts();

    });

  }
  eliminarPost(id: number) {
    if (!confirm("¿Seguro que quieres borrar este anuncio?")) return;

    this.api.borrarPost(id).subscribe(() => {
      this.posts = this.posts.filter(p => p.id !== id);
    });
  }
  cargarComentarios(postId: number) {
  this.api.obtenerComentarios(postId).subscribe((data: any) => {
    this.comentariosPorPost[postId] = data;
  });
}

comentar(postId: number) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario?.id) return;

  const contenido = prompt("Escribe tu comentario");
  if (!contenido) return;

  this.api.crearComentario({ post_id: postId, user_id: usuario.id, contenido }).subscribe(() => {
    this.cargarComentarios(postId);
  });
}

}
