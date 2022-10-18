
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'convertTime' })
export class ConvertTime implements PipeTransform {
  transform(x: number | undefined): string {
    if (x) {
      return moment.utc(x * 1000).format('m:ss');
    }
    return "0:00";
  }
}
