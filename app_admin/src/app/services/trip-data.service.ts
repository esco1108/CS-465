import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {

    private url = 'http://localhost:3000/api/trips';

    constructor(private http: HttpClient) { }

  getTrips(): Observable<Trip[]> {
  return this.http.get<Trip[]>(this.url);
}

  addTrip(trip: any) {
    return this.http.post('http://localhost:3000/api/trips', trip);
  }

  getTrip(tripCode: string): Observable<Trip> {
    //console.log('Inside TripDataService::getTrips');
    return this.http.get<Trip>(this.url + '/' + tripCode);
}

  updateTrip(formData: Trip) : Observable<Trip> {
    // console.log('Inside TripDataService::addTrips');
    return this.http.put<Trip>(this.url + '/' + formData.code, formData);
  }

}
