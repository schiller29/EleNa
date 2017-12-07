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

  ngOnInit() {
    this.maximizeElevation = false;
    this.minimizeElevation = false;
    this.limit = 0;
    //init logic
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
      this.loadLocation(this.startLatitude, this.startLongitude, this.startLocation);
      this.loadLocation(this.endLatitude, this.endLongitude, this.endLocation);
      console.log('start loc: ' + this.startLocation);
      console.log('end loc: ' + this.endLocation);
      console.log("Maximize: " + this.maximizeElevation);
      console.log("Minimize: " + this.minimizeElevation);
      console.log("Limit: " + this.limit);
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

  // needs rewriting
  loadLocation(latitude, longitude, location) {
    this.locationService.getLocation(latitude, longitude).subscribe(data => location = data);
    console.log(this.locationService.getLocation(latitude, longitude));
  }

}
