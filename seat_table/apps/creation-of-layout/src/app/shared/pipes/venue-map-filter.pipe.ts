import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'venumMapFilter'
})
export class VenueMapFilterPipe implements PipeTransform {

  transform(value: any[], filterString: string, propName: string): any {
    if (value && value.length === 0 || filterString === '') {
      return value;
    }
    const resultArray = [];
    if (value && value.length > 0) {
      for (const item of value) {
        if (filterString === 'All') {
          resultArray.push(item);
        } else if (item[propName] === filterString) {
          resultArray.push(item);
        }
      }
    }
    return resultArray;
  }
}
