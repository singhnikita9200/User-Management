import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { Country, CountryAPIResponse } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // API endpoint to fetch country data with limited fields (name and flag)
  private readonly COUNTRY_API_URL = 'https://restcountries.com/v3.1/all?fields=name,flags';

  // Local storage key for caching country data
  private readonly CACHE_COUNTRY_KEY = 'cachedCountries';

  constructor(private http: HttpClient) { }

  // Fetches country list.
  getCountries(): Observable<Country[]> {
    // Check for cached country data
    const cached = localStorage.getItem(this.CACHE_COUNTRY_KEY);
    if (cached) {
      const parsed: Country[] = JSON.parse(cached);
      return of(parsed); // Return cached data as Observable
    }

    // If not cached, make API call
    return this.http.get<CountryAPIResponse[]>(this.COUNTRY_API_URL).pipe(
      // Transform API response to match Country model
      map((countries) =>
        countries
          .map((c) => ({
            name: c.name?.common || '', // Extract name
            flag: c.flags?.png || ''    // Extract flag URL
          }))
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
      ),
      // Cache the formatted list into localStorage
      tap((sortedCountries) => {
        localStorage.setItem(this.CACHE_COUNTRY_KEY, JSON.stringify(sortedCountries));
      })
    );
  }
}
