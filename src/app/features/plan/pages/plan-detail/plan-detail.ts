import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, resource, signal } from '@angular/core';
import { Telegram } from '../../../../core';
import { Plan as PlanService } from '../../services'
import { firstValueFrom } from 'rxjs';
import { DaysPipe } from '../../pipe';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-plan-detail',
	imports: [DaysPipe, DatePipe],
	templateUrl: './plan-detail.html',
	styleUrl: './plan-detail.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetail implements OnInit, OnDestroy {
	private telegram = inject(Telegram);
	private planService = inject(PlanService);

	// inputs
	id = input<string>('id');

	// resources
	plan = resource({
		loader: () => firstValueFrom(this.planService.getPlan(this.id()))
	})


	ngOnInit(): void {
		this.telegram.showBackButton('/plans')
	}
	ngOnDestroy(): void {
		this.telegram.hiddeBackButton('/plans')
	}
}
