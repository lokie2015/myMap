import { Component, OnInit, Input } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent implements OnInit {

  @Input()
  public label: any;

  @Input()
  public name: any;

  @Input()
  parentForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
