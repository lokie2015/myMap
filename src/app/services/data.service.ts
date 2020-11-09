import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ROUTE_INFO } from './../map/map.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // for route information
  public routeInfoDetail: ROUTE_INFO = { "waypoint1": "", "waypoint2": "", "waypoint3": "", "total_distance": null, "total_time": null };
  public routeInfoSource = new BehaviorSubject<ROUTE_INFO>(this.routeInfoDetail);
  public routeInfo = this.routeInfoSource.asObservable();

  constructor() { }

  updateRouteInfo(waypoint1: any, waypoint2: any, waypoint3: any, total_distance: any, total_time: any): void {
    console.log("routeInfo");
    this.routeInfoSource.next({
      "waypoint1": waypoint1,
      "waypoint2": waypoint2,
      "waypoint3": waypoint3,
      "total_distance": total_distance,
      "total_time": total_time
    });
  }

}
