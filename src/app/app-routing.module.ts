import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { QrscannerComponent } from './qrscanner/qrscanner.component';
import { ResultantComponent } from './resultant/resultant.component';

const routes: Routes = [
  {path:'',redirectTo:'qrscanner',pathMatch:'full'},
  {path:'qrscanner',component:QrscannerComponent},
  {path:'resultant',component:ResultantComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
