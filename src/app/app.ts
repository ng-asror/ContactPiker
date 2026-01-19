import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
import { Account, Telegram } from './core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private cds = inject(ChangeDetectorRef);
  private telegram = inject(Telegram);
  private accountService = inject(Account);

  // SIGNALS
  show_menu = signal<boolean>(true);

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      const active = this.getChild(this.activatedRoute);
      const menubar = active.snapshot.data['menu'];
      this.show_menu.set(menubar);
    });
  }
  async ngOnInit(): Promise<void> {
    this.telegram.init('#fee140');
    const token: string | null = await this.telegram.getCloudStorage('token');
    console.log(!!token, token);

    if (!!token) {
      this.login();
    }
  }

  private async login(): Promise<void> {
    const initData: string = this.telegram.tg.initData;
    if (!initData) return;
    await firstValueFrom(this.accountService.login({ initData: initData })).then((res) => {
      this.telegram.setCloudItem('token', res);
    });
  }

  private getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) route = route.firstChild;
    return route;
  }
}
