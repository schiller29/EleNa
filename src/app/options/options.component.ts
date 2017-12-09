import { Component, Input, OnInit } from '@angular/core';
import { Options } from '../models/options';
import { Location } from '../models/location';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  constructor(private locationService: LocationService) { }

  startLocation: Location;
  @Input() startLongitude: number;
  @Input() startLatitude: number;

  endLocation: Location;
  @Input() endLongitude: number;
  @Input() endLatitude: number;

  options: Options;
  maximizeElevation: boolean;
  minimizeElevation: boolean;
  limit: number;

  startLatitudeError: boolean = false;
  startLongitudeError: boolean = false;
  endLatitudeError: boolean = false;
  endLongitudeError: boolean = false;

  buttonText: string;
  mapRoute: boolean;

  ngOnInit() {
    this.maximizeElevation = false;
    this.minimizeElevation = false;
    this.limit = 0;
    this.buttonText = "Route";
    this.mapRoute = false;
  }

  elevationClick(val){
    if(this.maximizeElevation && this.minimizeElevation){
      if(val=="maximize"){
        this.minimizeElevation = false;
      } else {
        this.maximizeElevation = false;
      }
    }
  }

  submit() {
    if (!this.checkInputError()){
      this.loadLocations(this.startLatitude, this.startLongitude, this.endLatitude, this.endLongitude);
    } else {
      this.mapRoute = false;
      this.buttonText = 'Route';
    }
  }

  checkInputError(){
    var inputError = false;
    if(isNaN(this.startLatitude)){
      this.startLatitudeError = true;
      inputError = true;
    }
    if(isNaN(this.startLongitude)){
      this.startLongitudeError = true;
      inputError = true;
    }
    if(isNaN(this.endLatitude)){
      this.endLatitudeError = true;
      inputError = true;
    }
    if(isNaN(this.endLongitude)){
      this.endLongitudeError = true;
      inputError = true;
    }
    return inputError;
  }
  
  startRoute(){
    console.log(this.startLocation);
    console.log(this.endLocation);
    console.log("Maximize: " + this.maximizeElevation);
    console.log("Minimize: " + this.minimizeElevation);
    console.log("Limit: " + this.limit);
    //only execute if locations loaded ok
    if(this.startLocation && this.endLocation){
      this.mapRoute = true;
      this.buttonText = 'Re-route';
    }
  }
  // needs rewriting
  loadLocations(sLatitude, sLongitude, eLatitude, eLongitude) {
    this.locationService.getLocation(sLatitude, sLongitude)
      .subscribe(data => {
        this.startLocation = data;
        this.locationService.getLocation(eLatitude, eLongitude)
          .subscribe(data => {
            this.endLocation = data;
            this.startRoute();
          });
      });
  }
}
