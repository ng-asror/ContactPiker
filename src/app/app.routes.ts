import { Routes } from '@angular/router';
import { Start } from './features';

export const routes: Routes = [
  {
    path: 'start',
    component: Start,
    data: { menu: true },
  },
  {
    path: 'plans',
    loadComponent: () => import('./features').then((p) => p.Plan),
    data: { menu: true },
  },
  {
    path: 'create-plan',
    loadComponent: () => import('./features').then((p) => p.CreatePlan),
    data: { menu: false },
  },
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
];
