import { OnInit, Component } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { AlertService } from 'src/app/services';

// import { MainService } from "../services/main.service";

export class AlertData
{
	heading: string = '';
	message: string = '';
	hasInput: boolean = false;
	dataToSubmit: any;
	inputEditable: boolean = false
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
	selector: 'app-sapling-alert',
	templateUrl: './sapling-alert.component.html',
	styleUrls: ['./sapling-alert.component.scss'],

})
export class SaplingAlertComponent implements OnInit
{
	isLoading: boolean;
	hasInput: boolean = false;
	reasonTExt = ""
	dataToSubmit: any;
	methodName: any;
	showLoading: boolean;
	nonEditable = true;
	pinCode = ""
	alertData: AlertData;

	constructor( // protected mainApiService: MainService, 
		protected alertService: AlertService,	protected dialogRef: MatDialogRef<SaplingAlertComponent>, protected dialog: MatDialog) 
	{
		this.isLoading = false;
		this.showLoading = false;
		this.hasInput = true;

		this.alertData = {
			heading: 'Data',
			message: '',
			type: 'ask',
			hasInput: false,
			inputEditable: false,
			dataToSubmit: '',
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
		console.log(this.alertData.dataToSubmit, "i got this data ")
		this.pinCode = this.alertData.dataToSubmit?.saplingType == "individuals" ? " (" + this.alertData.dataToSubmit?.customerPin + ")" : "";
	}

	onCancelClick(): void
	{
		this.dialogRef.close(false);
	}

	onSubmitClick(): void
	{
		this.isLoading = true;
		if (this.hasInput = true)
		{
			if(this.reasonTExt=="")
			 {
				 this.reasonTExt=" "
			 }
			 // ======> !alertdata.inputEditable=="partially approve"<=======
			if(this.allZero() && !this.alertData.inputEditable)
			{   
				// console.log("Errorrrr");
				this.alertService.alertError('Warning', "Partially approved quantity must not be zero");
			}
			else 
			{
               
				let data = this.reasonTExt
			    this.dialogRef.close(data);
				// this.alertService.alertError('approved','congrats')
			}
		}
		else
		{
			this.dialogRef.close(true);
		}
	}

	allZero()
	
	{     var allZero=true
		
		this.alertData.dataToSubmit.samplingRequestItems.forEach(element => {
    
		console.log(element.quantityGiven,"quantity approved is",element)
		if (element.quantityGiven>0)
		{   allZero=false;
			return false;
		}
	
	});
		return allZero;
	}

	onApprovedKey(approved: any, requested, available)
	{
		// console.log(approved, requested, "values")
		if (approved > requested || approved > available)
		{
			// console.log("approved is greater")
			approved = 0
		}
		else 
		{
			return approved
		}
	}
}
