import { Component, OnInit, ViewChild } from '@angular/core';


// import { TableComponentComponent } from '../../core/table-component/table-component.component';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalListComponent } from 'src/app/shared/global-list';
import { Router } from '@angular/router';
import { ApiService, AlertService } from 'src/app/services';
@Component({
	selector: 'app-head-gardner',
	templateUrl: './head-gardner.component.html',
	styleUrls: ['./head-gardner.component.scss']
})
export class HeadGardnerComponent extends GlobalListComponent implements OnInit
{


	tableConfigAndProps = {};
	dataSource = new MatTableDataSource();
	options = { 'Nursery 1': 'Product 1', 'Nursery 2': 'Product 2', 'Nursery 3': 'Product 3' }

	tableHeaderProps =
		{
			headingLabel: "Head Gardener Listing",
			buttonLabel: "Create Head Gardener",
			buttonRoute: "user-management/head-gardener/add"
		};
	constructor(protected router: Router, protected apiService: ApiService, protected alertService: AlertService,)
	{
		super(router, apiService, alertService);

		this.filterArray = [
			{
				label: 'Select Nursery', type: 'search', key: 'nurseryId', selected: 'All',
				options: []
			},
			// {
			// 	label: 'Sort by Name', type: 'sort', key: 'nameEn', selected: 'All',
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
		'hasSwitch': true,
		'firstColumn': 'No.',
		'lastColumn': 'Actions',
	}
	buttons =
		[{ buttonLabel: "Edit", color: "#242F68", buttonRoute: "user-management/head-gardener" },
		{ buttonLabel: "View", color: "#00B52A", buttonRoute: "user-management/head-gardener" },]

	columnHeader = {
		'serialNumber': 'No.',  'profilePicture': 'Photo', 'nameEn': 'Name',
		'identityNumber': 'Code', 'nursery': 'Current Nursery', 'Actions': 'Actions'
	};
	ngOnInit(): void
	{
		this.listApi = 'admin/fetch/gardeners?perPage=10'
		super.ngOnInit();

		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData, columnHeader: this.columnHeader, dataSource: this.dataSource
		};
	}

	afterListResponse(): void
	{
		this.filterData()
		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData,
			columnHeader: this.columnHeader,
			dataSource: new MatTableDataSource(this.dataItems),
			pagination: this.pagination
		};
	}


	filterData()
	{
		this.dataItems.forEach(element =>
			{
	
				var toText = element.identityNumber?.toString(); //convert to string
				var lastChar = toText?.slice(-1);
				// var length=toText.length-1
				var remainingChar = toText?.substr(0, toText?.length - 1);
				console.log("the item is ", length, remainingChar, lastChar)
				element.identityNumber = "XXXXX-XXXX" + remainingChar + "-" + lastChar
				//    element.loginPin="XXXXX-XXXX-"+element.loginPin;
	
			});
	}
}
