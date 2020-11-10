import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppSettings } from './../properties';
import { SnackbarService } from './../services/snackbar.service';
import { DataService } from './../services/data.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements OnInit {

  public form;
  public origin = '';
  public destination = '';
  public submitBtn = 'Submit';
  public total_distance = null;
  public total_time = null;
  public warning = null;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private snackBarService: SnackbarService,
    private data: DataService) {
    this.form = this.formBuilder.group({
      origin: '',
      destination: ''
    });
  }

  ngOnInit(): void {
    this.subscribeToDataService();
  }

  subscribeToDataService(): Subscription {
    return this.data.routeInfo.subscribe(waypoint => {
      this.total_distance = waypoint['total_distance'];
      this.total_time = waypoint['total_time'];
    });
  };

  onSubmit(form) {
    this.submitBtn = 'Re-Submit';
    const formData = new HttpParams().set('origin', form.origin).set('destination', form.destination);
    let path = AppSettings.SERVER_ENDPOINT + '/route';
    this.http.post(path, formData, this.httpOptions).subscribe(
      response => {
        this.http.get(path + '/' + response['token']).subscribe(
          response => {
            this.handleGetRouteResponse(response);
          }, error => {
            this.handleError(error);
          }
        );
      }, error => {
        this.handleError(error);
      }
    );
  }

  resetAll() {
    this.form.reset();
  }

  handleGetRouteResponse(response) {
    switch (response.status) {
      case 'success': {
        /* Case 1: 200 succes status response */
        this.clearInfo();
        this.data.updateRouteInfo(response.path[0].join(","), response.path[1].join(","),
          response.path[2].join(","), response.total_distance, response.total_time);
        break;
      }
      case 'in progress': {
        /* Case 2: 200 in progress status response */
        this.snackBarService.showSnackBar('Server busy now, Retrying...');
        this.onSubmit(this.form);
        this.clearInfo();
        break;
      }
      case 'failure': {
        /* Case 3: 200 failure status response */
        this.snackBarService.showSnackBar(response.error);
        this.clearInfo();
        this.warning = response.error;
        break;
      }
      default:
        break;
    }

  }

  handleError(error: any): void {
     console.log("Error found: ", error);
     this.clearInfo();
     this.snackBarService.showSnackBar('Error found, please try again later.');
  }

  clearInfo():void{
    this.warning = '';
    this.total_distance = null;
    this.total_time = null;
  }

}
