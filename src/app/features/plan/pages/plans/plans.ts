import {
	ChangeDetectionStrategy,
	Component,
	inject,
	resource,
	signal,
} from '@angular/core';
import { Plan as PlanService } from '../../services';
import { Telegram } from '../../../../core';
import { firstValueFrom } from 'rxjs';
import { IApprovedAndYoursPlan } from '../../interfaces';
import { DaysPipe } from '../../pipe';
import { RouterLink } from '@angular/router';

interface DayPlans<T> {
	day: number;
	plans: T[];
}
interface NearPlans<T> {
	tomorrow: T[];
	dayAfterTomorrow: T[];
}

@Component({
	selector: 'app-plans',
	imports: [DaysPipe, RouterLink],
	templateUrl: './plans.html',
	styleUrl: './plans.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Plans {
	private telegram = inject(Telegram);
	private planService = inject(PlanService);

	// Variables
	protected days = Array.from({ length: 31 });
	protected currentMonth: string = new Date().toLocaleString('ru-RU', { month: 'long' });
	protected currentYear: number = new Date().getFullYear();
	protected currentMonthIndex: number = new Date().getMonth() + 1;
	protected currentDay: number = new Date().getDate();
	protected currentMonthDays: number = new Date(
		this.currentYear,
		this.currentMonthIndex,
		0,
	).getDate();
	selectDayPlans: IApprovedAndYoursPlan[] = [];

	// signals
	selectDay = signal<number | null>(this.currentDay);

	// resources
	plans = resource({
		loader: () => firstValueFrom(this.planService.plansList({})).then((res) => {
			return this.buildMonthPlans(res.approved_and_yours_plans)
		})
	});

	// other functions
	private buildMonthPlans(
		plans: IApprovedAndYoursPlan[]
	): { monthPlans: DayPlans<IApprovedAndYoursPlan>[]; nearPlans: NearPlans<IApprovedAndYoursPlan> } {

		const result: DayPlans<IApprovedAndYoursPlan>[] = Array.from(
			{ length: this.currentMonthDays },
			(_, i) => ({
				day: i + 1,
				plans: []
			})
		);

		const nearPlans: NearPlans<IApprovedAndYoursPlan> = {
			tomorrow: [],
			dayAfterTomorrow: [],
		};

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		const dayAfterTomorrow = new Date(today);
		dayAfterTomorrow.setDate(today.getDate() + 2);

		for (const plan of plans) {
			const planDate = new Date(plan.datetime);
			planDate.setHours(0, 0, 0, 0);
			// today plans 
			if (planDate.getFullYear() === this.currentYear &&
				planDate.getMonth() + 1 === this.currentMonthIndex && planDate.getDate() === this.currentDay) {
				this.selectDayPlans.push(plan)
			}
			// 🔹 Month plans
			if (
				planDate.getFullYear() === this.currentYear &&
				planDate.getMonth() + 1 === this.currentMonthIndex
			) {
				const dayIndex = planDate.getDate() - 1;
				result[dayIndex].plans!.push(plan);

			}

			// 🔹 tomorrow plans
			if (planDate.getTime() === tomorrow.getTime()) {
				nearPlans.tomorrow.push(plan);
			}

			// 🔹 dayAfterTomorrow plans
			if (planDate.getTime() === dayAfterTomorrow.getTime()) {
				nearPlans.dayAfterTomorrow.push(plan);
			}
		}
		return {
			monthPlans: result,
			nearPlans,
		};
	}
}
