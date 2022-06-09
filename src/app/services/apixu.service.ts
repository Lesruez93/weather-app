import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApixuService {


  constructor(private http: HttpClient) { }

  getWeather(location:String) {
    return this.http.get(
      'http://api.weatherstack.com/current?access_key='+ environment.apiKey +'&query=' + location
    );
  }
}
