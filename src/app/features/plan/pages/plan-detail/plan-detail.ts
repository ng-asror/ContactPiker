import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Telegram } from '../../../../core';

@Component({
	selector: 'app-plan-detail',
	imports: [],
	templateUrl: './plan-detail.html',
	styleUrl: './plan-detail.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetail implements OnInit, OnDestroy {
	private telegram = inject(Telegram);
	ngOnInit(): void {
		this.telegram.showBackButton('/plans')
	}
	ngOnDestroy(): void {
		this.telegram.hiddeBackButton('/plans')
	}
}
