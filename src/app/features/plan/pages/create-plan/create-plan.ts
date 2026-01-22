import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { planEmojies } from './plan-emojies';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Plan } from '../../services';
import { Telegram } from '../../../../core';

@Component({
  selector: 'app-create-plan',
  imports: [],
  templateUrl: './create-plan.html',
  styleUrl: './create-plan.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePlan implements OnInit, OnDestroy {
  private planService = inject(Plan);
  private fb = inject(NonNullableFormBuilder);
  private telegram = inject(Telegram);
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

  // resources
  protected friends = resource({
    loader: () => firstValueFrom(this.planService.friends()).then((res) => res.friends),
  });

  // other functions
  protected setEmoji(emoji: string) {
    this.selectEmoji.set(emoji);
  }

  ngOnDestroy(): void {
    this.telegram.hiddeBackButton('/start');
  }
}
