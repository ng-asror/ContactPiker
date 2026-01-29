import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'day',
})
export class DaysPipe implements PipeTransform {

	transform(day: Date, arg?: 'long'): string {
		const planDate = new Date(day);
		const today = new Date();

		today.setHours(0, 0, 0, 0);

		const targetDate = new Date(planDate);
		targetDate.setHours(0, 0, 0, 0);

		const diffDays =
			(targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

		const hours = planDate.getHours().toString().padStart(2, '0');
		const minutes = planDate.getMinutes().toString().padStart(2, '0');

		if (diffDays === 0) {
			if (arg) {
				return `Сегодня, ${planDate.toLocaleDateString('ru-RU', {
					day: '2-digit',
					month: 'long',
				})} в ${hours}:${minutes}`
			}
			return `Сегодня в ${hours}:${minutes}`;
		}

		if (diffDays === 1) {
			if (arg) {
				return `Завтра, ${planDate.toLocaleDateString('ru-RU', {
					day: '2-digit',
					month: 'long',
				})} в ${hours}:${minutes}`
			}
			return `Завтра в ${hours}:${minutes}`;
		}

		if (diffDays === 2) {
			if (arg) {
				return `Послезавтра, ${planDate.toLocaleDateString('ru-RU', {
					day: '2-digit',
					month: 'long',
				})} в ${hours}:${minutes}`
			}
			return `Послезавтра в ${hours}:${minutes}`;
		}

		if (arg) {
			return planDate.toLocaleDateString('ru-RU', {
				day: '2-digit',
				month: 'long',
			}) + ` в ${hours}:${minutes}`;
		}

		// 🔹 QOLGAN HAMMA HOLATLAR UCHUN
		return planDate.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: 'long',
		}) + ` в ${hours}:${minutes}`;
	}

}
