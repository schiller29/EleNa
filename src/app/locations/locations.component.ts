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

  ngOnInit() {
    var startVectorSource = new ol.source.Vector();
    var startVectorLayer = new ol.layer.Vector({
      source: startVectorSource
    });

    var endVectorSource = new ol.source.Vector();
    var endVectorLayer = new ol.layer.Vector({
      source: endVectorSource
    });

    var startMap = new ol.Map({
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
        center: ol.proj.fromLonLat([-72.49, 42.25]),//ol.proj.transform([-432.559, 42.36], 'EPSG:4326', 'EPSG:3857'),
        zoom: 9
      })
    });
    var endMap = new ol.Map({
<<<<<<< HEAD
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
            center: ol.proj.fromLonLat([-72.49, 42.25]),//ol.proj.transform([-432.559, 42.36], 'EPSG:4326', 'EPSG:3857'),
            zoom: 9
=======
      target: 'endMap',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
>>>>>>> 6a849ef7f57af35ab5bb782989c5af0c1e307009
          })
        }),
        endVectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-72.49, 42.25]),//ol.proj.transform([-432.559, 42.36], 'EPSG:4326', 'EPSG:3857'),
        zoom: 9
      })
    });
    var iconStyle = new ol.style.Style({
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
    startMap.on('click', function(e) {
      var lonlat = ol.proj.toLonLat(e.coordinate, new ol.proj.Projection({code: 'EPSG:3857'}));
      this.startLongitude = lonlat[0];
      this.startLatitude = lonlat[1];
      var feature = new ol.Feature({
        geometry: new ol.geom.Point(e.coordinate)
      });
      feature.setStyle(iconStyle);
      startVectorSource.clear();
      startVectorSource.addFeature(feature);
    }, this);

    endMap.on('click', function(e) {
      var lonlat = ol.proj.toLonLat(e.coordinate, new ol.proj.Projection({code: 'EPSG:3857'}));
      this.endLongitude = lonlat[0];
      this.endLatitude = lonlat[1];
      var feature = new ol.Feature({
        geometry: new ol.geom.Point(e.coordinate)
      });
      feature.setStyle(iconStyle);
      endVectorSource.clear();
      endVectorSource.addFeature(feature);
    }, this);
  }
}
