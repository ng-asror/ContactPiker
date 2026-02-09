// plan.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'planRus'
})
export class PlanRusPipe implements PipeTransform {
  transform(value: number): string {
    const lastDigit = value % 10;
    const lastTwoDigits = value % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return `${value} планов`;
    }

    switch (lastDigit) {
      case 1:
        return `${value} план`;
      case 2:
      case 3:
      case 4:
        return `${value} плана`;
      default:
        return `${value} планов`;
    }
  }
}
