import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  api_key = '936b55ba6a9947d393e4bf73cef2f2b0';
  country: String;
  weather: {};
  joke: any;

  constructor(private http: HttpClient) { this.getJoke() }


  initWeather(passCountry: String) {
    return this.http.get('http://api.weatherstack.com/current?access_key=5e56ee50247db5f4cc77cc22fac1e92f&query=' + passCountry);
  }

  initCountry() {
    return this.http.get('http://extreme-ip-lookup.com/json/');
  }

  getJoke() {
    this.http.get('https://us-central1-dadsofunny.cloudfunctions.net/DadJokes/random/jokes').subscribe(joke => { this.joke = joke; })
  }

} 
