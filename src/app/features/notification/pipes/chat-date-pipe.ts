import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatDate'
})
export class ChatDatePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    // value = "29.01.2026"
    const parts = value.split('.');
    if (parts.length !== 3) return value;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS month: 0-11
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    const now = new Date();

    const dateDay = date.getDate();
    const dateMonth = date.getMonth();
    const dateYear = date.getFullYear();

    const nowDay = now.getDate();
    const nowMonth = now.getMonth();
    const nowYear = now.getFullYear();

    const months = [
      'янв', 'фев', 'мар', 'апр', 'май', 'июн',
      'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
    ];

    // Bugun
    if (dateDay === nowDay && dateMonth === nowMonth && dateYear === nowYear) {
      return 'Сегодня';
    }

    // Kecha
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (dateDay === yesterday.getDate() &&
        dateMonth === yesterday.getMonth() &&
        dateYear === yesterday.getFullYear()) {
      return 'Вчера';
    }

    // Ertaga
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    if (dateDay === tomorrow.getDate() &&
        dateMonth === tomorrow.getMonth() &&
        dateYear === tomorrow.getFullYear()) {
      return 'Завтра';
    }

    // boshqa sana (dd.mm.yyyy)
    return `${String(dateDay).padStart(2,'0')}.${months[dateMonth]}.${dateYear}`;
  }
}
