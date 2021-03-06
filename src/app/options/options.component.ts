import { Component, Input, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import { Options } from '../models/options';
import { Location } from '../models/location';
import { Node } from '../models/node';
import { Vertex } from '../models/vertex';
import { Way } from '../models/way';
import { Edge } from '../models/edge';
import { LatLon } from '../models/latlon';
import { LocationService } from '../services/location.service';
import { ModalComponent } from '../modal/modal.component';

declare var evolver: any;
import { HaversineService, GeoCoord } from "ng2-haversine";
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  constructor(private locationService: LocationService, private _haversineService: HaversineService, private http: Http) { }

  nodeList: Node[];
  vertices: Vertex[] = [];
  wayList: Way[];
  edges: any[] = [];
  location: Location[];
  latlonList: LatLon[] = [];

  startEndLatLonList: LatLon[] = [];
  startEndLocation: Location[];

  intersectingNodes: number[] = [];

  //Location Variables
  //Start and end locations passes as parameter from Locations component
  startLocation: Location;
  @Input() startLongitude: number;
  @Input() startLatitude: number;

  endLocation: Location;
  @Input() endLongitude: number;
  @Input() endLatitude: number;

  //Options Variables
  options: Options;
  maximizeElevation: boolean;
  minimizeElevation: boolean;
  limit: number;

  //Error Variables
  //Initialize errors as false
  startLatitudeError: boolean;
  startLongitudeError: boolean;
  endLatitudeError: boolean;
  endLongitudeError: boolean;
  limitError: boolean;

  errorMessage : string = "";

  //ButtonText = "Route" or "Re-route"
  buttonText: string;
  //Boolean that determines whether or not we are ready to render the final route
  mapRoute: boolean;

  //Error Text for input errors
  errorText: string;
  @ViewChild('modalInputError') modalInputError: ModalComponent; //Modal dialog for bad user input
  @ViewChild('modalAppFailure') modalAppFailure: ModalComponent; //Modal dialog for failure on calculating route

  //Variable that maps to a "Please wait" loading message
  busy: Subscription;

  ngOnInit() {
    //Initialize variables
    this.maximizeElevation = false;
    this.minimizeElevation = false;
    this.limit = 0;
    this.buttonText = "Route";
    this.mapRoute = false;
    this.startLatitudeError = false;
    this.startLongitudeError = false;
    this.endLatitudeError = false;
    this.endLongitudeError = false;
  } 

  //User clicked on elevation checkbox
  elevationClick(val){
    if(this.maximizeElevation && this.minimizeElevation){
      if(val=="maximize"){ //If maximize is selected, then minimize cannot be selected
        this.minimizeElevation = false;
      } else { //If minimize is selected, then maximize cannot be selected
        this.maximizeElevation = false;
      }
    }
  }

  //User hit route button
  submit() {
    this.mapRoute=false; //Remove old route
    this.startLatitudeError = false; //Reset errors
    this.startLongitudeError = false;
    this.endLatitudeError = false;
    this.endLongitudeError = false;
    if (!this.checkInputError()){ //Check if inputs are valid values
      this.loadLocations(this.startLatitude, this.startLongitude, this.endLatitude, this.endLongitude);
    } else { //Otherwise reset and show an error message
      this.mapRoute = false;
      this.buttonText = 'Route';
      this.errorText = this.generateErrorText();
      this.modalInputError.show();  
    }
  }

  //Error text
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
    this.startLatitudeError = false;
    this.startLongitudeError = false;
    this.endLatitudeError = false;
    this.endLongitudeError = false;
    var inputError = false;
    //Check longitude and latitude inputs and see if they conform to format
    if(isNaN(this.startLatitude) || Math.abs(this.startLatitude) > 90){
      this.startLatitudeError = true;
      inputError = true;
    } else {
      this.startLatitudeError = false;
    }
    if(isNaN(this.startLongitude) || Math.abs(this.startLongitude) > 180){
      this.startLongitudeError = true;
      inputError = true;
    } else {
      this.startLongitudeError = false;
    }
    if(isNaN(this.endLatitude) || Math.abs(this.endLatitude) > 90){
      this.endLatitudeError = true;
      inputError = true;
    } else {
      this.endLatitudeError = false;
    }
    if(isNaN(this.endLongitude) || Math.abs(this.endLongitude) > 180){
      this.endLongitudeError = true;
      inputError = true;
    } else {
      this.endLongitudeError = false;
    }
    if(isNaN(this.limit) || this.limit < 0){
      this.limitError = true;
      inputError = true;
    } else {
      this.limitError = false;
    }
    return inputError;
  }
  
  startRoute(sLatitude, sLongitude, eLatitude, eLongitude){
    let startLatLon: LatLon = {
      lat: sLatitude,
      lon: sLongitude
    };
    this.startEndLatLonList.push(startLatLon);
    let endLatLon: LatLon = {
      lat: eLatitude,
      lon: eLongitude
    };
    this.startEndLatLonList.push(endLatLon);
    this.locationService.getLocation(this.startEndLatLonList)
      .subscribe(data => {
        this.startEndLocation = data.results;
        let startVertex: Vertex = {
          vid: 0,
          lat: sLatitude,
          long: sLongitude,
          elev: this.startEndLocation[0].elevation
        };
        let endVertex: Vertex = {
          vid: 1,
          lat: eLatitude,
          long: eLongitude,
          elev: this.startEndLocation[1].elevation
        };
        this.vertices.push(startVertex);
        this.vertices.push(endVertex);
      })
    //set minimum and maximum latitudes and longitudes to retrieve Overpass API data using a bounded box
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

  // this will parse through the data received from the API to populate the 
  // vertices and edges lists, which are required by the algorithm
  loadData(minLat, minLong, maxLat, maxLong) {
    this.busy = this.locationService.getNodes(minLat, minLong, maxLat, maxLong)
      .subscribe(
        data => {
          this.nodeList = data.elements;
          console.log(this.nodeList);
          console.log('intersecting nodes loaded');
          console.log('loading way data');
          this.locationService.getWays(minLat, minLong, maxLat, maxLong)
            .subscribe(
              data => {
                this.wayList = data.elements;
                console.log(this.wayList);
                console.log('way data loaded');
                this.populateLists();
              },
              error => {
            });
        }, 
        error => {
        }
      );
  }

  // populates the edges lists with data from API
  populateEdges() {
    this.nodeList.forEach(node => {
      let edgeArr: Edge[] = [];
      let uniqueEdges: number[] = [];
      this.wayList.forEach(way => {
        if (way.nodes.includes(node.id)) {
          way.nodes.forEach(x => {
            if (x != node.id && this.intersectingNodes.includes(x)) {
              this.populateInnerEdge(node.id, x, edgeArr, uniqueEdges);
            }
          });
        }
      });
      this.edges.push(edgeArr);
    });
    console.log(this.edges);
    console.log('printed edges');
  }

  // populates the inner list of edges
  populateInnerEdge(sid, eid, edgeArr, uniqueEdges) {
    let start: GeoCoord = {latitude: 0, longitude: 0};
    let end: GeoCoord = {latitude: 0, longitude: 0};
    let vid: number;
    this.nodeList.forEach(element => {
      if(element.id == sid) {
        start.latitude = element.lat;
        start.longitude = element.lon;
      }
      if(element.id == eid) {
        end.latitude = element.lat;
        end.longitude = element.lon;
      }
    });
    let dist = this._haversineService.getDistanceInMeters(start, end);
    this.vertices.forEach(v => {
      if(v.lat == end.latitude && v.long == end.longitude) {
        vid = v.vid;
      }
    });
    let edge: Edge = {
      vid: vid,
      distance: dist,
      endpoint_id: eid
    };
    if(!uniqueEdges.includes(edge.vid)) {
      edgeArr.push(edge);
      uniqueEdges.push(edge.vid);
    }
  }

  // will populate vertices and edges
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
        console.log('printing vertices');
        this.populateVertices();
        console.log('printing edges');
        this.populateEdges();
        
        //entry point into the algorithm
        evolver(this.vertices,this.edges,true,this.limit);
      },
      error => {
        this.modalAppFailure.show();  //Show a modal dialog if calculating the route fails
      })
  }

  // populates the vertices list
  populateVertices() {
    let count = 2;
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
    console.log('printed vertices');
  }

  loadLocations(sLatitude, sLongitude, eLatitude, eLongitude) {
    this.startRoute(sLatitude, sLongitude, eLatitude, eLongitude);
  }

}
