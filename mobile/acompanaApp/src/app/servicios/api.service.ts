import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

/** ====== MODELOS ====== */

export interface Recurso {
  id: number;
  tipo: string;
  nombre: string;
  direccion: string | null;
  latitud: string | number;
  longitud: string | number;
  telefono: string | null;
  web: string | null;
  descripcion_servicios: string | null;
  creado_en: string;
}

export type RolUsuario = "familia" | "asociacion" | "admin" | string;

export interface Usuario {
  id: number;
  rol: RolUsuario;
  email: string;
  nombrePublico: string;
  token: string;
  avatarUrl?: string | null;
}

export interface UsuarioListaItem {
  id: number;
  rol: RolUsuario;
  email: string;
  nombre_publico: string; // lo que viene de la BD en GET /usuarios
  avatarUrl?: string | null;
}
export interface AlertaSOS {
  id?: number;
  user_id: number;
  lat: number;
  lng: number;
  created_at?: string;
}
export interface ContactoConfianza {
  id: number;
  user_id: number;
  nombre: string;
  telefono: string;
  created_at?: string;
}
export interface Post {
  id: number
  titulo: string
  contenido: string
  nombre_publico: string
  avatar_url?: string
  created_at: string
}
export interface CommentItem {
  id: number;
  post_id: number;
  user_id: number;
  contenido: string;
  created_at: string;
  nombre_publico: string;
  avatar_url?: string | null;
}
export interface OfertaAyuda {
  id: number;
  user_id?: number | null;
  tipo: string;
  titulo: string;
  descripcion: string;
  zona?: string | null;
  telefono?: string | null;
  email?: string | null;
  created_at: string;
}

/** ====== SERVICE ====== */

@Injectable({ providedIn: "root" })
export class ApiService {
  //  En navegador (ionic serve) localhost vale.
  // En móvil real: usa la IP de tu PC, ej: http://192.168.1.20:3000
  private baseUrl = "http://localhost:3000";

  constructor(private http: HttpClient) { }

  /** ====== RECURSOS (CRUD) ====== */

  obtenerRecursos(): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(`${this.baseUrl}/recursos`);
  }

  obtenerRecurso(id: number): Observable<Recurso> {
    return this.http.get<Recurso>(`${this.baseUrl}/recursos/${id}`);
  }

  crearRecurso(data: Partial<Recurso>): Observable<any> {
    // data debe incluir al menos: tipo, nombre, latitud, longitud
    return this.http.post(`${this.baseUrl}/recursos`, data);
  }

  actualizarRecurso(id: number, data: Partial<Recurso>): Observable<any> {
    return this.http.put(`${this.baseUrl}/recursos/${id}`, data);
  }

  borrarRecurso(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/recursos/${id}`);
  }

  /** ====== USUARIOS ====== */

  // Registro (POST /usuarios/register)
  register(rol: string, email: string, contrasena: string, nombrePublico: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/register`, {
      rol,
      email,
      contrasena,
      nombrePublico,
    });
  }

  // Login (POST /usuarios/login)
  login(email: string, contrasena: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios/login`, {
      email,
      contrasena,
    });
  }

  // Listar usuarios (GET /usuarios) -> devuelve nombre_publico
  obtenerUsuarios(): Observable<UsuarioListaItem[]> {
    return this.http.get<UsuarioListaItem[]>(`${this.baseUrl}/usuarios`);
  }

  // Obtener usuario por id (GET /usuarios/:id)
  obtenerUsuario(id: number): Observable<UsuarioListaItem> {
    return this.http.get<UsuarioListaItem>(`${this.baseUrl}/usuarios/${id}`);
  }

  // Actualizar usuario (PUT /usuarios/:id)
  actualizarUsuario(
    id: number,
    data: { rol: string; email: string; nombrePublico: string; avatarUrl?: string | null; contrasena?: string }
  ) {
    return this.http.put(`${this.baseUrl}/usuarios/${id}`, data);
  }

  // Borrar usuario (DELETE /usuarios/:id)
  borrarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`);
  }

  crearAlerta(data: { user_id: number; lat: number; lng: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/alerts`, data);
  }

  obtenerAlertasUsuario(userId: number): Observable<AlertaSOS[]> {
    return this.http.get<AlertaSOS[]>(`${this.baseUrl}/alerts/user/${userId}`);
  }

  obtenerContactosUsuario(userId: number): Observable<ContactoConfianza[]> {
    return this.http.get<ContactoConfianza[]>(`${this.baseUrl}/contactos/user/${userId}`);
  }

  crearContacto(data: { user_id: number; nombre: string; telefono: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/contactos`, data);
  }

  borrarContacto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/contactos/${id}`);
  }
  cerrarAlerta(id: number) {
    return this.http.patch(`${this.baseUrl}/alerts/${id}/close`, {});
  }
  obtenerPosts() {
    return this.http.get<Post[]>(this.baseUrl + "/posts")
  }

  crearPost(data: any) {
    return this.http.post(this.baseUrl + "/posts", data)
  }
  borrarPost(id: number) {
    return this.http.delete(`${this.baseUrl}/posts/${id}`);
  }
  obtenerComentarios(postId: number): Observable<CommentItem[]> {
    return this.http.get<CommentItem[]>(`${this.baseUrl}/comments/post/${postId}`);
  }

  crearComentario(data: { post_id: number; user_id: number; contenido: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/comments`, data);
  }
  obtenerPostsUsuario(userId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/posts/user/${userId}`);
  }
  obtenerOfertas(): Observable<OfertaAyuda[]> {
    return this.http.get<OfertaAyuda[]>(`${this.baseUrl}/ofertas`);
  }

  crearOferta(data: Partial<OfertaAyuda>): Observable<any> {
    return this.http.post(`${this.baseUrl}/ofertas`, data);
  }

}
