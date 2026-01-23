import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
	ActivatedRoute,
	NavigationEnd,
	Router,
	RouterLink,
	RouterLinkActive,
	RouterOutlet,
} from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { Account, Telegram } from './core';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
	templateUrl: './app.html',
	styleUrl: './app.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
	private router = inject(Router);
	private activatedRoute = inject(ActivatedRoute);
	private telegram = inject(Telegram);
	private accountService = inject(Account);

	// SIGNALS
	show_menu = signal<boolean>(true);

	// Subjects
	profile$ = this.accountService.profile$;

	constructor() {
		this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
			const active = this.getChild(this.activatedRoute);
			const menubar = active.snapshot.data['menu'];
			this.show_menu.set(menubar);
		});
	}
	async ngOnInit(): Promise<void> {
		this.telegram.init('#fee140');
		const token: string | null = await this.telegram.getCloudStorage('access_token');
		if (!token) {
			this.login();
		}
		firstValueFrom(this.accountService.profile())
	}

	private async login(): Promise<void> {
		const initData: string =
			'query_id=AAH3bMUqAgAAAPdsxSq-TY7a&user=%7B%22id%22%3A5012548855%2C%22first_name%22%3A%22%D0%90%D1%81%D1%80%D0%BE%D1%80%22%2C%22last_name%22%3A%22%D0%A8%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2%22%2C%22username%22%3A%22W_339A%22%2C%22language_code%22%3A%22uz%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FKQiqYjmBpV_7fr_BWZ8V8IFv6es-Y3spZ0Y-Y9P8XtkD7Dv_-fbJpr9C-f_hSvn-.svg%22%7D&auth_date=1769029515&signature=1XSPIoR-_Vj95I801YG9WaPWMrcJPk01zWtDK8SM_a3heyC9cPqp__LW3jCwH57lbhNnI-MvoM_Ir0e2CUYLDA&hash=1a630e39e5179960b276a6a0b3b45863310957298b4ce0b769abe779c4871c04'; //this.telegram.tg.initData;
		const startParams = (await this.telegram.getTgUser()).start_param;
		if (!initData) return;

		await firstValueFrom(this.accountService.login({ initData: initData, invite_token: startParams })).then((res) => {
			this.telegram.setCloudItem('access_token', res.access_token);
			this.telegram.setCloudItem('refresh_token', res.refresh_token);
		});
	}

	private getChild(route: ActivatedRoute): ActivatedRoute {
		while (route.firstChild) route = route.firstChild;
		return route;
	}
}
