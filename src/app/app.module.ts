import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthAppLoginComponent } from './templates/auth-app/auth-app-login.component';
import { LoginComponent, ForgotComponent, OTPComponent } from './templates/auth-app';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { TableComponentComponent } from './core/table-component/table-component.component';
import { InvokeDirective } from "./eachRow";
import { CoreModule } from './core/core.module';
import { MainAppComponent } from './templates/main-app/main-app.component';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { InventoryComponent } from './views/inventory/inventory.component';
import { NurseryComponent } from './views/nursery/nursery.component';
import { GardnerComponent } from './views/gardner/gardner.component';
// import { AttendanceComponent } from './views/attendance/attendance.component';
import { TopTableHeaderComponent } from './shared/top-table-header/top-table-header.component';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { AdminComponent } from './views/admin/admin.component';
import { HeadGardnerComponent } from './views/head-gardner/head-gardner.component';
import { AdminAddComponent } from './views/admin/admin-add/admin-add.component';
import { ProfileComponent } from './views/admin/profile/profile.component';
import { InventoryAddComponent } from './views/inventory/inventory-add/inventory-add.component';
import { NurseryAddComponent } from './views/nursery/nursery-add/nursery-add.component';
import { GardnerAddComponent } from './views/gardner/gardner-add/gardner-add.component';
import { TopHeadingComponent } from './shared/top-heading/top-heading.component';
import { FormFooterComponent } from './shared/form-footer/form-footer.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EditHeadGarnderComponent } from './views/head-gardner/edit-head-garnder/edit-head-garnder.component';
import { ImageRowComponent } from './shared/image-row/image-row.component';
import { AppSettingComponent } from './views/app-setting/app-setting.component';
import { ReportsComponent } from './views/reports/reports.component';
import { GenratedReportComponent } from './views/reports/genrated-report/genrated-report.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

import { GlobalListComponent } from './shared/global-list';
import { GlobalFormComponent } from './shared/global-form';

import { AuthGuard } from './guards/auth.guard';
import { ViewsGuard } from './guards/views.guard';


import { ApiService, LoaderService, AlertService } from './services';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NurseryViewComponent } from './views/nursery/nursery-view/nursery-view.component';
import { AttendanceDetailComponent } from './views/attendance/attendance-detail/attendance-detail';
import { IndividualsComponent } from './views/sapling-requests/individuals/individuals.component';
import { OrganisationContractedComponent } from './views/sapling-requests/organisation-contracted/organisation-contracted.component';
import { OrganisationNonContractedComponent } from './views/sapling-requests/organisation-non-contracted/organisation-non-contracted.component';
import { AtndByNurseryComponent } from './views/attendance/atnd-by-nursery/atnd-by-nursery.component';
import { NgxMaskModule } from 'ngx-mask';
import { InventoryReportComponent } from './views/reports/inventory-report/inventory-report.component';
import { DateRangeComponent} from './shared/date-range/date-range';

import {AttendanceReportComponent} from './views/reports/attendance-report/attendance-report-list.component';
import { SpecieComponent } from './views/specie/specie.component';
import { SpecieAddComponent } from './views/specie/specie-add/specie-add.component'

const appearance: MatFormFieldDefaultOptions = {
	appearance: 'outline'
};

@NgModule({

	imports: [
		RouterModule,
		BrowserModule,
		AppRoutingModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		FlexLayoutModule,
		MaterialModule,
		CoreModule,
		UiSwitchModule,
		UiSwitchModule, FormsModule,
		HttpClientModule,
		NgxMaskModule.forRoot(),
	],
	declarations: [
		AppComponent,
		AuthAppLoginComponent,
		LoginComponent,
		OTPComponent,
		ForgotComponent,
		TableComponentComponent,
		InvokeDirective,
		MainAppComponent,
		InventoryComponent,
		NurseryComponent,
		GardnerComponent,
		// AttendanceComponent,
		TopTableHeaderComponent,
		AdminComponent,
		HeadGardnerComponent,
		AdminAddComponent,
		InventoryAddComponent,
		NurseryAddComponent,
		GardnerAddComponent,
		TopHeadingComponent,
		EditHeadGarnderComponent,
		ImageRowComponent,
		AppSettingComponent,
		ReportsComponent,
		GenratedReportComponent,
		DashboardComponent,
		GlobalListComponent,
		GlobalFormComponent,
		NurseryViewComponent,
		FormFooterComponent,
		AttendanceDetailComponent,
		IndividualsComponent,
		OrganisationContractedComponent,
		OrganisationNonContractedComponent,
		AtndByNurseryComponent,
		InventoryReportComponent,
		DateRangeComponent,
		AttendanceReportComponent,
		SpecieComponent,
		SpecieAddComponent,
		ProfileComponent
	],
	providers: [
		ApiService,
		LoaderService,
		AlertService,
		AuthGuard, ViewsGuard,
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: appearance
		},
		{ provide: LocationStrategy, useClass: HashLocationStrategy },
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
