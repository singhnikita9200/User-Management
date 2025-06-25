import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  
   //get country api and sort according to alphabetical order
 getCountries() {
  return this.http
    .get<any[]>('https://restcountries.com/v3.1/all?fields=name,flags')
    .pipe(
      map((countries) =>
        countries.map((c) => ({
          name: c.name.common,
          flag: c.flags.png
        })).sort((a, b) => a.name.localeCompare(b.name))
      )
    );
}
}
