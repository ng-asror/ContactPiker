import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, resource } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Telegram } from '../../../../core';
import { Plan as PlanService } from '../../services'
import { firstValueFrom } from 'rxjs';
import { DaysPipe } from '../../pipe';
import { DatePipe } from '@angular/common';
interface IPopup {
	title: string;
	message: string;
	buttons: {
		id: string;
		type: 'default' | 'destructive' | 'cancel';
		text: string;
	}[];
}
@Component({
	selector: 'app-plan-detail',
	imports: [DaysPipe, DatePipe],
	templateUrl: './plan-detail.html',
	styleUrl: './plan-detail.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetail implements OnInit, OnDestroy {
	private telegram = inject(Telegram);
	private clipboard = inject(Clipboard);
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

	async sharePlan(): Promise<void> {
		const popupData: IPopup = {
			title: 'Предупреждение', message: 'Данная invite-ссылка действительна только для одного пользователя и используется один раз. Для каждого нового пользователя создавайте отдельную invite-ссылку.',
			buttons: [
				{ id: 'copy', type: 'default', text: 'Скопировать' },
				{ id: 'share', type: 'default', text: 'Поделиться' },
			]
		}
		await firstValueFrom(this.planService.sharePlan(this.id())).then((res) => {
			const full_url = `https://t.me/share/url?url=${res.msg}`;
			this.telegram.tg.showPopup(popupData, (buttonId: string) => {
				if (buttonId === 'copy') this.clipboard.copy(res.link);
				if (buttonId === 'share') this.telegram.open(full_url)
			})
		})
	}
}
