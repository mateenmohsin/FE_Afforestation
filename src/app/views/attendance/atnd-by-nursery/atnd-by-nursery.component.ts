import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalListComponent } from 'src/app/shared/global-list';
import { Router } from '@angular/router';
import { ApiService, AlertService } from 'src/app/services';
import * as moment from 'moment';

@Component({
	selector: 'app-atnd-by-nursery',
	templateUrl: './atnd-by-nursery.component.html',
	styleUrls: ['./atnd-by-nursery.component.scss']
})
export class AtndByNurseryComponent extends GlobalListComponent implements OnInit
{

	tableConfigAndProps = {};

	dataSource = new MatTableDataSource();
	headingLabel = "Attendance Listing";
	buttonLabel = "Create Attendance";
	tableHeaderProps = { headingLabel: this.headingLabel, buttonLabel: this.buttonLabel };
	currentDate: Date = new Date();

	inputData = {
		'imageColumn': 'profilePicture',
		'actionColumn': 'Actions',
		'roundedTable': false,
		'firstColumn': 'No.',
		'lastColumn': 'Action',
		'hasDivs': true,
		'hasSwitch': false,
		'buttonEvent': 'onRowAction'
	}
	buttons = [{ buttonLabel: "View", color: "#00B52A", buttonRoute: "attendance" }]
	columnHeader = {
		'serialNumber': 'No.', 'profilePicture': 'Photo', 'gardenerName': 'Name', 'gardenerRole': 'Role',
		'attendance': 'Attendance', 'checkIn': 'Check In', 'checkOut': 'Check Out', 'Actions': 'Action'
	};

	constructor(protected router: Router, protected apiService: ApiService, protected alertService: AlertService)
	{
		super(router, apiService, alertService);

		this.filterArray = [
			{
				label: 'Select Nursery', type: 'search', key: 'nurseryId', selected: 'All',
				options: []
			},
			{
				label: 'Search Gardeners', type: 'search', key: 'id', selected: 'All',
				options: []
			},
			{
				label: 'Filter by Role', type: 'filter', key: 'role', selected: 'All',
				options: [
					{ key: 'All', value: 'All', label: 'All' },
					{ key: 'role', value: 'headGardener', label: 'Head Gardener' },
					{ key: 'role', value: 'gardener', label: 'Gardener' }
				]
			},
		];
		localStorage.removeItem('attendance');
	}

	ngOnInit(): void
	{
		this.filterUrl = { "key": "nurseryId", "value": "1" }
		this.listApi = 'admin/fetch/attendances?perPage=10'
		super.ngOnInit();

		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData, columnHeader: this.columnHeader, dataSource: this.dataSource
		};
	}

	afterListResponse(): void
	{
		this.dataItems.forEach(element =>
		{
			element['gardenerName'] = element.gardener.nameEn;
			// element.gardener.role = element.gardener.role.toLowerCase()
			// 	.split(' ')
			// 	.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			// 	.join(' ');
			if (element.gardener.role == 'gardener')
			{
				element['gardenerRole'] = 'Gardener'
			}
			else if (element.gardener.role == 'headGardener')
			{
				element['gardenerRole'] = 'Head Gardener'
			}

			if (element.gardenerPicture)
			{
				element['profilePicture'] = element['gardenerPicture'];
			}
			else
			{
				element['profilePicture'] = 'assets/images/placeholder.png';
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
		this.router.navigateByUrl('/main/attendance/' + event.row.id + '/' + event.row.gardener.id + '/detail');
	}

}
