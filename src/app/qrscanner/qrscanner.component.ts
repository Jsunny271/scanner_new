import {Component, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { Router } from "@angular/router";
import { SharedService } from "../shared/shared.service";
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.component.html',
  styleUrls: ['./qrscanner.component.css']
})
export class QrscannerComponent implements OnInit {

  deviceInfo:any;  
  canvasW:any;
  canvasH:any;  
  arrayValid=["ULS2KOR-Sunny","AAA4BAN-Aakanksha","AakankshaSunny","SunnyMalik-ULS2KOR"];
  resultView:any;
  changeCameraView:boolean=true;
  changeCamera=1;
  camVal1='environment';
  sharedValues={
      camSharedData:0,
      camSharedValue:"",
      resultData:""
  }

  @ViewChild(QrScannerComponent, { static : false }) qrScannerComponent: QrScannerComponent ;

  constructor(public router:Router,public sharedService:SharedService, private deviceDetector:DeviceDetectorService){}
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
} 
  ngOnInit() {
     if(this.sharedService.getMessage()!=null){
         this.changeCamera=this.sharedService.getMessage().camSharedData;
         this.camVal1=this.sharedService.getMessage().camSharedValue;
         console.log("not null");
         console.log(this.changeCamera);
         console.log(this.camVal1);
     } 
     else{
         this.sharedValues.camSharedData=this.changeCamera;
         this.sharedValues.camSharedValue=this.camVal1;
         this.sharedValues.resultData="";
         this.sharedService.setMessage(this.sharedValues);
         console.log("null");
     }
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
        this.sharedValues.resultData=result;
        this.sharedValues.camSharedData=this.changeCamera;
        this.sharedValues.camSharedValue=this.camVal1;
        this.sharedService.setMessage(this.sharedValues);
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
        this.router.navigate(['/resultant']);
        }
    }); 
    }

    changeCam(){
        this.changeCameraView=false;
       if(this.changeCamera==1){
           this.changeCamera=0;
           this.camVal1='front';
           this.sharedValues.camSharedData=0;
           this.sharedValues.camSharedValue='front';
           this.sharedService.setMessage(this.sharedValues);    
       }
       else{
           this.changeCamera=1;
           this.camVal1='environment';
           this.sharedValues.camSharedData=1;
           this.sharedValues.camSharedValue='environment';
           this.sharedService.setMessage(this.sharedValues);
       }
       (async () => { 
        await this.delay(1000);
        this.changeCameraView=true;
        await this.delay(1000);
        this.openScanner();
        
    })(); 
    }
}
