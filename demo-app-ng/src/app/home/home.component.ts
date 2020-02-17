import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public static h1Style = true;
  users: Object;

  constructor(private data: DataService) {
  }

  ngOnInit() {
    this.data.getUsers().subscribe(data => {
      this.users = data;
      console.log(this.users)
    })

  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    // Your Logic!
  }

  firstClick() {
    // this.h1Style = !this.h1Style
  }


}
