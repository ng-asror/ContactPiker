import { Routes } from '@angular/router';

export const planRoutes: Routes = [
  {
    path: 'plans',
    loadComponent: () => import('./pages').then((p) => p.Plans),
    data: { menu: true },
  },
  {
    path: 'create-plan',
    loadComponent: () => import('./pages').then((p) => p.CreatePlan),
    data: { menu: false },
  },
];
