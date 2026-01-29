import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  resource,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Account, IPopup, Telegram } from '../../../../core';
import { Plan as PlanService } from '../../services';
import { firstValueFrom } from 'rxjs';
import { DaysPipe } from '../../pipe';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IPlanUser } from '../../interfaces';

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

  // Variables
  protected pending: boolean = false;

  // inputs
  id = input<string>('id');

  // resources
  plan = resource({
    loader: () =>
      firstValueFrom(this.planService.getPlan(this.id())).then((res) => {
        const profile = this.profile.value();
        if (profile) {
          this.pending =
            res.plan_users.find((user) => user.id === profile.id)?.status === 'Ожидает ответа';
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
    firstValueFrom(this.planService.approvePlan(this.id())).then((res: IPlanUser) =>
      this.plan.update((plan) =>
        plan ? { ...plan, plan_users: [res, ...plan.plan_users] } : plan,
      ),
    );
  }

  protected reject(): void {
    firstValueFrom(this.planService.rejectPlan(this.id())).then((res: IPlanUser) =>
      this.plan.update((plan) =>
        plan ? { ...plan, plan_users: [{ ...res }, ...plan.plan_users] } : plan,
      ),
    );
  }

  async sharePlan(): Promise<void> {
    const popupData: IPopup = {
      title: 'Предупреждение',
      message:
        'Данная invite-ссылка действительна только для одного пользователя и используется один раз. Для каждого нового пользователя создавайте отдельную invite-ссылку.',
      buttons: [
        { id: 'copy', type: 'default', text: 'Скопировать' },
        { id: 'share', type: 'default', text: 'Поделиться' },
      ],
    };
    await firstValueFrom(this.planService.sharePlan(this.id())).then((res) => {
      const full_url = `https://t.me/share/url?url=${res.msg}`;
      this.telegram.tg.showPopup(popupData, (buttonId: string) => {
        if (buttonId === 'copy') this.clipboard.copy(res.link);
        if (buttonId === 'share') this.telegram.open(full_url);
      });
    });
  }

  ngOnDestroy(): void {
    this.telegram.hiddeBackButton('/plans');
  }
}
