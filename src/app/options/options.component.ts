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

  errorMessage : string = "";

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
    this.startLatitudeError = false;
    this.startLongitudeError = false;
    this.endLatitudeError = false;
    this.endLongitudeError = false;
    if (!this.checkInputError()){
      this.loadLocations(this.startLatitude, this.startLongitude, this.endLatitude, this.endLongitude);
    } else {
      this.mapRoute = false;
      this.buttonText = 'Route';
    }
    console.log(this.endLatitudeError);
  }

  checkInputError(){
    var inputError = false;
    var errorArray = [];
    //just going to assume for simplicity's sake that is an invalid lat + long
    if(isNaN(this.startLatitude) || this.startLatitude == 0){
      this.startLatitudeError = true;
      inputError = true;
      errorArray.push("Start Latitude");
    }
    if(isNaN(this.startLongitude) || this.startLongitude == 0){
      this.startLongitudeError = true;
      inputError = true;
      errorArray.push("Start Longitude");
    }
    if(isNaN(this.endLatitude) || this.endLatitude == 0){
      this.endLatitudeError = true;
      inputError = true;
      errorArray.push("End Latitude");
    }
    if(isNaN(this.endLongitude) || this.endLongitude == 0){
      this.endLongitudeError = true;
      inputError = true;
      errorArray.push("End Longitude");
    }
    this.errorMessage = "Please enter valid: " + errorArray.join(", ");
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
