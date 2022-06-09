import {Component, OnInit} from '@angular/core';
import {ApixuService} from '../services/apixu.service';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
interface Location {
  city: any,
  country: any
  index:number
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})


export class WeatherComponent implements OnInit {
  public weatherData: any;
  locations: Location[] = [
    {
      city: 'Veenendaal',
      country: 'NL',
      index:0
    },
    {
      city: 'Chisinau',
      country: 'MD',
      index: 2
    },

    {
      city: 'Kaunas',
      country: 'LT',
      index: 3
    }
  ];
  selectedCity = 'Veenendaal';
  loading: boolean = true;
  online: boolean = true;
  bookmark: any;

  constructor(
    private apixuService: ApixuService) {
  }

  ngOnInit(): void {
    let city:any = localStorage.getItem('bookmark');
    this.bookmark = city;
    this.selectedCity = city


    if (!city){
      this.selectedCity = 'Veenendaal'
    }else {
      this.locations = [...this.locations.filter(ob => ob.city !== city).sort((b,a) => b.city - a.city),
        ...this.locations.filter(ob => ob.city === city)].reverse()
    }




    this.sendToAPIXU(this.selectedCity);
    this.checkInternet().subscribe((online)=>{
      this.online = online
    })
  }

  sendToAPIXU(city: any) {
    this.loading = true
    this.selectedCity = city;
    this.apixuService.getWeather(city).subscribe(data => {
      this.weatherData = data;
      this.loading = false
      localStorage.setItem(city, JSON.stringify(data));
    }, error => {
      let d = localStorage.getItem(city);


      if (!this.online){
        this.showSnackBar();
      }
      if (d != null) {
        this.weatherData = JSON.parse(d);
      }
      this.loading = false;
    });
  }


  showSnackBar() {
    let x:any = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(() => {
      x.className = x.className.replace("show", "");
    }, 3000);
  }


  checkInternet() {
    return merge(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }


  bookmarkCity(name: any) {
    localStorage.setItem('bookmark',name)
    this.ngOnInit()

  }
}
