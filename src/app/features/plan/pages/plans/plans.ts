import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnDestroy,
	OnInit,
	resource,
	signal,
} from '@angular/core';
import { Plan as PlanService } from '../../services';
import { Telegram } from '../../../../core';
import { firstValueFrom } from 'rxjs';

interface DayPlans<T> {
	day: number;
	plans: T[];
}

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
	protected days = Array.from({ length: 31 });
	protected currentMonth: string = new Date().toLocaleString('ru', { month: 'long' });
	protected currentYear: number = new Date().getFullYear();
	protected currentMonthIndex: number = new Date().getMonth() + 1;
	protected currentDay: number = new Date().getDate();
	protected currentMonthDays: number = new Date(
		this.currentYear,
		this.currentMonthIndex,
		0,
	).getDate();

	// signals
	selectDay = signal<number | null>(this.currentDay);

	// resources
	plans = resource({
		loader: () => firstValueFrom(this.planService.plansList({ filter_type: 'new' })).then((res) => {
			return this.buildMonthPlans(res.approved_and_yours_plans)
		})
	});

	ngOnInit(): void {
		this.planService.plansList({ filter_type: 'new' }).subscribe((res) => {
			console.log(res);

		})
		this.telegram.showBackButton('/start');
	}
	ngOnDestroy(): void {
		this.telegram.hiddeBackButton('/start');
	}

	// other functions
	private buildMonthPlans<T extends { datetime: string }>(plans: T[]): DayPlans<T>[] {
		const resoult: DayPlans<T>[] = Array.from(
			{ length: this.currentMonthDays },
			(_, i) => ({
				day: i + 1,
				plans: []
			})
		)
		for (const plan of plans) {
			const planDate = new Date(plan.datetime);

			if (planDate.getFullYear() === this.currentYear && planDate.getMonth() + 1 === this.currentMonthIndex) {
				const dayIndex = planDate.getDate() - 1;
				if (!resoult[dayIndex].plans) {
					resoult[dayIndex].plans = []
				}
				resoult[dayIndex].plans!.push(plan)
			}
		}

		return resoult
	}
}
