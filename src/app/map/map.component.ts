import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AppSettings } from './../properties';
import { DataService } from './../services/data.service';
import { Subscription } from "rxjs";

declare var H: any;

export interface ROUTE_INFO {
  waypoint1: string,
  waypoint2: string,
  waypoint3: string,
  total_distance: number,
  total_time: number
}

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @ViewChild("map")
  public mapElement: ElementRef;

  @Input()
  public lat: any;

  @Input()
  public lng: any;

  @Input()
  public height: any;

  @Input()
  public width: any;

  private platform: any;
  private map: any;
  private directions: any;
  private router: any;

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.platform = new H.service.Platform({
      "apikey": AppSettings.API_KEY,
      "app_id": AppSettings.APP_ID
    });

    this.directions = [];
    this.router = this.platform.getRoutingService();
    this.subscribeToDataService();
  }

  ngAfterViewInit() {
    let defaultLayers = this.platform.createDefaultLayers();
    this.map = new H.Map(
      this.mapElement.nativeElement,
      defaultLayers.vector.normal.map,
      {
        zoom: 12,
        center: { lat: this.lat, lng: this.lng },
        pixelRatio: window.devicePixelRatio || 1
      }
    );
    window.addEventListener('resize', () => this.map.getViewPort().resize());
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
  }

  // subscribe to the data service for getting the waypoints
  subscribeToDataService(): Subscription {
    return this.data.routeInfo.subscribe(waypoint => {
      console.log("subscribe to data service with waypoint: ");
      console.log(waypoint);
      this.route(waypoint['waypoint1'], waypoint['waypoint2'], waypoint['waypoint3']);
    });
  };

  public route(start: any, middle: any, finish: any) {
    let params = {
      "mode": "fastest;car",
      "waypoint0": "geo!" + start,
      "waypoint1": "geo!" + middle,
      "waypoint2": "geo!" + finish,
      "representation": "display"
    }
    // remove the exisitng markers
    if (this.map && this.map.getObjects()) {
      this.map.removeObjects(this.map.getObjects());
    }

    this.router.calculateRoute(params, data => {
      if (data.response) {
        this.directions = data.response.route[0].leg[0].maneuver;
        data = data.response.route[0];
        let lineString = new H.geo.LineString();
        data.shape.forEach(point => {
          let parts = point.split(",");
          lineString.pushLatLngAlt(parts[0], parts[1]);
        });
        let routeLine = new H.map.Polyline(lineString, {
          style: { strokeColor: "blue", lineWidth: 5 }
        });

        let startMarker = this.generateMarker(start, 'A', 10);
        let middleMarker = this.generateMarker(middle, 'B', 20);
        let finishMarker = this.generateMarker(finish, 'C', 30);
        this.map.addObjects([routeLine, startMarker, middleMarker, finishMarker]);
        this.map.setViewBounds(routeLine.getBounds());
      }
    }, error => {
      console.error("Error with getting the route from HERE Maps", error);
    });
  }

  public generateMarker(position: string, sequence: string, zIndex: number): any {
    return new H.map.Marker({
      lat: position.split(",")[0],
      lng: position.split(",")[1]
    }, { icon: new H.map.Icon('../../assets/' + sequence + '.png', { size: { w: 32, h: 32 } }), zIndex: zIndex });
  };
}
