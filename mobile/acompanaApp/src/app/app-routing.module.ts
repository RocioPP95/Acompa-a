import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage),
    canActivate: [noAuthGuard]
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
    canActivate: [authGuard]
  },

  // Tablón Solidario (standalone)
  {
    path: 'tablon',
    loadComponent: () =>
      import('./pages/tablon/tablon.page').then(m => m.TablonPage),
    canActivate: [authGuard]
  },

  // Recursos (con módulo, como ya lo tienes)
  {
    path: 'recursos',
    loadChildren: () =>
      import('./pages/recursos/recursos.module').then(m => m.RecursosPageModule),
    canActivate: [authGuard]
  },

  {
    path: 'sos',
    loadComponent: () =>
      import('./pages/sos/sos.page').then(m => m.SosPage),
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
    canActivate: [authGuard]
  },
  {
    path: 'denuncias',
    loadComponent: () =>
      import('./pages/denuncias/denuncias.page').then(m => m.DenunciasPage),
    canActivate: [authGuard]
  },
  {
    path: 'ofrecer-ayuda',
    loadComponent: () =>
      import('./pages/ofrecer-ayuda/ofrecer-ayuda.page').then(m => m.OfrecerAyudaPage),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }



];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
