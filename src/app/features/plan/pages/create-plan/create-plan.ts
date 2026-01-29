import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { planEmojies } from './plan-emojies';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Plan } from '../../services';
import { Telegram } from '../../../../core';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Router } from '@angular/router';
import { Friends } from '../../../friends/services';

@Component({
  selector: 'app-create-plan',
  imports: [ReactiveFormsModule],
  templateUrl: './create-plan.html',
  styleUrl: './create-plan.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePlan implements OnInit, OnDestroy {
  private planService = inject(Plan);
  private fb = inject(NonNullableFormBuilder);
  private telegram = inject(Telegram);
  private routerService = inject(Router);
  private friendsService = inject(Friends);

  // Mocks
  protected emojiMock = planEmojies;

  // Variables
  protected planF: FormGroup;
  protected loader: boolean = false;

  // signals
  protected selectEmoji = signal<string>(this.emojiMock[0].emoji);
  protected plan_id = input.required<string | null>({ alias: 'id' });
  protected selectedUserIds = new Set<number>();

  // resources
  getFriends = resource({
    loader: () => firstValueFrom(this.friendsService.getFriends()).then((res) => res.friends),
  });

  ngOnInit(): void {
    this.telegram.showBackButton('/start');
  }

  constructor() {
    this.planF = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      location: ['', [Validators.required, Validators.maxLength(150)]],
      datetime: ['', [Validators.required]],
    });
  }

  // other functions
  protected setEmoji(emoji: string) {
    this.selectEmoji.set(emoji);
  }

  // create btn
  protected async createPlan(): Promise<void> {
    this.loader = true;
    const getFormValue = this.planF.getRawValue();
    if (this.planF.valid) {
      await firstValueFrom(
        this.planService.createPlan({ ...getFormValue, emoji: this.selectEmoji() }),
      ).then((res) => {
        firstValueFrom(
          this.planService.sendFriends(String(res.id), Array.from(this.selectedUserIds)),
        ).then(() => {
          this.routerService.navigate(['/plans']);
        });
      });
    }
  }

  formatLocalDate(): string {
    const date = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  protected toggleFriends(id: number): void {
    this.selectedUserIds.has(id) ? this.selectedUserIds.delete(id) : this.selectedUserIds.add(id);
  }

  ngOnDestroy(): void {
    this.telegram.hiddeBackButton('/start');
  }
}
