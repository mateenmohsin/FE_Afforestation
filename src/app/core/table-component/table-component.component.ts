import { Component, OnInit, Inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router, NavigationExtras } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AlertService } from 'src/app/services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
	selector: 'app-table-component',
	templateUrl: './table-component.component.html',
	styleUrls: ['./table-component.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class TableComponentComponent implements OnInit
{
	objectKeys = Object.keys;
	inputData: any;
	columnHeader: any;
	@Input() props: { ActionButtons: boolean; inputData: any; columnHeader: any; dataSource: any; pagination: any };
	@Output() selectedItem: EventEmitter<string> = new EventEmitter<string>();
	@Output() status: EventEmitter<string> = new EventEmitter<string>();
	@Output() onRowAction: EventEmitter<any> = new EventEmitter<any>();
	@Output() onPagination: EventEmitter<any> = new EventEmitter<any>();

	showImage: boolean = false;
	showActions: boolean = false;
	expandPanel: boolean = false;
	expandButton: boolean = false;
	hasDivs: boolean = false;
	makeDiv: boolean = false;
	hasCustomData: boolean = false;
	canApprove: boolean = true;
	hasimageDialog = false;
	customData: any;
	divColor: any;
	dicIcon: any;
	saplingType: any;

	firstColumn = "No."
	lastColumn = "Action"
	roundedTable: boolean;
	hasSwitch: string;
	id: number;
	expand_button = ""
	expanded: any;
	expand_source = ""
	expandedElements: any;
	sendOutput: any;
	dataSource = new MatTableDataSource();
	divIcon: string;
	notApprovedNames = ""


	constructor(protected router: Router, public dialog: MatDialog, protected alertService: AlertService)
	{

	}
	// @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

	// @ViewChild(MatSort, { static: true }) sort: MatSort;

	ngOnInit()
	{    // Logs console.log("props are",this.props)

		// this.dataSource.paginator = this.paginator;
		this.inputData = this.props.inputData;
		this.columnHeader = this.props.columnHeader;
		// this.dataSource.sort = this.sort;
		//this.dataSource = new MatTableDataSource(this.inputListData);
		this.updateInputData();
		// Logs console.log(this.inputData);
		this.dataSource = this.props.dataSource;
	}
	updateInputData()
	{

		this.roundedTable = this.inputData?.roundedTable;
		this.hasSwitch = this.inputData?.hasSwitch;
		this.firstColumn = this.inputData?.firstColumn
		this.lastColumn = this.inputData?.lastColumn
		this.hasDivs = this.inputData?.hasDivs

	}

	seeElement(element, data)
	{
		this.showActions = element === this.inputData.actionColumn ? true : false;
		this.showImage = element === this.inputData.imageColumn ? true : false
		this.expandPanel = element === this.inputData.expandColumn ? true : false
		this.hasimageDialog = element === "contractImage" ? true : false
		//  console.log("this is ",element,data)
		this.checkExpand(element, data)
		this.checkAttendance(element, data)

	}
	checkExpand(element, data)
	{
		if (element == "typeEn")
		{
			this.expandButton = (data.typeEn === 'Multiple' || data.typeEn === 'Single') ? true : false
			this.expandedElements = data.samplingRequestItems
		}

	}
	checkAttendance(element, data)
	{
		if (element === "attendance")
		{
			this.hasDivs = true
			if (data.attendance === "absent")
			{
				this.divColor = "#FFC3C1";
				this.divIcon = 'close';
			}
			else if (data.attendance === "present")
			{
				this.divColor = "#89E4C0";
				this.divIcon = 'done';
			}
			else
			{
				this.divColor = "#DDDDDD";
				this.divIcon = 'done';
			}
			// Logs console.log(this.divColor)
		}


		else { this.hasDivs = false }

	}
	applyFilter(filterValue: any)
	{
		//const filterValue = event;

		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	afterListResponse(data): void
	{
		this.dataSource = new MatTableDataSource(data);

	}

	setPage(pageData: any) 
	{
		this.onPagination.emit(pageData);
	}

	buttonClicked(row, item)
	{
		if(item.output)
		{
			let dict = {
				row: row,
				item: item,
			}
			this.onRowAction.emit(dict);
			return;
		};

		if (this.inputData.buttonEvent === "onRowAction")
		{
			let dict = {
				row: row,
				item: item,
			}
			this.onRowAction.emit(dict);
		}
		else if (this.inputData.buttonEvent === "output")
		{
			this.notApprovedNames = ""
			this.canApprove = true;
			this.validateSaplingRequest(row)
			let heading;
			let inputEditable = true;
			let rightButton = 'Approve ';
			if (item.buttonLabel == "Approve")
			{
				heading = 'Approval Of Request'
				inputEditable = true;
			}
			else if (item.buttonLabel == "Partial Approve")
			{
				heading = 'Partial Approval Of Request'
				inputEditable = false;
			}
			else 
			{
				heading = 'Rejection Reason  '
				rightButton = 'Reject';
			}
			let message = ''
			
			let leftButton = 'Cancel';
			let dataToSubmit = row;
			dataToSubmit = this.updateDataToSubmit(dataToSubmit, item.buttonLabel)

			if (item.buttonLabel == "Approve")
			{
				if (this.canApprove)
				{
					this.alertService.saplingAlertAsk(heading, message, rightButton, leftButton, true, dataToSubmit, inputEditable).then(result =>
					{
						if (result)
						{
							this.sendData(row, item, result)
						}
					});
				}
				else
				{
					message = "<p>Cannot Perform Action as </br> The requested quantity for"
						+ this.notApprovedNames + " is greater than available quantity";
					this.alertService.alertError('', message);
				}

			}
			else if (item.buttonLabel == "Partial Approve")
			{
				this.alertService.saplingAlertAsk(heading, message, rightButton, leftButton, true, dataToSubmit, inputEditable).then(result =>
				{
					if (result)
					{
						this.sendData(row, item, result)
					}
				});
			}
			else
			{   let rightButton = 'Reject';
				// this.alertService.alertAsk(heading, message, rightButton, leftButton, true).then(result =>
				// {
				// 	if (result)
				// 	{
				// 		// console.log("this is result", result)
				// 		this.sendData(row, item, result)
				// 	}
				// });
				this.alertService.saplingAlertAsk(heading, message, rightButton, leftButton, true, dataToSubmit, inputEditable).then(result =>
					{
						if (result)
						{
							this.sendData(row, item, result)
						}
					});
			}

		}
		else
		{
			this.router.navigateByUrl('/main/' + item.buttonRoute + '/' + row.id + '/' + item.buttonLabel);
		}
	}

	updateDataToSubmit(dataToSubmit, type)
	{
		dataToSubmit.samplingRequestItems.forEach((element, index) =>
		{  element['serialNumber'] = index + 1;
			if(type == 'Approve')
			{
				element['quantityGiven'] = element.quantityRequested
			}
			else
			{
				element['quantityGiven'] = 0
			}
		});
		return dataToSubmit;

	}

	sendData(row, item, reason)
	{
		this.sendOutput = {
			"row": row,
			"status": item.buttonStatus,
			"reason": reason,
		}
		console.log(this.sendOutput, "this is data i am sending")
		this.selectedItem.emit(this.sendOutput);
	}

	validateSaplingRequest(row)
	{
		row.samplingRequestItems.forEach(element =>
		{
			// console.log(element)
			// console.log(this.notApprovedNames.length, "length")
			if (element.quantityRequested > element.inventory.quantity)
			{
				this.canApprove = false;
				this.notApprovedNames += this.notApprovedNames.length == 0 ? ' ' + element.inventory.specie.nameEn : ',' + element.inventory.specie.nameEn;
			}
		});
	}

	checkQuantityStatus(quantity, available) 
	{
		if (available > quantity)
		{
			this.expand_source = "assets/images/tick.png"
		}
		else if (available === '0' || available < quantity)
		{
			this.expand_source = "assets/images/cross.png"
		}
		else 
		{
			this.expand_source = "assets/images/warn.png"
		}
		return this.expand_source

	}

	expandClicked(element)
	{
		if (element.expanded == 'false')
		{
			element.expanded = 'true';
		}
		else
		{
			element.expanded = 'false';
		}
	}

	getIcon(expanded)
	{
		if (expanded == 'false')
		{
			return "assets/images/dropdown_closed.png"
		}
		else
		{
			return "assets/images/dropdown_open.png"
		}
	}

	statusChanged(element)
	{
		console.log("status hit");
		this.status.emit(element);
	}

	openDialog(imageUrl)
	{
		console.log(imageUrl, "in open dialog");
		const dialogRef = this.dialog.open(imageDialog, {
			// width: '250px',
			data: { src: imageUrl }
		});

		dialogRef.afterClosed().subscribe(result =>
		{
			console.log('The dialog was closed');
		});
	}
}
@Component({
	selector: 'app-table-component',
	templateUrl: 'image-dialog.html',
})
export class imageDialog
{

	constructor(
		public dialogRef: MatDialogRef<imageDialog>,
		@Inject(MAT_DIALOG_DATA) public data) { }

	onNoClick(): void
	{
		this.dialogRef.close();
	}
}
