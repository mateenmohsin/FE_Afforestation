import { Component, OnInit, ViewChild } from '@angular/core';
// import { TableComponentComponent } from '../../core/table-component/table-component.component';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalListComponent } from 'src/app/shared/global-list';
import { Router } from '@angular/router';
import { ApiService, AlertService } from 'src/app/services';

@Component({
	selector: 'app-nursery',
	templateUrl: './nursery.component.html',
	styleUrls: ['./nursery.component.scss']
})
export class NurseryComponent extends GlobalListComponent implements OnInit
{


	tableConfigAndProps = {};
	dataSource = new MatTableDataSource();

	tableHeaderProps = {
		headingLabel: "Nursery Listing",
		buttonLabel: "Create Nursery",
		buttonRoute: "nursery/add"
	};

	constructor(protected router: Router, protected apiService: ApiService, protected alertService: AlertService,)
	{
		super(router, apiService, alertService);
	}
	inputData = {
		'imageColumn': '',
		'actionColumn': 'Actions',
		'firstColumn': 'No.',
		'lastColumn': 'Actions',
		'roundedTable': true,
		'hasSwitch': true,
	}

	buttons =
		[{ buttonLabel: "Edit", color: "#242F68", buttonRoute: "nursery" },
		{ buttonLabel: "View", color: "#00B52A", buttonRoute: "nursery/detail" },]
	columnHeader = {
		'serialNumber': 'No.', 'nameEn': 'Nursery Name',
		'address': 'Address', 'headGardener': 'Head Gardener', 'Actions': 'Actions'
	};

	ngOnInit(): void
	{
		this.listApi = 'admin/fetch/nurseries?perPage=10';

		// super.ngOnInit();
		this.getList();

		this.tableConfigAndProps = {
			ActionButtons: this.buttons,
			inputData: this.inputData, columnHeader: this.columnHeader, dataSource: this.dataSource,
			pagination: this.pagination
		};
		if (this.greenerUser.user.role == 'admin')
		{
			this.buttons = [{ buttonLabel: "View", color: "#00B52A", buttonRoute: "nursery/detail" },]
		}
	}

	afterListResponse(): void
	{
		this.dataItems.forEach((element, index) =>
		{
			let headGardener = element.headGardener;
			if (!headGardener)
			{
				element.headGardener = 'N/A';
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
