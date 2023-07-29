import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  date:any;
  dateFromObjectId(objectId: any) {
    objectId = objectId.target.value;
    console.log(new Date(parseInt(objectId.substring(0, 8), 16) * 1000));
    this.date = new Date(parseInt(objectId.substring(0, 8), 16) * 1000)
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
  };
}
