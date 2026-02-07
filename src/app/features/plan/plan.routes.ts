import { Routes } from '@angular/router';

export const planRoutes: Routes = [
  {
    path: 'plans',
    loadComponent: () => import('./pages').then((p) => p.Plans),
    data: { menu: true },
  },
  {
    path: 'plans/:id',
    loadComponent: () => import('./pages').then((p) => p.PlanDetail),
  },
  {
    path: 'create-plan',
    loadComponent: () => import('./pages').then((p) => p.CreatePlan),
  },
  {
    path: 'plans/:id/edit',
    loadComponent: () => import('./pages').then((p) => p.UpdatePlan),
  },
  // For chat
  {
    path: 'chats/:id/plan',
    loadComponent: () => import('./pages').then((p) => p.PlanDetail),
  },
];
