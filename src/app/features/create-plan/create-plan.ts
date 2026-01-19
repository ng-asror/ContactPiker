import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { planEmojies } from './plan-emojies';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Plan } from '../../core';
import { friendsMock } from './friends';

@Component({
  selector: 'app-create-plan',
  imports: [],
  templateUrl: './create-plan.html',
  styleUrl: './create-plan.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePlan {
  private planService = inject(Plan);
  private fb = inject(NonNullableFormBuilder);
  // Mocks
  protected emojiMock = planEmojies;
  protected friendsMock = friendsMock;

  // Variables
  protected planF: FormGroup;

  // signals
  protected selectEmoji = signal<string>(this.emojiMock[0].emoji);

  constructor() {
    this.planF = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      location: ['', [Validators.required, Validators.maxLength(150)]],
      datetime: ['', Validators.required],
    });
  }

  // resources
  protected friends = resource({
    loader: () => firstValueFrom(this.planService.friends()).then((res) => res),
  });

  // other functions
  protected setEmoji(emoji: string) {
    this.selectEmoji.set(emoji);
  }
}
