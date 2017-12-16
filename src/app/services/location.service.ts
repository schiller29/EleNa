import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LatLon } from '../models/latlon';
import 'rxjs/add/operator/map';

@Injectable()
export class LocationService {
  constructor (
    private http: Http
  ) {}

  BASE_URL = 'https://api.open-elevation.com/api/v1/lookup?locations=';

  OVERPASS_INTERSECTION_URL = 'https://www.overpass-api.de/api/interpreter?data=[out:json];(way(';

  OVERPASS_WAY_URL = 'https://www.overpass-api.de/api/interpreter?data=[out:json];way(';

  // Overpass QL to retrieve intersections
  OVERPASS_INTERSECTION_QUERY = ');)->.n1;foreach.n1((.n1;%20-%20._;)->.n2;node(w._)->.n3;node(w.n2)->.n2;node.n3.n2;out;);';

  // gets elevation data from API
  getLocation(latlonList) {
    let LATLON = '';
    latlonList.forEach(element => {
      LATLON = LATLON+element.lat+","+element.lon+"|";
    });
    LATLON = LATLON.substring(0, LATLON.length - 1);
    return this.http.get(this.BASE_URL+LATLON)
    .map((res:Response) => res.json());
  }

  // gets all intersection from API
  getNodes(minLat, minLong, maxLat, maxLong) {
    return this.http.get(this.OVERPASS_INTERSECTION_URL+minLat+","+minLong+","+maxLat+","+maxLong+this.OVERPASS_INTERSECTION_QUERY)
    .map((res:Response) => res.json());
  }

  // gets all ways from API
  getWays(minLat, minLong, maxLat, maxLong) {
    return this.http.get(this.OVERPASS_WAY_URL+minLat+","+minLong+","+maxLat+","+maxLong+");out%20meta;")
    .map((res:Response) => res.json());
  }
}