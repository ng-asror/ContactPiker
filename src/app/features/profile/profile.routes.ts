import { Routes } from "@angular/router";

export const profileRoutes: Routes = [
	{
		path: 'profile',
		loadComponent: () => import('./pages').then((p) => p.Main),
		data: { menu: true }
	}
]