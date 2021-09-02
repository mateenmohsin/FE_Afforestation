import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { MaterialModule } from '../material.module';

import { CardComponent } from './thanks_page/card.component';
import { ChartComponent } from './chart/chart.component';
import { AlertDialog } from './alert/alert.dialog';
import { FilterControlComponent } from './filter-control/filter-control.component';
import { FilePickerComponent } from './file-picker/file-picker.compoent';
import { PaginationComponent } from './pagination/pagination.component';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { SaplingAlertComponent } from './alert/sapling-alert/sapling-alert.component';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule,
        MaterialModule,
        BrowserAnimationsModule,
        
        NgxMaskModule.forRoot(),
        MalihuScrollbarModule.forRoot(),
    ],
    declarations: [
        CardComponent,
        ChartComponent,
        AlertDialog,
        FilterControlComponent,
        FilePickerComponent,
        PaginationComponent,
        SidePanelComponent,
        SaplingAlertComponent,
    ],
    exports: [
        CardComponent,
        ChartComponent,
        AlertDialog,
        FilterControlComponent,
        FilePickerComponent,
        PaginationComponent,
        SidePanelComponent,
    ],
    providers: [
    ],
    entryComponents: [
        AlertDialog
    ],
})
export class CoreModule { }
