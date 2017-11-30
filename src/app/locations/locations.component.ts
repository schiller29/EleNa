import { Component, OnInit } from '@angular/core';
import { Location } from '../models/location';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  constructor(private locationService: LocationService) { }

  location: Location;

  latitude: number;
  longitude: number;

  submit() {
    this.loadLocation(this.latitude, this.longitude);
    console.log(this.location);
  }

  loadLocation(latitude, longitude) {
    this.locationService.getLocation(latitude, longitude).subscribe(data => this.location = data);
  }

  ngOnInit() {
  }

}
