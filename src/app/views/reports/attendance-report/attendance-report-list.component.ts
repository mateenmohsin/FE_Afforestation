import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalListComponent } from 'src/app/shared/global-list';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, AlertService } from 'src/app/services';
import * as moment from 'moment';

@Component({
	selector: 'app-attendance-report-list',
	templateUrl: './attendance-report-list.component.html'
})
export class AttendanceReportComponent extends GlobalListComponent implements OnInit
{
	tableConfigAndProps = {};

	dataSource = new MatTableDataSource();
	headingLabel = "Attendance Listing";

	tableHeaderProps = { headingLabel: this.headingLabel, buttonLabel: 'this.buttonLabel' };

	inputData = {
		'imageColumn': '',
		'actionColumn': 'Actions',
		'roundedTable': false,
		'firstColumn': 'No.',
		'lastColumn': 'Action',
		'hasDivs': true,
		'hasSwitch': false,
		'buttonEvent': 'onRowAction'
	}

	buttons = [{ buttonLabel: "View", color: "#00B52A", buttonRoute: "attendance" }];

	columnHeader = {
		'serialNumber': 'No.',  'gardenerName': 'Name', 'gardenerRole': 'Role',
		'attendance': 'Attendance', 'checkIn': 'Check In', 'checkOut': 'Check Out', 'Actions': 'Actions'
	};

	reportData: any;
	nurseryAttr: { key: string; value: any; };
	dateUrl: string;
	attendanceUrl: string;
	attendanceAttr: any;

	constructor(protected router: Router, protected apiService: ApiService, protected alertService: AlertService, protected _route: ActivatedRoute)
	{
		super(router, apiService, alertService);

		this.filterArray = [
			{
				label: 'Search Gardeners', type: 'search', key: 'gardenerId', selected: 'All',
				options: []
			}
		]
	}

	ngOnInit(): void
	{
		this.listApi = 'admin/fetch/attendance/report?perPage=10';
		this.reportData = JSON.parse(localStorage.getItem('attendance'));

		if (this.reportData.attendance != 'All')
		{
			// this.attendanceUrl = '&attendance=' + this.reportData.attendance
			this.attendanceAttr = { key: "attendance", value: this.reportData.attendance };
			console.log('skjdksjkdjksjdkjksajdkjsakdj')
		}

		if (this.reportData.date)
		{
			this.dateUrl = '&startDateTime=' + this.reportData.date.startDateTime + '&endDateTime=' + this.reportData.date.endDateTime;
		}

		this.nurseryAttr = { key: "nurseryId", value: this.reportData.nurseryId };


		super.ngOnInit();

		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData,
			columnHeader: this.columnHeader,
			dataSource: this.dataSource
		};
	}

	afterListResponse(): void
	{
		this.dataItems.forEach(element =>
		{
			element['gardenerName'] = element.gardener.nameEn;
			// element['gardenerRole'] = element.gardener.role;
			if (element.gardener.role == 'gardener')
			{
				element['gardenerRole'] = 'Gardener'
			}
			else if (element.gardener.role == 'headGardener')
			{
				element['gardenerRole'] = 'Head Gardener'
			}

			if (element.timeIn)
			{
				element['checkIn'] = moment(element.timeIn * 1000).format('MM/DD/YYYY HH:mm');
			}
			else
			{
				element['checkIn'] = 'N/A';
			}

			if (element.timeOut)
			{
				element['checkOut'] = moment(element.timeOut * 1000).format('MM/DD/YYYY HH:mm');
			}
			else
			{
				element['checkOut'] = 'N/A';
			}

		});

		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData,
			columnHeader: this.columnHeader,
			dataSource: new MatTableDataSource(this.dataItems),
			pagination: this.pagination
		};
	}

	onRowAction(event): void
	{
		this.router.navigateByUrl('/main/attendance/' + event.row.id + '/' + event.row.gardener.id + '/report');
	}

	filnalFilters(event): void
	{
		let filterUrl = this.listApi;

		if (event.filter.length > 0)
		{
			if (this.reportData.attendance != 'All')
			{
				event.filter.push(this.attendanceAttr);
			}
			filterUrl = '&attributes=' + JSON.stringify(event.filter);
		}
		else if (event.filter.length == 0)
		{
			event.filter.push(this.nurseryAttr);
			if (this.reportData.attendance != 'All')
			{
				event.filter.push(this.attendanceAttr);
			}


			filterUrl = '&attributes=[]';
		}

		if (this.dateUrl)
		{
			filterUrl = filterUrl + this.dateUrl;
		}

		// if (this.attendanceUrl)
		// {
		// 	filterUrl = filterUrl + this.attendanceUrl;
		// }

		if (event.search)
		{
			filterUrl = filterUrl + event.search;
		}

		this.getList(filterUrl)
	}

}
