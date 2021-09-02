import { Component, OnInit, ViewChild } from '@angular/core';
// import { TableComponentComponent } from '../../core/table-component/table-component.component';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalListComponent } from 'src/app/shared/global-list';
import { Router } from '@angular/router';
import { ApiService, AlertService } from 'src/app/services';
import * as moment from 'moment';
@Component({
	selector: 'app-specie',
	templateUrl: './specie.component.html',
	styleUrls: ['./specie.component.scss']
})
export class SpecieComponent extends GlobalListComponent implements OnInit
{
	tableConfigAndProps = {};
	myProps1 = {};


	tableHeaderProps = {
		headingLabel: "Species Listing",
		buttonLabel: "Add Species",
		buttonRoute: "species/add"
	};

	dataSource = new MatTableDataSource();

	columnHeader = {
		'serialNumber': 'No.',  'nameEn': 'Species Name',
		'alternativeNameEn': 'Alternate Name', 'seedCountPerKg': 'Seed count/kg', 'benchmarkSuccessRatio': 'Benchmark Success Ratio', 'Actions': 'Actions'
	};

	// alternativeNameEn: "Japanese Fruit"
	// alternativeNameUr: "جاپانی پھل"
	// benchmarkSuccessRatio: 75
	// createdTime: 1612854525
	// id: 6
	// image: "https://andpercent-afforestation.s3.ap-south-1.amazonaws.com/uploads/inventory/images/1612854521652.jpeg"
	// nameEn: "Japanese Fruit"
	// nameUr: "جاپانی پھل"
	// seedCountPerKg: 1500
	// status: false

	inputData = {
		'imageColumn': '',
		'actionColumn': 'Actions',
		'firstColumn': 'No.',
		'lastColumn': 'Action',
		'roundedTable': false,
		'hasSwitch': false,
	}


	buttons = [
		{ buttonLabel: "Edit", color: "#242F68", buttonRoute: "species" },
		{ buttonLabel: "View", color: "#00B52A", buttonRoute: "species" },
	]


	filterSapling: any = { key: 'type', value: 'consumable' };

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
			// {
			// 	label: 'Select Nursery', type: 'search', key: 'nurseryId', selected: 'All',
			// 	options: []
			// },
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


		this.listApi = 'admin/fetch/species?perPage=10';
		this.listType = 'sapling';

		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData,
			columnHeader: this.columnHeader,
			dataSource: this.dataSource
		};
	}

	afterListResponse(): void
	{
		this.dataItems.forEach((element, index) =>
		{
			let alternativeNameEn = element.alternativeNameEn;
			if (!alternativeNameEn)
			{
				element['alternativeNameEn'] = 'N/A';
			}
		});
		
		if (this.listType == 'sapling')
		{
			this.filterSaplingList()
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
		{    element['benchmarkSuccessRatio']=element.benchmarkSuccessRatio.toString()+"%";
			if (element.categoryEn === "seed")
			{
				element["quantity"] = element.quantity.toString() + " Kg"
			}

		});
	}

	onPagination1(event): void
	{
		this.paginationUrl1 = '&page=' + event.page;
	}


}

