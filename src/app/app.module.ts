import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { LocationsComponent } from './locations/locations.component';
import { OptionsComponent } from './options/options.component';
import { RouteComponent } from './route/route.component';

import { LocationService } from './services/location.service';
import { ModalComponent } from './modal/modal.component';
import { HaversineService } from "ng2-haversine";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BusyModule } from 'angular2-busy';

@NgModule({
  declarations: [
    AppComponent,
    LocationsComponent,
    OptionsComponent,
    RouteComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    BusyModule
  ],
  providers: [LocationService, HaversineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
