import {Component, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { Router } from "@angular/router";
import { SharedService } from "./shared/shared.service";
import { DeviceDetectorService } from 'ngx-device-detector';
import { HostListener } from '@angular/core';

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
  arrayValid=["ULS2KOR-Sunny","AAA4BAN-Aakanksha","AakankshaSunny","SunnyMalik-ULS2KOR"];
  resultView:any;
  outputView:any;
  changeCameraView:boolean=true;
  changeCamera=1;
  camVal1='environment';
  sharedValues={
      camSharedData:0,
      camSharedValue:"",
      resultData:""
  }
  goTo:boolean=true;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
   // window.location.href="https://www.google.com";
  }

  @ViewChild(QrScannerComponent, { static : false }) qrScannerComponent: QrScannerComponent ;

  constructor(public router:Router,public sharedService:SharedService, private deviceDetector:DeviceDetectorService){}
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
} 
  ngOnInit() {
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
        var i=0;
        console.log(result);
        for(i=0;i<this.arrayValid.length;i++){
            if(result==this.arrayValid[i]){
                this.resultView="Valid"
                break;
            }else{
                this.resultView="";
            }
        }
        if(this.resultView==""){
            this.resultView="Invalid";
        }else{
          this.outputView=result;
          this.goTo=false;
          this.callThread();
        }
        (async () => { 
            await this.delay(1000);
            this.resultView="";
        })(); 
    });
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

// The above part is all about scanning the qr-code and the below one to show the output

scanAgain(){
  this.goTo=true;
}

callThread(){
  (async () => { 
    // Do something before delay
    console.log('before delay')
    await this.delay(1500);
    console.log('after delay')
    this.goTo=true;
    await this.delay(500);
    this.openScanner();
})(); 
}

}
