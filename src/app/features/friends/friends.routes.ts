import { Routes } from "@angular/router";

export const friendsRoutes: Routes = [
	{
		path: 'friends',
		loadComponent: () => import('./pages').then((c) => c.Main),
		data: { menu: true }
	}
]