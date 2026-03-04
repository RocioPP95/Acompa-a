import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage),
  },

  // Registro
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then(m => m.RegisterPage),
  },

  // Inicio
  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/inicio/inicio.page').then(m => m.InicioPage),
  },

  // Tablón Solidario (standalone)
  {
    path: 'tablon',
    loadComponent: () =>
      import('./pages/tablon/tablon.page').then(m => m.TablonPage),
  },

  // Recursos (con módulo, como ya lo tienes)
  {
    path: 'recursos',
    loadChildren: () =>
      import('./pages/recursos/recursos.module').then(m => m.RecursosPageModule),
  },
 
  {
    path: 'sos',
    loadComponent: () =>
      import('./pages/sos/sos.page').then(m => m.SosPage),
  },
  {
  path: 'perfil',
  loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage)
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
