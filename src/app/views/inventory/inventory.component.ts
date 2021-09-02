import { Component, OnInit, ViewChild } from '@angular/core';
// import { TableComponentComponent } from '../../core/table-component/table-component.component';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalListComponent } from 'src/app/shared/global-list';
import { Router } from '@angular/router';
import { ApiService, AlertService } from 'src/app/services';
import * as moment from 'moment';
@Component({
	selector: 'app-inventory',
	templateUrl: './inventory.component.html',
	styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent extends GlobalListComponent implements OnInit
{



	tableConfigAndProps = {};
	myProps1 = {};


	tableHeaderProps = {
		headingLabel: "Consumable Inventory Listing",
		buttonLabel: "Add Consumable Inventory",
		buttonRoute: "inventory/consumable/add"
	};

	tableHeaderProps1 = {
		headingLabel: "Fixed Inventory Listing",
		buttonLabel: "Add Fixed Inventory",
		buttonRoute: "inventory/fixed/add"
	};
	dataSource = new MatTableDataSource();
	dataSource1 = new MatTableDataSource();

	columnHeader = {
		'serialNumber': 'No.', 'specie': 'Species Name',
		'nursery': 'Nursery Name', 'categoryEn': 'Type', 'quantity': 'Quantity', 'updateTime': 'Date', 'Actions': 'Action'
	};

	inputData = {
		'imageColumn': '',
		'actionColumn': 'Actions',
		'firstColumn': 'No.',
		'lastColumn': 'Action',
		'roundedTable': false,
		'hasSwitch': false,
	}
	inputData1 = {
		'imageColumn': '',
		'actionColumn': 'Actions',
		'firstColumn': 'No.',
		'lastColumn': 'Action',
		'roundedTable': false,
		'hasSwitch': false,
	}
	columnHeader1 = { 
		'serialNumber': 'No.',
		'nursery': 'Nursery Name', 'categoryEn': 'Type Name', 'quantity': 'Kilograms', 'updateTime': 'Date', 'Actions': 'Action'
	};

	buttons = [
		{ buttonLabel: "Edit", color: "#242F68", buttonRoute: "inventory/consumable" },
		{ buttonLabel: "View", color: "#00B52A", buttonRoute: "inventory/consumable" },
		{ buttonLabel: "Delete", color: "red", buttonRoute: "inventory/consumable", output: true },
	]

	buttons1 = [
		// { buttonLabel: "Edit", color: "#242F68", buttonRoute: "inventory/fixed" },
		{ buttonLabel: "View", color: "#00B52A", buttonRoute: "inventory/fixed" },
	]

	filterSapling: any = { key: 'type', value: 'consumable' };
	filterFixed: any = { key: "type", value: "fixed" };

	listType: string;
	filterArray1: { label: string; type: string; key: string; selected: string; options: { key: string; value: string; label: string; }[]; }[];
	filterUrl1: string;
	paginationUrl1: string;

	constructor(protected router: Router, protected apiService: ApiService, protected alertService: AlertService,)
	{
		super(router, apiService, alertService);
	}

	ngOnInit(): void
	{
		this.filterArray = [
			{
				label: 'Select Nursery', type: 'search', key: 'nurseryId', selected: 'All',
				options: []
			},
			{
				label: 'Search Species', type: 'search', key: 'specieId', selected: 'All',
				options: []
			},
			{
				label: 'Search by Inventory', type: 'search', key: 'categoryEn', selected: 'All',
				options: [
					{ key: 'All', value: 'All', label: 'All' },
					{ key: 'categoryEn', value: 'seed', label: 'Seed' },
					{ key: 'categoryEn', value: 'cutting', label: 'Cutting' },
					{ key: 'categoryEn', value: 'sapling', label: 'Sapling' }
				]
			}
		];

		this.filterArray1 = [
			{
				label: 'Select Nursery', type: 'search', key: 'nurseryId', selected: 'All',
				options: []
			},
			{
				label: 'Search by Inventory', type: 'search', key: 'categoryEn', selected: 'All',
				options: [
					{ key: 'All', value: 'All', label: 'All' },
					{ key: 'categoryEn', value: 'Soil', label: 'Soil' },
					{ key: 'categoryEn', value: 'Plastic', label: 'Plastic Bags' }
				]
			}
		];

		this.listApi = 'admin/fetch/inventories?perPage=10';
		this.listType = 'sapling';

		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData,
			columnHeader: this.columnHeader,
			dataSource: this.dataSource
		};

		this.myProps1 = {
			ActionButtons: this.buttons1,
			inputData: this.inputData1,
			columnHeader: this.columnHeader1,
			dataSource: this.dataSource1,
		};
	}

	afterListResponse(): void
	{
		if (this.listType == 'sapling')
		{
			this.filterSaplingList();
			this.tableConfigAndProps = {
				ActionButtons: this.buttons,
				inputData: this.inputData,
				columnHeader: this.columnHeader,
				dataSource: new MatTableDataSource(this.dataItems),
				pagination: this.pagination
			};
		}
		else
		{

		}
	}
	filterSaplingList()
	{
		this.dataItems.forEach(element =>
		{
			element.categoryEn = element.categoryEn[0].toUpperCase() + element.categoryEn.substr(1).toLowerCase();
			if (element.categoryEn === "seed")
			{
				element["quantity"] = element.quantity.toString() + " Kg"
			}

		});
	}

	onPagination1(event): void
	{
		this.paginationUrl1 = '&page=' + event.page;
		this.getList2(this.filterUrl);
	}

	filnalFilters2(event): void
	{
		let filterUrl = '';

		if (event.filter.length > 0)
		{
			filterUrl = '&attributes=' + JSON.stringify(event.filter);
		}
		else if (event.filter.length == 0)
		{
			filterUrl = '&attributes=[]';
		}

		if (event.sort)
		{
			filterUrl = filterUrl + event.sort;
		}
		if (event.range)
		{
			filterUrl = filterUrl + event.range;
		}

		this.getList2(filterUrl);
	}

	getList2(filterUrl?: any): void
	{
		let url = this.listApi;
		this.filterUrl1 = '';

		if (filterUrl)
		{
			url = url + filterUrl;
			this.filterUrl1 = filterUrl;
		}

		if (this.paginationUrl1)
		{
			url = url + this.paginationUrl1;
		}

		this.apiService.get(url).then(result =>
		{
			if (result.code === 200) 
			{

				let dataItems = result.data.listing;
				let pagination = result.data.pagination;

				dataItems.forEach((element, index) =>
				{
					let date = element.createdTime;
					if (date)
					{
						element['dateTime'] = moment(date * 1000).format('MM/DD/YYYY HH:mm');
					}
					else
					{
						element['dateTime'] = moment().format('MM/DD/YYYY HH:mm');
					}

					let date2 = element.updatedTime;
                    if (date2)
                    {
                        element['updateTime'] = moment(date * 1000).format('MM/DD/YYYY HH:mm');
                    }
                    else
                    {
                        element['updateTime'] = moment().format('MM/DD/YYYY HH:mm');
                    }


					element['serialNumber'] = index + 1;
					if (element['categoryEn'] == 'soil')
					{
						element['categoryEn'] = 'Soil'
					};
					if (element['categoryEn'] == 'plastic')
					{
						element['categoryEn'] = 'Plastic Bags'
					};
				});

				this.myProps1 = {
					ActionButtons: this.buttons1,
					inputData: this.inputData1,
					columnHeader: this.columnHeader1,
					dataSource: new MatTableDataSource(dataItems),
					pagination: pagination
				};

				this.pagination = result.data.pagination;
			}
			else
			{
				this.alertService.alertError(result.status, result.message);
			}
		});
	}

	onRowAction(event): void
	{
		let heading = 'Delete Inventory?';
		let message = 'Are you sure you want to delete inventory?';
		let rightButton = 'Delete';
		let leftButton = 'Cancel';

		this.alertService.alertAsk(heading, message, rightButton, leftButton, false).then(result =>
		{
			console.log('result', result, event)
			if (result)
			{
				this.apiService.delete('admin/remove/consumable-inventory/' + event.row.id).then(result =>
				{
					if (result.code == 200)
					{
						this.getList();
						this.alertService.alertSuccess(result.status, result.message);
					}
					else
					{
						this.alertService.alertError(result.status, result.message);
					}
				});
			}
		})
	}
}
