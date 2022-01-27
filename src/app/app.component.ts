import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
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

  deviceInfo: any;
  canvasW: any;
  canvasH: any;
  topText = "Invalid";
  changeCameraView: boolean = true;
  changeCamera = 1;
  camVal1 = 'environment';
  goTo: boolean = true;
  goToSubDiv: boolean = true;
  waiting: boolean = true
  welcomeResult: any

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed ');
  }

  @ViewChild(QrScannerComponent, { static: false }) qrScannerComponent: QrScannerComponent;

  constructor(public router: Router, private deviceDetector: DeviceDetectorService
    , private http: HttpClient, private titleService: Title) { }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  ngOnInit() {
    this.titleService.setTitle("Entry Smart Shop");
    console.log("Enter to Smart shop.")
    this.goTo = true;
    this.deviceInfo = this.deviceDetector.getDeviceInfo();
    const isMobile = this.deviceDetector.isMobile();
    const isTablet = this.deviceDetector.isTablet();
    const isDesktopDevice = this.deviceDetector.isDesktop();
    /*    console.log(this.deviceInfo);
        console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
        console.log(isTablet);  // returns if the device us a tablet (iPad etc)
        console.log(isDesktopDevice); */
    if (isMobile == true) {
      this.canvasW = "320";
      this.canvasH = "480";
    }
    else if (isTablet == true) {
      this.canvasW = "520";
      this.canvasH = "640"

    } else {
      this.canvasW = "1080";
      this.canvasH = "720";
    }
  }

  ngAfterViewInit(): void {
    this.openScanner();
  }

  openScanner() {
    this.qrScannerComponent.getMediaDevices().then(devices => {
      //  console.log(devices);
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
        if (device.kind.toString() === 'videoinput') {
          videoDevices.push(device);
        }
      }
      if (videoDevices.length > 0) {
        let choosenDev;
        for (const dev of videoDevices) {
          if (dev.label.includes(this.camVal1)) {
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
      if (this.waiting) {
        this.waiting = false
        this.makeAPIcall(result);
      }
    });
  }

  callValidInvalidShowMethod(finalResult, codeResult) {
    if (finalResult == "valid") {
    //  this.welcomeResult = codeResult
      this.goTo = false;
      this.goToSubDiv = true;
      this.callThread();
    }
    else {
      this.callError();
    }
    this.waiting = true
  }

  changeCam() {
    this.changeCameraView = false;
    if (this.changeCamera == 1) {
      this.changeCamera = 0;
      this.camVal1 = 'front';
    }
    else {
      this.changeCamera = 1;
      this.camVal1 = 'environment';
    }
    (async () => {
      await this.delay(200);
      this.changeCameraView = true;
      await this.delay(200);
      this.openScanner();
    })();
  }

  callError() {
    this.goTo = false;
    this.goToSubDiv = false;
    this.callThread();

  }

  // The above part is all about scanning the qr-code and the below one to show the output

  scanAgain() {
    this.goTo = true;
    this.callThread()
  }

  callThread() {
    (async () => {
      // Do something before delay
      //   console.log('before delay')
      await this.delay(3000);
      //    console.log('after delay')
      this.goTo = true;
      this.goToSubDiv = true;
      await this.delay(100);
      this.openScanner();
    })();
  }

  sendMannual(idText) {
    console.log(idText);
    if (idText != "")
      // this.callValidInvalidAPI("Invalid")
      this.makeAPIcall(idText);
  }


  makeAPIcall(codeResult) {
    this.http.post('https://20.204.68.132:8090/users/validate', { "userid": codeResult }).subscribe(async (response: any) => {
     // console.log("response from api ", response);
      if (response.result.res == "true" || response.result.res == true) {
        this.callValidInvalidShowMethod("valid", codeResult)
        this.welcomeResult=response.result.customerName
        this.http.post('https://20.204.68.132:8090/users/checkin', { "userid": codeResult }).subscribe(async (responseCheckin: any) => {
      //    console.log("response from api ", responseCheckin)
          if (responseCheckin.result.res == "true" || responseCheckin.result.res == true) {
            //    this.sendDataToAzure(codeResult)
            this.sendDataToLocalDB(codeResult)
          }
          else {
            // throw exception //NEEDS TO BE DISCUSSED.
            this.topText = "Server Error! Try Again"
           // this.callValidInvalidShowMethod("Invalid", codeResult);
          }
        })
      }
      else {
        this.topText = "User not Found! "
        this.callValidInvalidShowMethod("Invalid", codeResult);
      }
    }, (error) => {
      this.topText = "Server Error! Try Again"
      this.callValidInvalidShowMethod("Invalid", codeResult);
      console.log("Error is ", error);
    })
  }

  sendDataToLocalDB(userid) {
    return new Promise((resolve, reject) => {
      var date = Date.now()
    //  console.log(date)
      this.http.post('https://20.204.68.132:8090/users/addQREntryData', { "userid": userid, "timestamp": date }).subscribe((responseCheckin: any) => {
    //    console.log("response from api", responseCheckin)
        resolve(true);
      })
    })
  }

  sendDataToAzure(userid) {
    return new Promise((resolve, reject) => {
      var date = Date.now()
      console.log(date)
      this.http.post('https://20.204.68.132:8090/users/sendqrtoqueue', { "userid": userid, "timestamp": date }).subscribe((responseCheckin: any) => {
        console.log("response from api ", responseCheckin)
        resolve(true);
      })
    })
  }

}