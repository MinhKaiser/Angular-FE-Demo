import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '../utils/common.utils';

@Pipe({
  name: 'appCurrency',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number): string {
    return formatCurrency(value);
  }
}
