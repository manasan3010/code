import { Pipe, PipeTransform } from '@angular/core';
import { Venue } from '../models/Venue';

@Pipe({
  name: 'filter'
})
export class VenueFilterPipe implements PipeTransform {

  transform(items: Venue[], searchText: string): Venue[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(it => {
      return it.name.toLowerCase().includes(searchText);
    });
  }
}
