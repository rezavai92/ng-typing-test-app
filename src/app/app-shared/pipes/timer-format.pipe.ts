import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timerFormat',
  standalone: true,
})
export class TimerFormatPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    let min = Math.floor(value / 60);
    let sec = value - min * 60;
    //sec = value < 10 ? '0' + value : value.toString();
    return `${min} : ${sec < 10 ? '0' + sec : sec}`;
  }
}
