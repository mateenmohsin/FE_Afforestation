import { Component, OnInit, ViewChild } from '@angular/core';
// import { TableComponentComponent } from '../../core/table-component/table-component.component';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalListComponent } from 'src/app/shared/global-list';
import { Router } from '@angular/router';
import { ApiService, AlertService } from 'src/app/services';
@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends GlobalListComponent implements OnInit
{


	tableConfigAndProps = {};
	dataSource = new MatTableDataSource();


	tableHeaderProps = {
		headingLabel: "Admin Listing",
		buttonLabel: "Create Admin",
		buttonRoute: "user-management/admin/add"
	};

	constructor(protected router: Router, protected apiService: ApiService, protected alertService: AlertService,)
	{
		super(router, apiService, alertService);

		this.filterArray = [
			// {
			// 	label: 'Sort by Name', type: 'sort', key: 'name', selected: 'All',
			// 	options: [
			// 		{ key: 'All', value: 'All', label: 'All' },
			// 		{ key: 'ASC', value: 'ASC', label: 'ASC' },
			// 		{ key: 'DESC', value: 'DESC', label: 'DESC' }
			// 	]
			// },
			{
				label: 'Filter by Status', type: 'filter', key: 'status', selected: 'All',
				options: [
					{ key: 'All', value: 'All', label: 'All' },
					{ key: 'status', value: true, label: 'Active' },
					{ key: 'status', value: false, label: 'Inactive' }
				]
			},
		]
	}


	inputData = {
		'imageColumn': 'profilePicture',
		'actionColumn': 'Actions',
		'roundedTable': false,
		'firstColumn': 'No.',
		'lastColumn': 'Action',
		'hasSwitch': true,
	}

	buttons = [
		{ buttonLabel: "Edit", color: "#242F68", buttonRoute: "user-management/admin" },
		{ buttonLabel: "View", color: "#00B52A", buttonRoute: "user-management/admin" },
	]

	columnHeader = {
		'serialNumber': 'No.',  'profilePicture': 'Photo', 'name': 'Name'
		, 'email': 'Email', 'role': 'Role', 'Actions': 'Actions'
	};

	ngOnInit(): void
	{
		this.filterUrl = [{ "key": "status", "value": true }, { "key": "role", "value": "admin" }]
		this.listApi = 'admin/fetch/admins?perPage=10'


		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData, columnHeader: this.columnHeader, dataSource: this.dataSource
		};

		super.ngOnInit();
	}

	afterListResponse(): void
	{
		this.dataItems.forEach((element, index) =>
		{
			if (element.role == 'admin')
			{
				element.role = 'Admin';
			}
			if (element.role == 'superAdmin')
			{
				element.role = 'Super Admin';
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
}
