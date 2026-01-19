import { Routes } from '@angular/router';
import { Start } from './features';

export const routes: Routes = [
  {
    path: 'start',
    component: Start,
    data: { menu: true },
  },
  {
    path: 'plan',
    loadComponent: () => import('./features').then((p) => p.Plan),
    data: { menu: false },
  },
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
];
