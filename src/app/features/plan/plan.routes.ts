import { Routes } from '@angular/router';

export const planRoutes: Routes = [
	{
		path: 'plans',
		loadComponent: () => import('./pages').then((p) => p.Plans),
		data: { menu: true },
	},
	{
		path: 'plans/:id',
		loadComponent: () => import('./pages').then(p => p.PlanDetail),
		data: { menubar: false }
	},
	{
		path: 'create-plan',
		loadComponent: () => import('./pages').then((p) => p.CreatePlan),
		data: { menu: false },
	},
];
