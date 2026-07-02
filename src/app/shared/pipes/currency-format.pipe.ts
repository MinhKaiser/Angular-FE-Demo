import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '@shared';

@Pipe({
  name: 'appCurrency',
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number): string {
    return formatCurrency(value);
  }
}
