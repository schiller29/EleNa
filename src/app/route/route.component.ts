import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Element } from '@angular/compiler';

declare var ol: any;

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  routeLocations;

  constructor(private http:Http) {
  }

  
  @ViewChild('routeMapDiv') routeMapDiv: ElementRef;

  ngOnInit() {
    this.http.get('assets/data.json')
      .subscribe( res => {
          this.routeLocations = res.json();
          this.mapRoute(this.routeLocations.lonlat);
        }
      );
  }
  mapRoute(lonlat){
    console.log(lonlat);
    var routeGeom = new ol.geom.LineString(lonlat);
    routeGeom = routeGeom.transform('EPSG:4326', 'EPSG:3857');
    var routeFeature = new ol.Feature({geometry:routeGeom});
    var routeStyle = new ol.style.Style({
       stroke : new ol.style.Stroke({color : '#ff0000', width: 5, lineCap: 'square'}),
    });
    var extentToZoom = routeGeom.getExtent();
    routeFeature.setStyle(routeStyle);
    var routeVectorSource = new ol.source.Vector({
      features: [routeFeature]
    });
    var routeVectorLayer = new ol.layer.Vector({
      source: routeVectorSource
    });

    var routeMap = new ol.Map({
      target: 'routeMap',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        }),
        routeVectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-72.49, 42.25]),
        zoom: 9
      })
    });
    routeMap.getView().fit(extentToZoom,routeMap.getSize())
    this.routeMapDiv.nativeElement.scrollIntoView();
  }
}
