// Angular Import
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  

// Project import
import { BreadcrumbModule } from './components';
import { SpinnerComponent } from './components/spinner/spinner.component';

// third party
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgScrollbarModule } from 'ngx-scrollbar';
import 'hammerjs';
import 'mousetrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';

// bootstrap import
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbModule,
  NgbCollapseModule,
  NgbProgressbar,
  NgbProgressbarModule
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SpinnerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbModule,
    NgbCollapseModule,
    NgScrollbarModule,
    NgbProgressbarModule,
    GalleryModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    SpinnerComponent,
    NgbModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbCollapseModule,
    NgScrollbarModule,
    NgbProgressbar,
    NgbProgressbarModule,
    GalleryModule,
    CalendarModule
  ]
})
export class SharedModule {}
