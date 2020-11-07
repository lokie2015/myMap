import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AppSettings } from './../properties';

declare var H: any;

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
  public width : any;

  @Input()
  public height: any;


  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let platform = new H.service.Platform({
        "apikey": AppSettings.API_KEY
    });
    let defaultLayers = platform.createDefaultLayers();
    let map = new H.Map(
        this.mapElement.nativeElement,
        defaultLayers.vector.normal.map,
        {
            zoom: 15,
            center: { lat: this.lat, lng: this.lng }
        }
    );
  }
}
