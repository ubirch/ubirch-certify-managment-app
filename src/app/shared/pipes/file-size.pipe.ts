import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  value: number;
  unit: string;

  transform(value?: number): unknown {
    if (!value) { return ''; }

    if (value > 1024 * 1024) { this.value = parseFloat((value / 1024 / 1024).toFixed(2)); this.unit = 'MB'; }
    else if (value > 1024) { this.value = parseFloat((value / 1024).toFixed(2)); this.unit = 'kB'; }
    else { this.value = value; this.unit = 'B'; }

    return `${this.value} ${this.unit}`;
  }

}
