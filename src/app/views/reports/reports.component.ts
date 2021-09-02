import { Component, OnInit } from '@angular/core';
import { ApiService, AlertService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
	selector: 'app-reports',
	templateUrl: './reports.component.html',
	styleUrls: ['/src/app/views/shared-style.scss'],
})
export class ReportsComponent implements OnInit
{
	title = "Reports"
	type = '';
	currentDate: Date = new Date();
	nurseries: { key: string; value: string; label: string; }[];

	customerDate: any;
	customerRequestType: any;
	customerStatus: any;

	attendanceDate: any;
	attendanceNursery: any;

	inventoryDate: any;
	inventoryNursery: any;
	inventoryType: any;
	attendance: any;
	customerNursery: any;

	constructor(protected apiService: ApiService, protected router: Router, protected alertService: AlertService) { }

	ngOnInit(): void
	{
		this.type = '';
		this.getNurseries();
	}

	getNurseries(): any
	{
		this.apiService.get('admin/fetch/nurseries?fetchType=dropdown').then(res =>
		{
			if (res.code == 200)
			{
				this.nurseries = res.data;
			}
			else
			{
				this.nurseries = [];
			}
		});
	}

	onGenerateReport(type): void
	{
		this.type = type;

		console.log('dfjkdsjf');

		if (type == 'customer')
		{
			if (!this.customerRequestType || !this.customerStatus || !this.customerDate || !this.customerNursery)
			{
				this.alertService.alertInfo('Invalid Data', 'Please select all fields.');
				return;
			}
			let dict = {
				reportType: type,
				date: this.customerDate,
				requestType: this.customerRequestType,
				status: this.customerStatus,
				nurseryId: this.customerNursery.id,
				nurseryName: this.customerNursery.nameEn
			}

			localStorage.setItem(this.type, JSON.stringify(dict));
		}
		if (type == 'attendance')
		{
			if (!this.attendanceNursery)
			{
				this.alertService.alertInfo('Invalid Data', 'Please select all fields.');
				return;
			}
			let dict = {
				reportType: type,
				date: this.attendanceDate,
				attendance: this.attendance,
				nurseryId: this.attendanceNursery.id,
				nurseryName: this.attendanceNursery.nameEn
			}

			localStorage.setItem(this.type, JSON.stringify(dict));
		}
		if (type == 'inventory')
		{
			if (!this.inventoryDate || !this.inventoryNursery || !this.inventoryType)
			{
				this.alertService.alertInfo('Invalid Data', 'Please select all fields.');
				return;
			}
			let dict = {
				reportType: type,
				date: this.inventoryDate,
				inventoryType: this.inventoryType,
				nurseryId: this.inventoryNursery.id,
				nurseryName: this.inventoryNursery.nameEn
			}

			localStorage.setItem(this.type, JSON.stringify(dict));
		}

		this.router.navigateByUrl('main/reports/' + type);
	}

	onDateRange(event, type): void
	{
		if (event == 'removed')
		{
			if (type == 'customer')
			{
				this.customerDate = null;
			}
			if (type == 'attendance')
			{
				this.attendanceDate = null;
			}
			if (type == 'inventory')
			{
				this.inventoryDate = null;
			}
		}
		else
		{
			if (type == 'customer')
			{
				this.customerDate = event;
			}
			if (type == 'attendance')
			{
				this.attendanceDate = event;
			}
			if (type == 'inventory')
			{
				this.inventoryDate = event;
			}
		}


	}
	onChangeFilters(value, filter)
	{

	}
}
