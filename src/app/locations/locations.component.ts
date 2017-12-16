import { Component, OnInit } from '@angular/core';
import { Location } from '../models/location';
import { LocationService } from '../services/location.service';

declare var ol: any;

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  constructor(private locationService: LocationService) { }

  startLocation: Location;
  startLatitude: number;
  startLongitude: number;

  endLocation: Location;
  endLatitude: number;
  endLongitude: number;

  //Global map variables
  startMap: any;
  endMap: any;
  startVectorSource: any;
  endVectorSource: any;
  iconStyle: any;

  useCurrentLocation: boolean = false;
  usersLatitude: number;
  usersLongitude: number;

  //User ticked use current location checkbox
  useCurrentLocationClick(){
    if(this.useCurrentLocation){
      //Poll for users current location
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this)); //Set current location to users location
    }
  }

  setPosition(position) {
    if(!position){ //If user hasn't consented to location permission, return.
      return;
    } 
    this.useCurrentLocation = true;
    //Set center of start and end map to users current location
    this.startMap.setView(new ol.View({ 
      center: ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]),
      zoom: 11
    }));
    this.startMap.setView(new ol.View({
      center: ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]),
      zoom: 11
    }));
    this.endMap.setView(new ol.View({
      center: ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]),
      zoom: 11
    }));
    this.endMap.setView(new ol.View({
      center: ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]),
      zoom: 11
    }));
    
    //Set start location to users location
    //Also save users location for later use
    this.usersLatitude = position.coords.latitude;
    this.usersLongitude = position.coords.longitude;
    this.startLongitude = position.coords.longitude;
    this.startLatitude = position.coords.latitude;
    
    //Put a point on the start map corresponding to users location
    var feature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]))
    });

    feature.setStyle(this.iconStyle);
    this.startVectorSource.clear();
    this.startVectorSource.addFeature(feature);
  }

  ngOnInit() {
    //Vector source and layer for Open Layer map
    this.startVectorSource = new ol.source.Vector();
    var startVectorLayer = new ol.layer.Vector({
      source: this.startVectorSource
    });

    this.endVectorSource = new ol.source.Vector();
    var endVectorLayer = new ol.layer.Vector({
      source: this.endVectorSource
    });
    //Initialize start location map
    this.startMap = new ol.Map({
      target: 'startMap',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        }),
        startVectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-72.49, 42.25]),//Hard coded if user doesn't agree to provide their location
        zoom: 11
      })
    });
    //Initialize end location map
    this.endMap = new ol.Map({
      target: 'endMap',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        }),
        endVectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-72.49, 42.25]),//Hard coded if user doesn't agree to provide their location
        zoom: 11
      })
    });
    //Set styling for points on the map
    this.iconStyle = new ol.style.Style({
      image: new ol.style.Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: '//openlayers.org/en/v3.8.2/examples/data/icon.png'
      }),
      text: new ol.style.Text({
          font: '12px Calibri,sans-serif',
          fill: new ol.style.Fill({ color: '#000' }),
          stroke: new ol.style.Stroke({
              color: '#fff', width: 2
          }),
      })
    });
    //Set onclick function for start and end location maps
    //On clicking the map, drop a point on the location
    this.startMap.on('click', function(e) {
      if(this.useCurrentLocation){
        this.useCurrentLocation = false;
      }
      var lonlat = ol.proj.toLonLat(e.coordinate, new ol.proj.Projection({code: 'EPSG:3857'}));
      this.startLongitude = lonlat[0];
      this.startLatitude = lonlat[1];
      var feature = new ol.Feature({
        geometry: new ol.geom.Point(e.coordinate)
      });
      feature.setStyle(this.iconStyle);
      this.startVectorSource.clear();
      this.startVectorSource.addFeature(feature);
    }, this);

    this.endMap.on('click', function(e) {
      var lonlat = ol.proj.toLonLat(e.coordinate, new ol.proj.Projection({code: 'EPSG:3857'}));
      this.endLongitude = lonlat[0];
      this.endLatitude = lonlat[1];
      var feature = new ol.Feature({
        geometry: new ol.geom.Point(e.coordinate)
      });
      feature.setStyle(this.iconStyle);
      this.endVectorSource.clear();
      this.endVectorSource.addFeature(feature);
    }, this);
    
    //Ask user for permission to use their location. If yes, then set appropriate values for the map
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    };
  }
}
