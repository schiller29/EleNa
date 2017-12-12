import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Options } from '../models/options';
import { Location } from '../models/location';
import { Node } from '../models/node';
import { Vertex } from '../models/vertex';
import { Way } from '../models/way';
import { Edge } from '../models/edge';
import { LatLon } from '../models/latlon';
import { LocationService } from '../services/location.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  constructor(private locationService: LocationService) { }

  nodeList: Node[];
  vertices: Vertex[] = [];
  wayList: Way[];
  edges: Edge[] = [];
  location: Location[];
  latlonList: LatLon[] = [];

  intersectingNodes: number[] = [];

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
  limitError: boolean = false;

  errorMessage : string = "";

  buttonText: string;
  mapRoute: boolean;

  errorText: string;
  @ViewChild('modal') modal: ModalComponent;


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
      this.errorText = this.generateErrorText();
      this.modal.show();  
    }
  }

  generateErrorText(){
    var error = "";
    if(this.startLatitudeError){
      error+="Start Latitude, ";
    }
    if(this.startLongitudeError){
      error+="Start Longitude, ";
    }
    if(this.endLatitudeError){
      error+="End Latitude, ";
    }
    if(this.endLongitudeError){
      error+="End Longitude, ";
    }
    if(this.limitError){
      error+="Total Distance Limit, ";
    }
    error = error.slice(0, -2);
    return error;
  }

  checkInputError(){
    var inputError = false;
    var errorArray = [];
    //just going to assume for simplicity's sake that is an invalid lat + long
    if(isNaN(this.startLatitude) || this.startLatitude == 0){
      this.startLatitudeError = true;
      inputError = true;
    } else {
      this.startLatitudeError = false;
    }
    if(isNaN(this.startLongitude) || this.startLongitude == 0){
      this.startLongitudeError = true;
      inputError = true;
    } else {
      this.startLongitudeError = false;
    }
    if(isNaN(this.endLatitude) || this.endLatitude == 0){
      this.endLatitudeError = true;
      inputError = true;
    } else {
      this.endLatitudeError = false;
    }
    if(isNaN(this.endLongitude) || this.endLongitude == 0){
      this.endLongitudeError = true;
      inputError = true;
    } else {
      this.endLongitudeError = false;
    }
    if(isNaN(this.limit)){
      this.limitError = true;
      inputError = true;
    } else {
      this.limitError = false;
    }
    return inputError;
  }
  
  startRoute(sLatitude, sLongitude, eLatitude, eLongitude){
    console.log("Maximize: " + this.maximizeElevation);
    console.log("Minimize: " + this.minimizeElevation);
    console.log("Limit: " + this.limit);
    if(sLatitude > eLatitude){
      var minLat = eLatitude;
      var maxLat = sLatitude;
    }
    else {
      var minLat = sLatitude;
      var maxLat = eLatitude;
    }
    if(sLongitude > eLongitude){
      var minLong = eLongitude;
      var maxLong = sLongitude;
    }
    else {
      var minLong = sLongitude;
      var maxLong = eLongitude;
    }
    console.log('loading intersection data');
    this.loadData(minLat, minLong, maxLat, maxLong);
  }

  loadData(minLat, minLong, maxLat, maxLong) {
    this.locationService.getNodes(minLat, minLong, maxLat, maxLong)
      .subscribe(data => {
        this.nodeList = data.elements;
        console.log(this.nodeList);
        console.log('intersecting nodes loaded');
        console.log('loading way data');
        this.locationService.getWays(minLat, minLong, maxLat, maxLong)
          .subscribe(data => {
            this.wayList = data.elements;
            console.log(this.wayList);
            console.log('way data loaded');
            this.populateLists();
          })
    })
  }

  populateLists() {
    this.nodeList.forEach(element => {
      this.intersectingNodes.push(element.id);
      let latlon: LatLon = {
        lat: element.lat,
        lon: element.lon
      };
      this.latlonList.push(latlon);
    });
    console.log(this.intersectingNodes);
    console.log(this.latlonList);
    this.locationService.getLocation(this.latlonList)
      .subscribe(data => {
        this.location = data.results;
        console.log(this.location);
        this.populateVertices();
      })
  }

  populateVertices() {
    let count = 0;
    this.location.forEach(element => {
      let vertex: Vertex = {
        vid: count,
        lat: element.latitude,
        long: element.longitude,
        elev: element.elevation
      };
      this.vertices.push(vertex);
      count++;
    });
    console.log(this.vertices);
    this.mapRoute = true;
    this.buttonText = 'Re-route';
  }

  // needs rewriting
  // loadLocations(sLatitude, sLongitude, eLatitude, eLongitude) {
  //   this.locationService.getLocation(sLatitude, sLongitude)
  //     .subscribe(data => {
  //       this.startLocation = data;
  //       this.locationService.getLocation(eLatitude, eLongitude)
  //         .subscribe(data => {
  //           this.endLocation = data;
  //           this.startRoute(sLatitude, sLongitude, eLatitude, eLongitude);
  //         });
  //     });
  // }

  loadLocations(sLatitude, sLongitude, eLatitude, eLongitude) {
    this.startRoute(sLatitude, sLongitude, eLatitude, eLongitude);
  }

}
