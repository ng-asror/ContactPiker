import { Routes } from '@angular/router';

export const notificationRoutes: Routes = [
  {
    path: 'chats',
    loadComponent: () => import('./pages').then((p) => p.ChatsList),
    data: { menu: true },
  },
];
