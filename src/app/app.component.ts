import {Component, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { Router } from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'angular-qrscanner';
  
  constructor(public router:Router){}

  ngOnInit() {
      
    }

    
}
