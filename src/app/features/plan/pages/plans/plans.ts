import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  resource,
} from '@angular/core';
import { Plan as PlanService } from '../../services';
import { Telegram } from '../../../../core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-plans',
  imports: [],
  templateUrl: './plans.html',
  styleUrl: './plans.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Plans implements OnInit, OnDestroy {
  private telegram = inject(Telegram);
  private planService = inject(PlanService);

  // Variables
  protected currentMonth: string = new Date().toLocaleString('ru-RU', { month: 'long' });
  protected currentYear: number = new Date().getFullYear();
  protected currentMonthIndex: number = new Date().getMonth();
  protected currentMonthDays: number = new Date(
    this.currentYear,
    this.currentMonthIndex,
    0,
  ).getDate();

  // resources
  plans = resource({
    loader: () => firstValueFrom(this.planService.plansList()),
  });

  ngOnInit(): void {
    this.telegram.showBackButton('/start');
  }
  ngOnDestroy(): void {
    this.telegram.hiddeBackButton('/start');
  }
}
