import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Recurso } from 'src/app/servicios/api.service';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.page.html',
  styleUrls: ['./recursos.page.scss'],
  standalone:false
})
export class RecursosPage implements OnInit {

  recursos: Recurso[] = [];
  cargando = false;
  error = "";

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.cargarRecursos();
  }

  cargarRecursos(event?: any) {
    this.error = "";
    this.cargando = true;

    this.api.obtenerRecursos().subscribe({
      next: (data) => {
        this.recursos = data;
        this.cargando = false;
        event?.target?.complete?.();
      },
      error: () => {
        this.error = "No se pudieron cargar los recursos";
        this.cargando = false;
        event?.target?.complete?.();
      }
    });
  }

  verDetalle(id: number) {
    console.log("ID recurso:", id);
  }
}
