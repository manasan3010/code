import { Pipe, PipeTransform } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { PropertyNode } from '../data/properties.data';

@Pipe({
    name: 'PropertiePipe'
})
export class PropertiePipePipe implements PipeTransform {
    transform(items: MatTreeNestedDataSource<PropertyNode>, searchText: string): any {
        if (!items) {
            return [];
        }

        if (!searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();

        return items.data.filter(parent => {
            if (parent.name.toLowerCase().includes(searchText)) {
                return parent.name.toLowerCase().includes(searchText);
            } else {
                if (parent.children) {
                    return parent.children.filter(child => {
                        if (child.name.toLowerCase().includes(searchText)) {
                            return parent.name.toLowerCase().includes(searchText);
                        }
                    });
                }
            }
        });
    }
}
