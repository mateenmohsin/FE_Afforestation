import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponentComponent } from '../../../core/table-component/table-component.component';
import { GlobalListComponent } from 'src/app/shared/global-list';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, AlertService } from 'src/app/services';
import { MatTableDataSource } from '@angular/material/table';
@Component({
	selector: 'app-individuals',
	templateUrl: './individuals.component.html',
	styleUrls: ['./individuals.component.scss']
})
export class IndividualsComponent extends GlobalListComponent implements OnInit
{

	title = "Individual"
	tableConfigAndProps = {};
	dataSource = new MatTableDataSource();

	inputData = {
		'imageColumn': 'profilePicture',
		'actionColumn': 'Actions',
		'expandColumn': 'expandable',
		'firstColumn': 'No.',
		'lastColumn': '',
		'roundedTable': true,
		'hasSwitch': false,
		'buttonEvent': 'output'
	}

	buttons = [
		{ buttonLabel: "Approve", color: "#00B52A", buttonStatus: "approved" },
		{ buttonLabel: "Partial Approve", color: "#FF6C00", buttonStatus: "partaillyApproved" },
		{ buttonLabel: "Reject", color: "red", buttonStatus: "rejected" },
	]
	// 'customerPin': 'ID'
	columnHeader = {
		'serialNumber': 'No.', 'customer': 'Name', 'nursery': 'Nursery Name',
		'dateTime': 'Date', 'typeEn': 'Type', 'quantity': 'Requested Qty', 'Actions': 'Actions', 'expandable': ''
	};


	constructor(protected router: Router, protected apiService: ApiService, protected _route: ActivatedRoute, protected alertService: AlertService,)
	{
		super(router, apiService, alertService);
		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData, columnHeader: this.columnHeader, dataSource: this.dataSource,
		};
		this.filterArray = [
			{
				label: 'Filter by Status', type: 'filter', key: 'processingStatusEn', selected: 'pending',
				options: [
					// { key: 'All', value: 'All', label: 'All' },
					{ key: 'processingStatusEn', value: 'pending', label: 'Pending' },
					{ key: 'processingStatusEn', value: 'approved', label: 'Approved' },
					{ key: 'processingStatusEn', value: 'partaillyApproved', label: 'Partially Approved' },
					{ key: 'processingStatusEn', value: 'rejected', label: 'Rejected' }
				]
			},
		]

		this.listApi = 'admin/fetch/sampling-requests?perPage=10';
		// this.getList()
		super.ngOnInit();
	}

	afterListResponse(): void
	{
		this.title = "Individual"
		this.filterData()
		console.log(this.dataItems)
		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData,
			columnHeader: this.columnHeader,
			dataSource: new MatTableDataSource(this.dataItems),
			pagination: this.pagination
		};
		this.title = this.title + " (" + this.pagination.count + ")"
	}

	filterData()
	{
		console.log(this.dataItems, "getting data")
		this.dataItems.forEach(element =>
		{
			element.organization = element.organization?.nameEn
			element.nursery = element.nursery?.nameEn
			element['customerPin'] = element.customer?.identityNumber
			element['name'] = element.customer?.nameEn
			element['saplingType'] = "individuals"
			element.customer.nameEn = element.customer.nameEn + " (" + element.customer?.identityNumber + ")"
			if (element.samplingRequestItems.length > 1)
			{
				element["typeEn"] = 'Multiple';
				element["expanded"] = 'false';
			}
			else if (element.samplingRequestItems.length == 1)
			{
				element["typeEn"] = 'Single';
				element["expanded"] = 'false';
			}
		});
	}
}
