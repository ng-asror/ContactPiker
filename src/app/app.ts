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
    console.log(this.telegram.getTgUser());

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
    this.socketService.initSocket(token, 'notifications');
  }

  private async login(startParams: string | null): Promise<void> {
    const initData: string = this.telegram.tg.initData;
    if (!initData) return;

    await firstValueFrom(
      this.accountService.login({ initData: initData, invite_token: startParams ?? undefined }),
    ).then(() => {
      if (startParams) {
        this.getPlan(startParams);
      }
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
}
