import { Pipe, PipeTransform } from '@angular/core';
import { truncateText } from '@shared';

@Pipe({
  name: 'appTruncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: number = 50): string {
    return truncateText(value, maxLength);
  }
}
