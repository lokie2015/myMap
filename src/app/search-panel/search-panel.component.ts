import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppSettings} from './../properties';

@Component({
  selector: 'search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements OnInit {

  public form;
  public start = '';
  public end = '';
  public submitBtn = 'Submit';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/x-www-form-urlencoded'
    })
  };

  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpClient) {
    this.form = this.formBuilder.group({
      origin: '',
      destination: ''
    });
   }

  ngOnInit(): void {
  }

  onSubmit(form){
    this.submitBtn = 'Re-Submit';
    const formData = new HttpParams().set('origin', form.origin).set('destination', form.destination)  ;
    this.http.post(AppSettings.SERVER_ENDPOINT, formData, this.httpOptions).subscribe(
      response => {
        console.log("Response with: ", response);
      }, error => {
        console.log("Error found: ", error);
      }
    );
  }

  resetAll(){
   this.form.reset();
  }

}
