import { Pipe, PipeTransform } from '@angular/core';
import { truncateText } from '../utils/common.utils';

@Pipe({
  name: 'appTruncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: number = 50): string {
    return truncateText(value, maxLength);
  }
}
