import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LocationService {
  constructor (
    private http: Http
  ) {}

  BASE_URL = 'https://api.open-elevation.com/api/v1/lookup?locations=';

  getLocation(latitude, longitude) {
    return this.http.get(this.BASE_URL+latitude+","+longitude)
    .map((res:Response) => res.json());
  }

}