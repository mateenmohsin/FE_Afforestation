import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthAppLoginComponent } from './templates/auth-app/auth-app-login.component';

import { LoginComponent, ForgotComponent, OTPComponent } from './templates/auth-app';
import { MainAppComponent } from './templates/main-app/main-app.component';
// import { TableComponentComponent } from './core/table-component/table-component.component';
import { AppComponent } from './app.component';
import { InventoryComponent } from './views/inventory/inventory.component';
import { GardnerComponent } from './views/gardner/gardner.component';
import { NurseryComponent } from './views/nursery/nursery.component';
// import { AttendanceComponent } from './views/attendance/attendance.component';
import { AdminComponent } from './views/admin/admin.component';
import { HeadGardnerComponent } from './views/head-gardner/head-gardner.component';
import { AdminAddComponent } from './views/admin/admin-add/admin-add.component';
import { InventoryAddComponent } from './views/inventory/inventory-add/inventory-add.component';
import { NurseryAddComponent } from './views/nursery/nursery-add/nursery-add.component';
import { GardnerAddComponent } from './views/gardner/gardner-add/gardner-add.component';
import { EditHeadGarnderComponent } from './views/head-gardner/edit-head-garnder/edit-head-garnder.component';
import { AppSettingComponent } from './views/app-setting/app-setting.component';
import { ReportsComponent } from './views/reports/reports.component';
import { GenratedReportComponent } from './views/reports/genrated-report/genrated-report.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { NurseryViewComponent } from './views/nursery/nursery-view/nursery-view.component';
import { AttendanceDetailComponent } from './views/attendance/attendance-detail/attendance-detail';
import { IndividualsComponent } from './views/sapling-requests/individuals/individuals.component';
import { OrganisationContractedComponent } from './views/sapling-requests/organisation-contracted/organisation-contracted.component';
import { OrganisationNonContractedComponent } from './views/sapling-requests/organisation-non-contracted/organisation-non-contracted.component';
import { AtndByNurseryComponent } from './views/attendance/atnd-by-nursery/atnd-by-nursery.component';
import { InventoryReportComponent } from './views/reports/inventory-report/inventory-report.component';
import { SpecieComponent } from './views/specie/specie.component';
import { SpecieAddComponent } from './views/specie/specie-add/specie-add.component'
import { AuthGuard } from './guards/auth.guard';
import { ViewsGuard } from './guards/views.guard';


import { AttendanceReportComponent } from './views/reports/attendance-report/attendance-report-list.component'
import { ProfileComponent } from './views/admin/profile/profile.component';

const mainApp: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'profile', component: ProfileComponent },

	{ path: 'sapling-requests/individuals', component: IndividualsComponent },
	{ path: 'sapling-requests/organisation-contracted', component: OrganisationContractedComponent },

	{ path: 'sapling-requests/organisation-nonContracted', component: OrganisationNonContractedComponent },

	{ path: 'inventory', component: InventoryComponent },
	{ path: 'inventory/:inventoryType/:id/:type', component: InventoryAddComponent },

	{ path: 'species', component: SpecieComponent },
	{ path: 'species/:id/:type', component: SpecieAddComponent },

	{ path: 'gardener', component: GardnerComponent },
	{ path: 'gardener/:id/:type', component: GardnerAddComponent },

	{ path: 'nursery', component: NurseryComponent },
	{ path: 'nursery/:id/:type', component: NurseryAddComponent },
	{ path: 'nursery/detail/:id/:type', component: NurseryViewComponent },

	{ path: 'attendance', component: AtndByNurseryComponent },
	{ path: 'attendance/:attendanceId/:gardenerId/:type', component: AttendanceDetailComponent },

	{ path: 'user-management/admin', component: AdminComponent },
	{ path: 'user-management/admin/:id/:type', component: AdminAddComponent },
	{ path: 'user-management/head-gardener', component: HeadGardnerComponent },
	{ path: 'user-management/head-gardener/:id/:type', component: EditHeadGarnderComponent },

	{ path: 'reports', component: ReportsComponent },
	// { path: 'reports/:id/:type', component: GenratedReportComponent },
	{ path: 'reports/customer', component: GenratedReportComponent },
	{ path: 'reports/inventory', component: InventoryReportComponent },
	{ path: 'reports/attendance', component: AttendanceReportComponent },
	{ path: 'settings', component: AppSettingComponent },
];


const publicRoutes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'login-old', component: AuthAppLoginComponent },
	{ path: 'otp', component: OTPComponent },
	{ path: 'forgot', component: ForgotComponent },
];

const routes: Routes = [
	{ path: '', redirectTo: 'auth/login', pathMatch: 'full' },
	{ path: 'auth', component: AppComponent, children: publicRoutes, canActivate: [AuthGuard] },
	{ path: 'main', component: MainAppComponent, children: mainApp, canActivate: [ViewsGuard] }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { } 
