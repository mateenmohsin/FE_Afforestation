import { Component, OnInit, ViewChild } from '@angular/core';
import { Product, tableHeaderProps } from 'src/app/models/models';

import { TableComponentComponent } from 'src/app/core/table-component/table-component.component';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalListComponent } from 'src/app/shared/global-list';
import { Router } from '@angular/router';
import { ApiService, AlertService } from 'src/app/services';
import * as moment from 'moment';

@Component({
	selector: 'app-genrated-report',
	templateUrl: './genrated-report.component.html',
	styleUrls: ['./genrated-report.component.scss']
})
export class GenratedReportComponent extends GlobalListComponent implements OnInit
{

	dataSource = new MatTableDataSource();
	tableConfigAndProps = {};

	inputData = {
		'roundedTable': false,
		'firstColumn': 'No.',
		'lastColumn': 'Date/Time',
		'hasSwitch': false,
	}

	buttons = [
		{ buttonLabel: "Edit", color: "#242F68", buttonRoute: "gardener" },
		{ buttonLabel: "View", color: "#00B52A", buttonRoute: "gardener" }
	]

	columnHeader = {
		'serialNumber': '#',
		// 'id': 'Request ID',
		'reqType': 'Request Type',
		'quantity': 'Quantity',
		'dateTime': 'Date/Time',
	};

	columnHeaderAll = {
		'serialNumber': '#',
		// 'id': 'Request ID',
		'reqType': 'Request Type',
		'quantity': 'Quantity',
		'quantityDistributed': 'Distributed Quantity',
		'dateTime': 'Date/Time',
	};


	dataLoaded: boolean;
	customerReportKpi: any = {
		contractedOrganizationsSaplingsRequest: 0,
		individualSaplingsRequest: 0,
		nonContractedOrganizationsSaplingsRequest: 0,
		requestDailyAverage: 0,
		saplingsDailyAverage: 0,
		saplingsDistributed: 0,
		totalRequests: 0,
	};
	reportData: any;
	dateUrl: string;
	activeColumns: any;
	statusUrl: string;
	kpiUrl: any;
	typeEn: string = '';
	nurrUrl: any = '';

	constructor(protected router: Router, protected apiService: ApiService,
		protected alertService: AlertService,)
	{
		super(router, apiService, alertService);
	}

	ngOnInit(): void
	{
		this.reportData = JSON.parse(localStorage.getItem('customer'));
		// 		endDateTime: 1614020399
		// startDateTime: 1612119600

		console.log(this.reportData);
		// if all status is selected then hum quantity and quantityDistributed dono show kareingy . 
		// if pending status is selected then hum quantity  donoshow kareingy .
		// if cancelled or rejected status is selected then hum quantity  show kareingy .
		// if approved / partial approved status is selected then hum quantity and quantityDistributed dono show kareingy .

		if (this.reportData.status == 'All' || this.reportData.status == 'approved' || this.reportData.status == 'partaillyApproved')
		{
			this.activeColumns = this.columnHeaderAll;
		}

		if (this.reportData.status == 'pending' || this.reportData.status == 'cancelled' || this.reportData.status == 'rejected')
		{
			this.activeColumns = this.columnHeader;
		}
        console.log("active columns",this.activeColumns,this.reportData)
		// this.reportData = JSON.parse(localStorage.getItem('inventory'));

		let attributes = [];

		if(this.reportData.nurseryId != -1)
		{
			attributes.push({ key: "nurseryId", value: this.reportData.nurseryId });
			this.nurrUrl = '&nurseryId=' + this.reportData.nurseryId;
		}

		// let attributes = [
		// 	{ key: "nurseryId", value: this.reportData.nurseryId }
		// ]

		if (this.reportData.requestType != 'All')
		{
			attributes.push({ key: "typeEn", value: this.reportData.requestType });
			this.typeEn = '&typeEn=' + this.reportData.requestType;
		}

		if (this.reportData.status != 'All')
		{
			attributes.push({ key: "processingStatusEn", value: this.reportData.status });
		}

		this.dateUrl = 'startDateTime=' + this.reportData.date.startDateTime + '&endDateTime=' + this.reportData.date.endDateTime;
		// this.statusUrl = '&processingStatusEn=' + this.reportData.status;

		this.listApi = 'admin/fetch/sampling-request/report?' + this.dateUrl + '&attributes=' + JSON.stringify(attributes) + this.typeEn + this.nurrUrl;

		this.kpiUrl = 'admin/fetch/sampling-request/kpis?' + this.dateUrl + '&attributes=' + JSON.stringify(attributes) + this.typeEn + this.nurrUrl;

		this.getList();

		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData,
			columnHeader: this.activeColumns,
			dataSource: new MatTableDataSource(this.dataItems),
		};
	}

	afterListResponse(): void
	{
		let dataItems = [];
		this.dataItems.forEach((element, idx) =>
		{
			if (element.typeEn == 'nonContractedOrganization')
			{
				element.reqType = 'Non Contracted Organisation'
			}
			if (element.typeEn == 'contractedOrganization')
			{
				element.reqType = 'Contracted Organisation'
			}
			if (element.typeEn == 'individual')
			{
				element.reqType = 'Individual'
			}
			element['num'] = idx + 1;
			element['dateTime'] = moment(element.createdTime * 1000).format('MM/DD/YYYY HH:mm');;
		});

		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData,
			columnHeader: this.activeColumns,
			dataSource: new MatTableDataSource(this.dataItems),
			pagination: this.pagination
		};

		this.getCustomerReportKpis('');
	}

	getCustomerReportKpis(filter): void
	{
		this.dataLoaded = false;
		let url = this.kpiUrl;

		if (filter)
		{
			url = url + filter;
		}

		this.apiService.get(url).then(result =>
		{
			if (result.code === 200 && result.data) 
			{
				this.customerReportKpi = result.data;
				this.dataLoaded = true;
			}
			else
			{
				this.customerReportKpi = {
					contractedOrganizationsSaplingsRequest: 0,
					individualSaplingsRequest: 0,
					nonContractedOrganizationsSaplingsRequest: 0,
					requestDailyAverage: 0,
					saplingsDailyAverage: 0,
					saplingsDistributed: 0,
					totalRequests: 0,
				};
				this.dataLoaded = true;
				this.alertService.alertError(result.status, result.message);
			}
		});
	}

}
