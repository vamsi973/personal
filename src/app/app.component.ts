import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'personal';
  dateFromObjectId(objectId: any) {
    objectId = objectId.target.value;
    console.log(new Date(parseInt(objectId.substring(0, 8), 16) * 1000));
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
  };
}
