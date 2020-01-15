import { Component } from '@angular/core';
import { NewsApiService } from './news-api.service';
import { WeatherService } from './weather.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  mArticles: any[];
  mSources: any[];
  sidenavValue: Boolean = false;
  weatherData: any;

  constructor(private newsapi: NewsApiService, private weather: WeatherService) {
    console.log('app component constructor called');
  }

  ngOnInit() {
    //load articles
    this.newsapi.initArticles().subscribe(data => this.mArticles = data['articles']);
    //load news sources
    this.newsapi.initSources().subscribe(data => this.mSources = data['sources']);

    this.weather.initCountry()
      .subscribe(cData => {
        console.log(cData['city']); this.weather.initWeather(cData['city']).subscribe(wData => {
          this.weatherData = wData; console.log(wData)
        })
      })
  }

  searchArticles(source: String) {
    console.log("selected source is: " + source);
    this.newsapi.getArticlesByID(source).subscribe(data => this.mArticles = data['articles']);

  }


}
