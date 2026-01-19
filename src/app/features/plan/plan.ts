import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Telegram } from '../../core';

@Component({
  selector: 'app-plan',
  imports: [],
  templateUrl: './plan.html',
  styleUrl: './plan.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Plan implements OnInit, OnDestroy {
  private telegram = inject(Telegram);

  ngOnInit(): void {
    this.telegram.showBackButton('/start');
  }
  ngOnDestroy(): void {
    this.telegram.hiddeBackButton('/start');
  }
}
