import { Routes } from '@angular/router';
import { planRoutes } from './features/plan';
import { Start } from './features';
import { friendsRoutes } from './features/friends';

export const routes: Routes = [
	{
		path: 'start',
		component: Start,
		data: { menu: true },
	},
	...planRoutes,
	...friendsRoutes,
	{
		path: '',
		redirectTo: 'start',
		pathMatch: 'full',
	},
];
