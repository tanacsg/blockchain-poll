import { Component, OnInit } from '@angular/core';
import { InfoService } from './info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'blockchain-poll-frontend';
  headerText ='Blockchain-Poll'

  constructor(private infoService:InfoService) {}

  ngOnInit(): void {
   this.infoService.getInfo().subscribe(info => this.headerText = info.headerText,
    err => console.log(err));
  }

}
