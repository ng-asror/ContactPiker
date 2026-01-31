import { ChangeDetectionStrategy, Component, inject, input, resource, signal } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, firstValueFrom } from 'rxjs';
import { IPopup, Telegram } from '../../../../core';
import { Plan } from '../../services';
import { planEmojies } from '../create-plan/plan-emojies';
import { Friends } from '../../../friends';

@Component({
  selector: 'app-update-plan',
  imports: [ReactiveFormsModule],
  templateUrl: './update-plan.html',
  styleUrl: './update-plan.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePlan {
  private planService = inject(Plan);
  private fb = inject(NonNullableFormBuilder);
  private telegram = inject(Telegram);
  private router = inject(Router);
  private friendsService = inject(Friends);
  private route = inject(ActivatedRoute);

  // Mocks
  protected emojiMock = planEmojies;

  // Variables
  protected planForm: FormGroup;

  // signals
  protected selectEmoji = signal<string>(this.emojiMock[0].emoji);
  protected plan_id = input.required<string>({ alias: 'id' });
  protected selectedUserIds = new Set<number>();

  // Resources
  getPlanUsers = resource({
    loader: () =>
      firstValueFrom(this.planService.getPlan(String(this.plan_id()))).then((res) => {
        this.planForm.setValue({
          name: res.name,
          location: res.location,
          datetime: String(res.datetime).slice(0, 16),
        });
        const selectEmoji = this.emojiMock.find((e) => e.emoji === res.emoji);
        if (selectEmoji) {
          this.selectEmoji.set(selectEmoji.emoji);
        }
        return {
          plan_users: res.plan_users.filter((item) => item.status === 'Принято'),
          count_user: res.count_user - 1,
          creator_id: res.user.id,
        };
      }),
  });

  ngOnInit(): void {
    this.telegram.BackButton.show();
    this.telegram.BackButton.onClick(() =>
      this.router.navigate(['../'], { relativeTo: this.route }),
    );
  }

  formatLocalDate(): string {
    const date = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  constructor() {
    this.planForm = this.fb.group({
      name: [, [Validators.required, Validators.maxLength(150)]],
      location: ['', [Validators.required, Validators.maxLength(150)]],
      datetime: ['', [Validators.required]],
    });
  }

  // other functions
  protected setEmoji(emoji: string) {
    this.selectEmoji.set(emoji);
  }

  // create btn
  protected async updatePlan(): Promise<void> {
    const planFormValues = this.planForm.getRawValue();
    if (this.planForm.valid) {
      await firstValueFrom(
        this.planService.updatePlan(this.plan_id(), {
          ...planFormValues,
          emoji: this.selectEmoji(),
        }),
      ).then((res) => {
        this.router.navigate(['/plans', res.id]);
      });
    } else {
      this.planForm.markAllAsTouched();
    }
  }

  // Delete plan
  deletePlan() {
    const deletePopup: IPopup = {
      title: 'Внимание!',
      message: 'Вы действительно хотите удалить этот план?',
      buttons: [{ id: 'delete', type: 'default', text: 'Удалить' }],
    };
    this.telegram.tg.showPopup(deletePopup, (buttonId: string) => {
      if (buttonId === 'delete') {
        firstValueFrom(this.planService.deletePlan(this.plan_id())).then(() => {
          this.router.navigateByUrl('/plans');
        });
      }
    });
  }
  // removeFriend()
  async removeFriend(user_id: number): Promise<void> {
    const res = await firstValueFrom(
      this.friendsService.removeFriend(this.plan_id(), String(user_id)),
    );
    this.getPlanUsers.update((old) =>
      old
        ? {
            ...old,
            count_user: old.count_user - 1,
            plan_users: old.plan_users.filter((user) => user.user.id !== user_id),
          }
        : old,
    );
  }

  ngOnDestroy(): void {
    this.telegram.BackButton.hide();
    this.telegram.BackButton.offClick(() =>
      this.router.navigate(['../'], { relativeTo: this.route }),
    );
  }
}
