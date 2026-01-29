import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  resource,
  signal,
  ViewChild,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Account, IPopup, Telegram } from '../../../../core';
import { Plan as PlanService } from '../../services';
import { firstValueFrom } from 'rxjs';
import { DaysPipe } from '../../pipe';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IPlanUser } from '../../interfaces';
import { Friends, IFriend } from '../../../friends';

@Component({
  selector: 'app-plan-detail',
  imports: [RouterLink, DaysPipe, DatePipe],
  templateUrl: './plan-detail.html',
  styleUrl: './plan-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetail implements OnInit, OnDestroy {
  private telegram = inject(Telegram);
  private clipboard = inject(Clipboard);
  private planService = inject(PlanService);
  private accountService = inject(Account);
  private friendsService = inject(Friends);
  private cd = inject(ChangeDetectorRef);

  // Variables
  protected pending = signal<boolean>(true);
  protected addFriendLoading = false;

  // inputs
  id = input<string>('id');

  // Signals
  selectedFriendsId = new Set<number>();
  friends: IFriend[] = [];

  // ViewChilds
  @ViewChild('shareModal') shareModal!: ElementRef<HTMLDialogElement>;

  // resources
  plan = resource({
    loader: () =>
      firstValueFrom(this.planService.getPlan(this.id())).then((res) => {
        const profile = this.profile.value();
        if (profile) {
          const user = res.plan_users.find((u) => u.user.id === profile.id);
          this.pending.set(user ? user.status === 'Ожидает ответа' : false);
        }
        return res;
      }),
  });

  profile = resource({
    loader: () => firstValueFrom(this.accountService.profile$),
  });

  ngOnInit(): void {
    this.telegram.showBackButton('/plans');
  }

  protected approve(): void {
    this.pending.set(false);
    firstValueFrom(this.planService.approvePlan(this.id())).then((res: IPlanUser) =>
      this.plan.update((plan) => {
        if (!plan) return plan;
        const updatedPlanUsers = plan.plan_users.map((pu) =>
          pu.id === res.id ? { ...pu, ...res } : pu,
        );
        return { ...plan, plan_users: updatedPlanUsers };
      }),
    );
  }

  protected reject(): void {
    this.pending.set(false);
    firstValueFrom(this.planService.rejectPlan(this.id())).then((res: IPlanUser) =>
      this.plan.update((plan) => {
        if (!plan) return plan;

        const updatedPlanUsers = plan.plan_users.map((pu) =>
          pu.id === res.id ? { ...pu, ...res } : pu,
        );

        return { ...plan, plan_users: updatedPlanUsers };
      }),
    );
  }

  async sharePlan(): Promise<void> {
    await this.getFriends();

    const popupData: IPopup = {
      title: 'Предупреждение',
      message: 'Данная invite-ссылка действительна только для одного пользователя...',
      buttons: [
        { id: 'copy', type: 'default', text: 'Скопировать' },
        { id: 'share', type: 'default', text: 'Поделиться' },
      ],
    };

    if (this.friends.length) {
      popupData.buttons.unshift({ id: 'friends', type: 'default', text: 'Друзья' });
    }

    this.telegram.tg.showPopup(popupData, async (buttonId: string) => {
      if (buttonId === 'copy') {
        const res = await firstValueFrom(this.planService.sharePlan(this.id()));
        this.clipboard.copy(res.link);
      }
      if (buttonId === 'share') {
        const res = await firstValueFrom(this.planService.sharePlan(this.id()));
        const full_url = `https://t.me/share/url?url=${res.msg}`;
        this.telegram.open(full_url);
      }
      if (buttonId === 'friends') {
        this.cd.detectChanges();
        this.shareModal.nativeElement.showModal();
      }
    });
  }

  private async getFriends(): Promise<void> {
    const getPlan = this.plan.value();

    if (getPlan) {
      const plan_users = getPlan.plan_users;
      const res = await firstValueFrom(this.friendsService.getFriends());
      this.friends = res.friends.filter(
        (item) => !plan_users.some((pu) => pu.user.id === item.user.id),
      );
    }
  }

  protected toggleFriends(id: number): void {
    this.selectedFriendsId.has(id)
      ? this.selectedFriendsId.delete(id)
      : this.selectedFriendsId.add(id);
  }

  // addFriends
  async addFriends(): Promise<void> {
    this.addFriendLoading = true;
    await firstValueFrom(
      this.planService.sendFriends(this.id(), Array.from(this.selectedFriendsId)),
    ).finally(() => {
      this.plan.reload();
    });
  }

  ngOnDestroy(): void {
    this.telegram.hiddeBackButton('/plans');
  }
}
