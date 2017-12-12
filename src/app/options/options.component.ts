import { Component, Input, OnInit } from '@angular/core';
import { Options } from '../models/options';
import { Location } from '../models/location';
import { Node } from '../models/node';
import { Vertex } from '../models/vertex';
import { Way } from '../models/way';
import { Edge } from '../models/edge';
import { LatLon } from '../models/latlon';
import { LocationService } from '../services/location.service';
import { HaversineService, GeoCoord } from "ng2-haversine";

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  constructor(private locationService: LocationService, private _haversineService: HaversineService) { }

  nodeList: Node[];
  vertices: Vertex[] = [];
  wayList: Way[];
  edges: any[] = [];
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
    //only execute if locations loaded ok
    if(this.startLocation && this.endLocation){
      this.mapRoute = true;
      this.buttonText = 'Re-route';
      console.log('loading intersection data')
    }
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

  populateEdges() {
    this.nodeList.forEach(node => {
      let edgeArr: Edge[] = [];
      this.wayList.forEach(way => {
        if (way.nodes.includes(node.id)) {
          way.nodes.forEach(x => {
            if (x != node.id && this.intersectingNodes.includes(x)) {
              this.populateInnerEdge(node.id, x, edgeArr);
            }
          });
        }
      });
      this.edges.push(edgeArr);
    });
    console.log(this.edges);
  }

  populateInnerEdge(sid, eid, edgeArr) {
    let start: GeoCoord = {latitude: 0, longitude: 0};
    let end: GeoCoord= {latitude: 0, longitude: 0};
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
    edgeArr.push(edge);
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
        this.populateEdges();
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
