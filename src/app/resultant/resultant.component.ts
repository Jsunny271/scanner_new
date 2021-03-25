import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SharedService } from "../shared/shared.service";


@Component({
  selector: 'app-resultant',
  templateUrl: './resultant.component.html',
  styleUrls: ['./resultant.component.css']
})
export class ResultantComponent implements OnInit {

  outputView:any;

  constructor(public router:Router,public sharedService:SharedService) { }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
} 
  ngOnInit(): void {
    (async () => { 
      // Do something before delay
      console.log('before delay')
      this.outputView=this.sharedService.getMessage();
      await this.delay(3000);
      // Do something after
      console.log('after delay')
        this.router.navigate(['/qrscanner']);
  })(); 
  }

  scanAgain(){
    this.router.navigate(['/qrscanner']);
  }

}
