import { Component, OnInit } from '@angular/core';
import { Location } from '../models/location';
import { LocationService } from '../services/location.service';
import { Options } from '../models/options';

//probably can condense this
import SourceVector from '../../../node_modules/ol/source/vector';
import LayerVector from '../../../node_modules/ol/layer/vector';
import Text from '../../../node_modules/ol/style/text';
import Fill from '../../../node_modules/ol/style/fill';
import Stroke from '../../../node_modules/ol/style/stroke';
import Icon from '../../../node_modules/ol/style/icon';
import Style from '../../../node_modules/ol/style/style';
import Proj from '../../../node_modules/ol/proj';
import Map from '../../../node_modules/ol/map';
import View from '../../../node_modules/ol/view';
import TileLayer from '../../../node_modules/ol/layer/tile';
import XYZ from '../../../node_modules/ol/source/xyz';
import Point from '../../../node_modules/ol/geom/point';
import Feature from '../../../node_modules/ol/feature';

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

  options: Options;
  maximizeElevation: boolean;
  minimizeElevation: boolean;
  limit: number;

  submit() {
    this.loadLocation(this.startLatitude, this.startLongitude, this.startLocation);
    this.loadLocation(this.endLatitude, this.endLongitude, this.endLocation);
    console.log('start loc: ' + this.startLocation);
    console.log('end loc: ' + this.endLocation);
    console.log("Maximize: " + this.maximizeElevation);
    console.log("Minimize: " + this.minimizeElevation);
    console.log("Limit: " + this.limit);
  }

  loadLocation(latitude, longitude, location) {
    this.locationService.getLocation(latitude, longitude).subscribe(data => location = data);
  }

  ngOnInit() {

    var startVectorSource = new SourceVector();
    var startVectorLayer = new LayerVector({
      source: startVectorSource
    });

    var endVectorSource = new SourceVector();
    var endVectorLayer = new LayerVector({
      source: endVectorSource
    });

    var startMap = new Map({
      target: 'startMap',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        }),
        startVectorLayer
      ],
      view: new View({
        center: Proj.transform([-432.559, 42.36], 'EPSG:4326', 'EPSG:3857'),
        zoom: 9
      })
    });
    var endMap = new Map({
          target: 'endMap',
          layers: [
            new TileLayer({
              source: new XYZ({
                url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              })
            }),
            endVectorLayer
          ],
          view: new View({
            center: Proj.transform([-432.559, 42.36], 'EPSG:4326', 'EPSG:3857'),
            zoom: 9
          })
    });
    var iconStyle = new Style({
    image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        src: '//openlayers.org/en/v3.8.2/examples/data/icon.png'
    }),
    text: new Text({
        font: '12px Calibri,sans-serif',
        fill: new Fill({ color: '#000' }),
        stroke: new Stroke({
            color: '#fff', width: 2
        }),
        text: 'Some text'
    })
    });
    startMap.on('click', function(e) {
      var lonlat = Proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
      this.startLongitude = lonlat[0];
      this.startLatitude = lonlat[1];
      var feature = new Feature({
        geometry: new Point(e.coordinate)
      });
      feature.setStyle(iconStyle);
      startVectorSource.clear();
      startVectorSource.addFeature(feature);
    }, this);

    endMap.on('click', function(e) {
      var lonlat = Proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
      this.endLongitude = lonlat[0];
      this.endLatitude = lonlat[1];
      var feature = new Feature({
        geometry: new Point(e.coordinate)
      });
      feature.setStyle(iconStyle);
      endVectorSource.clear();
      endVectorSource.addFeature(feature);
    }, this);
  }
}
