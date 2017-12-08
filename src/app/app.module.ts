import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { LocationsComponent } from './locations/locations.component';
import { OptionsComponent } from './options/options.component';

import { LocationService } from './services/location.service';
import { RouteComponent } from './route/route.component';


@NgModule({
  declarations: [
    AppComponent,
    LocationsComponent,
    OptionsComponent,
    RouteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [LocationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
