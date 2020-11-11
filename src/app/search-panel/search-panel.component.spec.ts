import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { SearchPanelComponent } from './search-panel.component';
import { SnackbarService } from "../services/snackbar.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Overlay } from "@angular/cdk/overlay";
import { FormBuilder } from "@angular/forms";
import {HttpClient, HttpHandler, HttpParams} from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppSettings } from "../properties";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {DataService} from "../services/data.service";

describe('SearchPanelComponent', () => {
  let component: SearchPanelComponent;
  let fixture: ComponentFixture<SearchPanelComponent>;
  let snackBarService: SnackbarService;
  let httpMock: HttpTestingController;
  let matSnackBar: MatSnackBar;
  let formBuilder: FormBuilder;
  let data: DataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserAnimationsModule],
      declarations: [SearchPanelComponent],
      providers: [SnackbarService, MatSnackBar, Overlay, FormBuilder, HttpClient, HttpHandler, DataService],
    })
      .compileComponents();
    snackBarService = TestBed.get(SnackbarService);
    httpMock = TestBed.get(HttpTestingController);
    matSnackBar = TestBed.get(MatSnackBar);
    formBuilder = TestBed.get(FormBuilder);
    data = TestBed.get(DataService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send post request when form submit', () => {
    const formData = {'origin':'Innocentre, Hong Kong', 'destination':'Hong Kong International Airport Terminal 1'};
    spyOn(component, 'sendPostRequestWithForm').and.callThrough();
    component.onSubmit(formData);
    expect(component.sendPostRequestWithForm).toHaveBeenCalled();
  });

  it('should update route info after getting route successfully', () => {
    spyOn(data, 'updateRouteInfo').and.callThrough();
    const response = {
      'status': 'success',
      'path': [
        ['22.372081', '114.107877'],
        ['22.326442', '114.167811'],
        ['22.284419', '114.159510']
      ],
      'total_distance': 20000,
      'total_time': 1800
    };
    component.handleGetRouteResponse(response);
    expect(data.updateRouteInfo).toHaveBeenCalled();
    expect(component.total_distance).toBe(20000);
    expect(component.total_time).toBe(1800);
  });

  it('should retry when get in progress status', () => {
    spyOn(component, 'onSubmit').and.callThrough();
    const response = { 'status': 'in progress' };
    component.handleGetRouteResponse(response);
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should handle failure status', () => {
    spyOn(snackBarService, 'showSnackBar').and.callThrough();
    const response = {
      'status': 'failure',
      'error': 'Location not accessible by car'
    };
    component.handleGetRouteResponse(response);
    expect(snackBarService.showSnackBar).toHaveBeenCalled();
    expect(component.warning).toBe('Location not accessible by car');
  });

  it('should handle error status when getting the route token', () =>{
    spyOn(snackBarService, 'showSnackBar').and.callThrough();
    component.handleError('Internal Server Error');
    expect(snackBarService.showSnackBar).toHaveBeenCalledWith('Error found, please try again later.');
  });

});
