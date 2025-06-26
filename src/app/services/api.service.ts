import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Country, CountryAPIResponse } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  //get country api and sort according to alphabetical order
  getCountries(): Observable<Country[]> {
    return this.http
      .get<CountryAPIResponse[]>('https://restcountries.com/v3.1/all?fields=name,flags')
      .pipe(
        map((countries) =>
          countries
            .map((c) => ({
              name: c.name?.common || '',
              flag: c.flags?.png || ''
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        )
      );
  }
}
