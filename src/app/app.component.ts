import {Component, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { Router } from "@angular/router";
import { DeviceDetectorService } from 'ngx-device-detector';
import { HostListener } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  
  deviceInfo:any;  
  canvasW:any;
  canvasH:any;  
  arrayValid=["ULS2KOR-Sunny","AAA4BAN-Aakanksha","AakankshaSunny","SunnyMalik-ULS2KOR","EED1COB","UKR5COB","VV1KOR"];
  coolError=["OOps Invaid !","Whoops! we can't find you","Invalid!","Try Again!","Better luck next time!",
             "Unauthorized!"];
  resultView:any;
  outputView:any;
  changeCameraView:boolean=true;
  changeCamera=1;
  camVal1='environment';
  goTo:boolean=true;
  goToSubDiv:boolean=true;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
   // window.location.href="https://www.google.com" true;
  }

  @ViewChild(QrScannerComponent, { static : false }) qrScannerComponent: QrScannerComponent ;

  constructor(public router:Router, private deviceDetector:DeviceDetectorService
             ,private http:HttpClient,private titleService:Title){}
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
} 
  ngOnInit() {
   /* this.http.get('https://api.openweathermap.org/data/2.5/weather?q=Shamli&appid=1de1919045fb45b62a6bb665f6dbbfd7').subscribe((response)=>{
      console.log("response from api ",response);
    },(error)=>{
      console.log("Error is ",error);
    })*/
    this.titleService.setTitle("Smart Shopping");
    this.goTo=true;
     this.deviceInfo=this.deviceDetector.getDeviceInfo();
     const isMobile = this.deviceDetector.isMobile();
      const isTablet = this.deviceDetector.isTablet();
      const isDesktopDevice = this.deviceDetector.isDesktop();
      console.log(this.deviceInfo);
      console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
      console.log(isTablet);  // returns if the device us a tablet (iPad etc)
      console.log(isDesktopDevice);
     if(isMobile==true){
        this.canvasW="320";
        this.canvasH="480";
     }
     else if(isTablet==true){
       this.canvasW="680";
       this.canvasH="540"
         
     }else{
        this.canvasW="1080";
        this.canvasH="720";
     } 
    }

    ngAfterViewInit(): void {
      this.openScanner();
    }

    openScanner(){
      this.qrScannerComponent.getMediaDevices().then(devices => {
        console.log(devices);
        const videoDevices: MediaDeviceInfo[] = [];
        for (const device of devices) {
            if (device.kind.toString() === 'videoinput') {
                videoDevices.push(device);
            }
        }
        if (videoDevices.length > 0){
            let choosenDev;
            for (const dev of videoDevices){
                if (dev.label.includes(this.camVal1)){
                    choosenDev = dev;
                    break;
                }
            }
            if (choosenDev) {
                this.qrScannerComponent.chooseCamera.next(choosenDev);
            } else {
                this.qrScannerComponent.chooseCamera.next(videoDevices[this.changeCamera]);
            }
        }
    });

    this.qrScannerComponent.capturedQr.subscribe(result => {
        console.log(result);
        this.makeAPIcall(result);
    });
    }

    callValidInvalidAPI(finalResult){
      if(finalResult=="valid"){
          this.goTo=false;
          this.callThread();
      }
      else{
        this.callError();
      }
    }

    changeCam(){
        this.changeCameraView=false;
       if(this.changeCamera==1){
           this.changeCamera=0;
           this.camVal1='front';
       }
       else{
           this.changeCamera=1;
           this.camVal1='environment';
       }
       (async () => { 
        await this.delay(500);
        this.changeCameraView=true;
        await this.delay(500);
        this.openScanner();
    })(); 
    }

    callError(){
     // var errIndex=(Math.floor(Math.random() * (5 - 0 + 1) + 0));  // (max-min+1)+min
     // console.log(errIndex);
      this.goTo=false;
      this.goToSubDiv=false;
      this.resultView="Invalid";
      this.callThread();

    }

// The above part is all about scanning the qr-code and the below one to show the output

scanAgain(){
  this.goTo=true;
  this.callThread()
}

callThread(){
  (async () => { 
    // Do something before delay
 //   console.log('before delay')
    await this.delay(3000);
//    console.log('after delay')
    this.goTo=true;
    this.goToSubDiv=true;
    await this.delay(500);
    this.openScanner();
})(); 
}

makeAPIcall(codeResult){
  this.http.get('/api/getData/',{params:{ID:codeResult}}).subscribe((response)=>{
    console.log("response from api ",response);
    if(JSON.stringify(response)==JSON.stringify({val:"valid"})){
      this.callValidInvalidAPI("valid")
    }
    else{
      this.callValidInvalidAPI("Invalid");
    }
  },(error)=>{
    console.log("Error is ",error);
  })  
}

}