import { Routes } from '@angular/router';
import { planRoutes } from './features/plan';
import { Start } from './features';
import { friendsRoutes } from './features/friends';
import { profileRoutes } from './features/profile';
import { notificationRoutes } from './features/notification';

export const routes: Routes = [
	{
		path: 'start',
		component: Start,
		data: { menu: true },
	},
	...planRoutes,
	...friendsRoutes,
	...profileRoutes,
	...notificationRoutes,
	{
		path: '',
		redirectTo: 'start',
		pathMatch: 'full',
	},
];
