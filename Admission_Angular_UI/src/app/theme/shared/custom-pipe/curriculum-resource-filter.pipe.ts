import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'curriculumResourceFilter',
  standalone: true
})
export class CurriculumResourceFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
      if (!items) 
      {
        return [];
      }
      if (!searchText) {
        return items;
      }
      searchText = searchText.toLocaleLowerCase();
  
      return items.filter(it => {
  
        return it.fileName.toLocaleLowerCase().includes(searchText);
      });
  }

}
