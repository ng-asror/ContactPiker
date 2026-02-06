import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { Account, INotification, Socket, Telegram } from './core';
import { Notification } from './features/notification';
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
  private notifService = inject(Notification);

  // SIGNALS
  loader = signal<boolean>(false);
  notification = signal<INotification | null>(null);
  show_menu = signal<boolean>(true);

  // Subjects
  profile$ = this.accountService.profile$;

  // Variables
  private notificationTimeout: any;
  private audio = new Audio('sounds/notification-alert-toast.mp3');

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      const active = this.getChild(this.activatedRoute);
      const menubar = active.snapshot.data['menu'];
      this.show_menu.set(menubar ?? false);
    });
  }
  async ngOnInit(): Promise<void> {
    this.telegram.init('#fee140');
    let token: string | null = await this.telegram.getCloudStorage('access_token');

    // start params
    const startParams = (await this.telegram.getTgUser()).start_param;
    startParams ? this.loader.set(false) : this.loader.set(true);

    if (!token) {
      await this.login(startParams);
      token = await this.telegram.getCloudStorage('access_token');
    } else {
      if (startParams) {
        await this.getPlan(startParams);
      }
      await this.getProfile();
    }

    // Socket
    this.socketService.initSocket(token!, 'notifications');
    this.notificationInit();
  }

  private notificationInit(): void {
    let room_id: number | null = null;
    this.socketService.chatId$.subscribe((res) => (room_id = res));
    this.socketService.listenNotification().subscribe({
      next: (res) => {
        if (res.data.room_id === room_id) return;
        this.notification.set(res);

        this.audio.volume = 1;
        this.audio.play().catch((err) => console.warn('Audio playback blocked:', err));

        if (this.notificationTimeout) {
          clearTimeout(this.notificationTimeout);
        }

        this.notificationTimeout = setTimeout(() => {
          this.notification.set(null);
          this.notificationTimeout = null;
        }, 3000);
      },
    });
  }

  private async login(startParams: string | null): Promise<void> {
    const initData: string = this.telegram.tg.initData;
    if (!initData) return;

    await firstValueFrom(
      this.accountService.login({ initData: initData, invite_token: startParams ?? undefined }),
    ).then(async () => {
      await this.getProfile();
      if (startParams) {
        await this.getPlan(startParams);
      }
    });
  }

  async getProfile(): Promise<void> {
    await firstValueFrom(this.accountService.profile());
  }

  private getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) route = route.firstChild;
    return route;
  }

  async getPlan(invite_token: string): Promise<void> {
    await firstValueFrom(this.planService.getPlanForToken(invite_token))
      .then((res) => {
        this.router.navigateByUrl(`plans/${res.plan.id}`).finally(() => this.loader.set(false));
      })
      .finally(() => {
        this.loader.set(false);
      });
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach((input: Element) => {
        const element = input as HTMLElement;
        element.blur();
      });
    }
  }

  protected async readNotif(notif_id: string, room_id: string): Promise<void> {
    await firstValueFrom(this.notifService.read(notif_id)).then(() => {
      this.router.navigate(['chats', room_id]);
    });
  }
}
