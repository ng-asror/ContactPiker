import { Routes } from '@angular/router';
import { planRoutes } from './features/plan';
import { Start } from './features';

export const routes: Routes = [
  {
    path: 'start',
    component: Start,
    data: { menu: true },
  },
  ...planRoutes,
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
];
