import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Viewer360Component } from './viewer360.component';

@NgModule({
  declarations: [Viewer360Component],
  imports:      [CommonModule],
  exports:      [Viewer360Component],
  schemas:      [CUSTOM_ELEMENTS_SCHEMA],
})
export class Viewer360Module {}
