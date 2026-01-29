import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IPopup, Telegram } from '../../../../core';
import { Plan } from '../../services';
import { planEmojies } from '../create-plan/plan-emojies';

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
  private routerService = inject(Router);
  // Mocks
  protected emojiMock = planEmojies;

  // Variables
  protected planF: FormGroup;

  // signals
  protected selectEmoji = signal<string>(this.emojiMock[0].emoji);
  protected plan_id = input.required<string>({ alias: 'id' });

  ngOnInit(): void {
    this.telegram.showBackButton('/start');

    if (this.plan_id()) {
      firstValueFrom(this.planService.getPlan(String(this.plan_id()))).then((res) => {
        this.planF.setValue({
          name: res.name,
          location: res.location,
          datetime: String(res.datetime).slice(0, 16),
        });
        const selectEmoji = this.emojiMock.find((e) => e.emoji === res.emoji);
        if (selectEmoji) {
          this.selectEmoji.set(selectEmoji.emoji);
        }
      });
    }
  }

  formatLocalDate(): string {
    const date = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  constructor() {
    this.planF = this.fb.group({
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
    const getFormValue = this.planF.getRawValue();
    if (this.planF.valid) {
      await firstValueFrom(
        this.planService.updatePlan(this.plan_id(), { ...getFormValue, emoji: this.selectEmoji() }),
      ).then(() => {
        this.routerService.navigate(['/plans']);
      });
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
          this.routerService.navigateByUrl('/plans');
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.telegram.hiddeBackButton('/start');
  }
}
