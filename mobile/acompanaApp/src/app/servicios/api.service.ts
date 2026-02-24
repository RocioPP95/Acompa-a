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
}

export interface UsuarioListaItem {
  id: number;
  rol: RolUsuario;
  email: string;
  nombre_publico: string; // lo que viene de la BD en GET /usuarios
}

/** ====== SERVICE ====== */

@Injectable({ providedIn: "root" })
export class ApiService {
  // ⚠️ En navegador (ionic serve) localhost vale.
  // En móvil real: usa la IP de tu PC, ej: http://192.168.1.20:3000
  private baseUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

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
    data: { rol: string; email: string; nombrePublico: string; contrasena?: string }
  ): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/${id}`, data);
  }

  // Borrar usuario (DELETE /usuarios/:id)
  borrarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`);
  }
}
