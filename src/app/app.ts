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
import { Account, Socket, Telegram } from './core';
import { AsyncPipe } from '@angular/common';
import { Plan } from './features/plan';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private socketService = inject(Socket);
  private router = inject(Router);
  private planService = inject(Plan);
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

    // start params
    const startParams = (await this.telegram.getTgUser()).start_param;
	
    if (!token) {
      this.login(startParams);
    } else {
      if (startParams) {
        this.getPlan(startParams);
      }
    }
    firstValueFrom(this.accountService.profile());
    
    // Socket
    this.socketService.initSocket(token, 'notification')
  }

  private async login(startParams: string | null): Promise<void> {
    // const initData: string = this.telegram.tg.initData;
    const initData = 'query_id=AAH3bMUqAgAAAPdsxSpHnY7H&user=%7B%22id%22%3A5012548855%2C%22first_name%22%3A%22%D0%90%D1%81%D1%80%D0%BE%D1%80%22%2C%22last_name%22%3A%22%D0%A8%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2%22%2C%22username%22%3A%22W_339A%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FKQiqYjmBpV_7fr_BWZ8V8IFv6es-Y3spZ0Y-Y9P8XtkD7Dv_-fbJpr9C-f_hSvn-.svg%22%7D&auth_date=1769598743&signature=7-yHIHZrCsrL1jGDLON5b-XclYjGcKEk3MpAQDixMgx9ZROKnZWZdhV0wwqX0BjCJMq5cAMuj2DbON-o7L26Cw&hash=bc02af670ff8f123a8b59cd45d8a79fd9dc694f8627e4cdda47b845d9ec351b3'
    if (!initData) return;

    await firstValueFrom(this.accountService.login({ initData: initData, invite_token: startParams})).then((res) => {
      if (startParams) {
        this.getPlan(startParams);
      }
      this.telegram.setCloudItem('access_token', res.access_token);
      this.telegram.setCloudItem('refresh_token', res.refresh_token);
    });
  }

  private getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) route = route.firstChild;
    return route;
  }

  async getPlan(invite_token: string): Promise<void> {
    await firstValueFrom(this.planService.getPlanForToken(invite_token)).then((res) => {
      this.router.navigateByUrl(`plans/${res.plan.id}`);
    });
  }
}
