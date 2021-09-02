import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, ApiService } from 'src/app/services';
import { GlobalFormComponent } from 'src/app/shared/global-form';
import { getHeadGardenerFieldMsg } from '../../../shared/field-validation-messages';

@Component({
	selector: 'app-edit-head-garnder',
	templateUrl: './edit-head-garnder.component.html',
	styleUrls: ['/src/app/views/shared-style.scss'],
})
export class EditHeadGarnderComponent extends GlobalFormComponent implements OnInit
{
	title = "Head Gardener"
	nurseries: any;
	imageUrl = "assets/images/ic_gardeners@2x.png"
	label = "Photo "
	checkBoxes: any[] = [
		{ day: 'Monday', checked: false, fullDay: 'Monday,' },
		{ day: 'Tuesday', checked: false, fullDay: 'Tuesday,' },
		{ day: 'Wednesday', checked: false, fullDay: 'Wednesday,' },
		{ day: 'Thursday', checked: false, fullDay: 'Thursday,' },
		{ day: 'Friday', checked: false, fullDay: 'Friday,' },
		{ day: 'Saturday', checked: false, fullDay: 'Saturday,' },
		{ day: 'Sunday', checked: false, fullDay: 'Sunday' },
	];
	nurseriesTwo: any[] = [];
	checkBoxDisabled = false;
	allDays: any;
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected alertService: AlertService,
		protected apiService: ApiService,
		protected formbuilder: FormBuilder)
	{

		super(router, _route, alertService, apiService, formbuilder);
		// Logs console.log('this');
		this.Form.addControl('nameEn', new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]));
		this.Form.addControl('nameUr', new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]));
		this.Form.addControl('dateOfBirth', new FormControl(null, [Validators.required]));
		this.Form.addControl('identityNumber', new FormControl(null, [Validators.required]));
		this.Form.addControl('nurseryId', new FormControl(null, [Validators.required]));
		this.Form.addControl('role', new FormControl('headGardener', [Validators.required,]));
		this.Form.addControl('contactNumber', new FormControl(null, [Validators.required, Validators.minLength(11)]));
		this.Form.addControl('address', new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(60)]));
		this.Form.addControl('workSchedule', new FormControl(null, [Validators.required]));
		this.Form.addControl('profilePicture', new FormControl(null, [Validators.required]));
		this.Form.addControl('status', new FormControl(true, [Validators.required]));
		this.Form.addControl('loginPin', new FormControl(null, [Validators.required]));

		this.Form.addControl('currentNursery', new FormControl(null));

		// this.type = this.router.getCurrentNavigation().extras?.state.type;
		// this.checkType()
		this.hasFile = true;
		// this.nurseries = JSON.parse(localStorage.getItem('nurseries'));

		// ;
		this.getNurseries('&type=free');
		this.getNurseriesTwo();

	}

	getErrorMessage(field: any): any
	{
		return getHeadGardenerFieldMsg[field];
	}

	afterDetail(): void
	{
		this.Form.get('dateOfBirth').setValue(new Date(this.formDetail.dateOfBirth * 1000));
		this.Form.get('currentNursery').setValue(this.formDetail.nurseryId);
		this.getWorkSchedule(this.formDetail.workSchedule)
	}
	getWorkSchedule(schedule)
	{	//console.log(schedule)
		for (let index = 0; index < this.checkBoxes.length; index++)
		{
			//console.log(this.checkBoxes[index])
			schedule.forEach(element =>
			{
				// console.log(element,this.checkBoxes[index].fullDay)
				if (this.checkBoxes[index].fullDay == element + ",")
				{    //console.log("yes matched",element)
					this.checkBoxes[index].checked = true;
				}

			});

		}


	}
	ngOnInit(): void
	{
		this.sub = this._route.params.subscribe(params =>
		{
			this.id = params['id'];
			if (params.type == "View")
			{
				this.checkBoxDisabled = true

			}
			if (this.id == 'add') 
			{
				this.formApi = "admin/add/gardener";

			}
			else
			{
				this.formApi = 'admin/update/gardener/' + this.id;
				this.detailApi = 'admin/find/gardener/' + this.id;
				this.getDetail();
				this.Form.get('currentNursery').disable();
				// this.getNurseries();
			}
		});
		super.ngOnInit();
	}

	getNurseriesTwo(): any
	{
		let data = [];
		let url = 'admin/fetch/nurseries?fetchType=dropdown';
		this.apiService.get(url).then(res =>
		{
			if (res.code == 200)
			{
				res.data.forEach(element =>
				{
					let dict = {
						key: 'nurseryId',
						value: element.id,
						label: element.nameEn,
					}
					data.push(dict);
				});

				this.nurseriesTwo = data;
			}
			else
			{
				this.nurseriesTwo = [];
			}
		});
	}

	onAllDay(): void
	{
		let check = '';
		if (this.allDays)
		{
			for (let index = 0; index < this.checkBoxes.length; index++)
			{
				this.checkBoxes[index].checked = true;
				check += this.checkBoxes[index].fullDay;
			}

			this.Form.get('workSchedule').setValue(check);
		}
		else
		{
			for (let index = 0; index < this.checkBoxes.length; index++)
			{
				this.checkBoxes[index].checked = false;
			}

			this.Form.get('workSchedule').setValue(null);
		}
	}

	onCheckBox(checkbox): void
	{
		console.log(checkbox);
		if (!checkbox.checked)
		{
			this.allDays = false;
		}
		let check = '';
		for (let index = 0; index < this.checkBoxes.length; index++)
		{
			if (this.checkBoxes[index].checked)
			{
				check += this.checkBoxes[index].fullDay;
			}
			this.Form.get('workSchedule').setValue(check);

		}

		this.Form.get('workSchedule').setValue(check);
	}

	onNurseryChange(value): void
	{
		this.Form.get('nurseryId').setValue(value);
		console.log("the value is ", this.Form.get('nurseryId'))
	}

	onSubmit(): void
	{
		if (this.Form.get('profilePicture').invalid)
		{
			this.alertService.alertError('WARNING', 'Head Gardener Photo is required.');
			return;
		}

		if (this.Form.get('workSchedule').invalid)
		{
			this.alertService.alertError('WARNING', 'Work schedule is required.');
			return;
		}

		super.onSubmit();
	}

}
