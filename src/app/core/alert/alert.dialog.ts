import { OnInit, Component } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";

// import { MainService } from "../services/main.service";

export class AlertData
{
	heading: string = '';
	message: string = '';
	hasInput: boolean = false;
	type: 'ask' | 'success' | 'error' | 'info';
	leftButton: {
		text: string;
		class: string
	};
	rightButton: {
		text: string;
		class: string
	};
}

@Component({
	selector: 'alert-dialog',
	templateUrl: './alert.dialog.html'
})
export class AlertDialog implements OnInit 
{
	isLoading: boolean;
	hasInput: boolean = false;
	reasonTExt = ""
	// heading: string = '';
	// message: string = '';
	// type: 'ask' | 'success' | 'error' | 'info';
	// cancelButtonText: string;
	// submitButtonText: string;
	dataToSubmit: any;
	methodName: any;
	showLoading: boolean;

	alertData: AlertData;

	constructor( // protected mainApiService: MainService, 
		protected dialogRef: MatDialogRef<AlertDialog>, protected dialog: MatDialog) 
	{
		this.isLoading = false;
		this.showLoading = false;
		// this.hasInput=true;

		this.alertData = {
			heading: 'Data',
			message: '',
			type: 'ask',
			hasInput: false,
			leftButton: {
				text: 'No',
				class: 'Yes'
			},
			rightButton: {
				text: 'No',
				class: 'Yes'
			},
		}
	}

	ngOnInit() 
	{
	}

	onCancelClick(): void
	{
		this.dialogRef.close(false);
	}

	onSubmitClick(): void
	{
		// this.dialogRef.close(true);
		this.isLoading = true;

		// this.mainApiService.postData(this.methodName, this.dataToSubmit)
		// .then(result => {
		// 	if (result.status === 200 || result.status === 201)
		// 	{
		// this.gerOrdersList(this.currentPage);
		if (this.alertData.hasInput == true)
		{
			let data = this.reasonTExt
		       this.dialogRef.close(data);
		}
		else
		{
			this.dialogRef.close(true);
		     }



		// 		this.isLoading = false;
		// 	}
		// 	else 
		// 	{
		// 		this.isLoading = false;
		// 		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		// 		let cm = dialogRef.componentInstance;
		// 		cm.heading = 'Error';
		// 		cm.message = 'Internal Server Error';
		// 		cm.cancelButtonText = 'Ok';
		// 		cm.type = 'error';
		// 	}
		// });
	}
}
