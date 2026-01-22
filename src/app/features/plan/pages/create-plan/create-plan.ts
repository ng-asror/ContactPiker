import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { planEmojies } from './plan-emojies';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Plan } from '../../services';
import { Telegram } from '../../../../core';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Router } from '@angular/router';

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
  // Mocks
  protected emojiMock = planEmojies;

  // Variables
  protected planF: FormGroup;

  // signals
  protected selectEmoji = signal<string>(this.emojiMock[0].emoji);

  ngOnInit(): void {
    this.telegram.showBackButton('/start');
  }

  constructor() {
    this.planF = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      location: ['', [Validators.required, Validators.maxLength(150)]],
      datetime: ['', Validators.required],
    });
  }

  // other functions
  protected setEmoji(emoji: string) {
    this.selectEmoji.set(emoji);
  }

  // create btn
  protected async createPlan(): Promise<void> {
    const getFormValue = this.planF.getRawValue();
    if (this.planF.valid) {
      await firstValueFrom(
        this.planService.createPlan({ ...getFormValue, emoji: this.selectEmoji() }),
      ).then(() => {
        this.routerService.navigate(['/plans']);
      });
    }
  }

  ngOnDestroy(): void {
    this.telegram.hiddeBackButton('/start');
  }
}
