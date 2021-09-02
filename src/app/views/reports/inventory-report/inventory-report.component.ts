import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { GlobalListComponent } from 'src/app/shared/global-list';
import { Router } from '@angular/router';
// import { ApiService, AlertService } from 'src/app/services';

import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
	selector: 'app-inventory-report',
	templateUrl: './inventory-report.component.html',
	styleUrls: ['./inventory-report.component.scss']
})
export class InventoryReportComponent extends GlobalListComponent implements OnInit
{

	tableConfigAndProps = {};
	activeColHeader: any;
	inputData = {
		'roundedTable': false,
		'firstColumn': 'No.',
		'lastColumn': 'Available Stock',
		'hasSwitch': false,
	}

	buttons = [
		{ buttonLabel: "Edit", color: "#242F68", buttonRoute: "gardener" },
		{ buttonLabel: "View", color: "#00B52A", buttonRoute: "gardener" }
	]

	columnHeaderConsumable = {
		'serialNumber': 'No.', 'dateTime': 'Date/Time',
		'nameEn': 'Name', 'categoryEn': 'Type', 'stockIn': 'Stock In', 'stockOut': 'Stock Out', 'quantity': 'Available Stock',
	};
	columnHeaderFixed = {
		'serialNumber': 'No.', 'dateTime': 'Date/Time',
		'categoryEn': 'Name', 'stockIn': 'Stock In', 'stockOut': 'Stock Out', 'quantity': 'Available Stock',
	};

	// columnHeader = {
	// 	'num': '#', 'id': 'Request ID', 'reqType': 'Request Type',
	// 	'description': 'Sapling Name', 'quantityDistributed': 'Quantity', 'dateTime': 'Date/Time',
	// };

	dataSource = new MatTableDataSource();
	reportData: any;
	dataLoaded: boolean;
	inventoryReportKpi: any;

	constructor(protected router: Router, protected apiService: ApiService, protected alertService: AlertService,)
	{
		super(router, apiService, alertService);
	}

	ngOnInit(): void
	{
		this.reportData = JSON.parse(localStorage.getItem('inventory'));
		let attributes = [
			{ key: "nurseryId", value: this.reportData.nurseryId }
		]
		if (this.reportData.inventoryType != 'All')
		{
			attributes.push({ key: "type", value: this.reportData.inventoryType })
		}
		if (this.reportData)
		{
			this.listApi = 'admin/fetch/inventory/report?startDateTime=' + this.reportData.date.startDateTime + '&endDateTime=' + this.reportData.date.endDateTime + '&attributes=' + JSON.stringify(attributes) + '&nurseryId=' + this.reportData.nurseryId;

			this.getList();
			this.getInventoryReportKpis('');
			if (this.reportData.inventoryType == 'fixed')
			{
				this.activeColHeader = this.columnHeaderFixed
			}
			else 
			{
				this.activeColHeader = this.columnHeaderConsumable
			}
			this.tableConfigAndProps = {
				ActionButtons: this.buttons,
				inputData: this.inputData,
				columnHeader: this.activeColHeader,
				dataSource: this.dataSource
			};

		}
	}

	afterListResponse(): void
	{
		// console.log('dsjkdjsakdjka')
		this.filterData()
		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData,
			columnHeader: this.activeColHeader,
			dataSource: new MatTableDataSource(this.dataItems),
			pagination: this.pagination
		};
	}

	filterData()
	{
		this.dataItems.forEach(element =>
		{
			if (this.reportData.inventoryType == 'fixed')
			{
				element["stockIn"] = element.stockIn.toString() + " Kg";
				element["stockOut"] = element.stockOut.toString() + " Kg";
				element["quantity"] = element.quantity.toString() + " Kg";
			}

			if (this.reportData.inventoryType == 'consumable')
			{
				if (element.categoryEn === "seed" || element.categoryEn === "cutting")
				{
					element["stockIn"] = element.stockIn.toString() + " Kg";
					element["stockOut"] = "N/A";
					element["quantity"] = element.quantity.toString() + " Kg";
					// element["used"] = element.stockOut.toString() + " Kg";
				}
			}


			element.categoryEn = element.categoryEn[0].toUpperCase() + element.categoryEn.substr(1).toLowerCase();

		});
	}
	getInventoryReportKpis(filter): void
	{
		this.dataLoaded = false;
		let url = 'admin/fetch/inventory/kpis?startDateTime=' + this.reportData.date.startDateTime + '&endDateTime=' + this.reportData.date.endDateTime + '&nurseryId=' + this.reportData.nurseryId;

		if (filter)
		{
			url = url + filter;
		}

		this.apiService.get(url).then(result =>
		{
			if (result.code === 200 && result.data) 
			{
				this.inventoryReportKpi = result.data;
				this.dataLoaded = true;
			}
			else
			{
				this.inventoryReportKpi = {
					cuttingStockIn: 0,
					plasticStockIn: 0,
					samplingStockIn: 0,
					samplingStockOut: 0,
					saplingsStock: 0,
					seedStockIn: 0,
					soilStockIn: 0,
					totalSpcies: 0,
				};
				this.dataLoaded = true;
				this.alertService.alertError(result.status, result.message);
			}
		});
	}
}