import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; 
import { NgxQRCodeModule } from "ngx-qrcode2";
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgQrScannerModule,
    HttpClientModule,
    NgxQRCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
