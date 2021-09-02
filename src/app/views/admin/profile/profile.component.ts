import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { getProfileFieldMsg } from '../../../shared/field-validation-messages';
import { GlobalFormComponent } from 'src/app/shared/global-form';
import { AlertService, ApiService } from 'src/app/services';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['/src/app/views/shared-style.scss'],
})
export class ProfileComponent extends GlobalFormComponent implements OnInit
{
	title = "Profile"
	imageUrl = "assets/images/ic_gardeners@2x.png"
	label = "Photo "
	admin: any;

	customForm: FormGroup;
	isChangingPassword: any = false;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected alertService: AlertService,
		protected apiService: ApiService,
		protected formbuilder: FormBuilder)
	{

		super(router, _route, alertService, apiService, formbuilder);
		// Logs console.log('this');
		// this.Form.addControl('name', new FormControl(null, [Validators.required]));
		// this.Form.addControl('email', new FormControl(null, [Validators.required, Validators.email]));
		// this.Form.addControl('status', new FormControl(true, [Validators.required]));
		// this.Form.addControl('role', new FormControl('admin', [Validators.required]));

		this.customForm = this.formbuilder.group({
			name: null,
			email: null,
			status: null,
			role: null,
		});

		// this.Form = this.formbuilder.group({
		// 	email: [null, [Validators.required, Validators.email]],
		// 	newPassword: [null, [Validators.minLength(6), Validators.maxLength(14)]],
		// 	currentPassword: [null, [Validators.minLength(6), Validators.maxLength(14)]],
		// 	confirmPassword: [null, [Validators.minLength(6), Validators.maxLength(14)]],
		// }, { 
		// 	validator: ConfirmedValidator('currentPassword', 'confirmPassword')
		//   });

		this.Form.addControl('email', new FormControl(null, [Validators.required, Validators.email]));
		this.Form.addControl('newPassword', new FormControl(null, [Validators.minLength(6), Validators.maxLength(14)]));
		this.Form.addControl('currentPassword', new FormControl(null, [Validators.minLength(6), Validators.maxLength(14)]));
		this.Form.addControl('confirmPassword', new FormControl(null, [Validators.required]));

		this.onlyImage = true;

		this.Form.valueChanges.subscribe(result =>
		{
			if(result.confirmPassword != result.newPassword)
			{
				this.Form.get('confirmPassword').setErrors(Validators.required);
			}
		});
	}

	ngOnInit(): void
	{
		this.customForm.disable();
		this.admin = JSON.parse(localStorage.getItem('greenerUser'));
		console.log(this.admin);

		this.formApi = 'admin/update-password';

		this.detailApi = 'admin/find/admin/' + this.admin.user.id;
		this.getDetail();

		super.ngOnInit();
	}

	afterDetail(): void
	{
		this.customForm.patchValue(this.formDetail);

		if(this.formDetail.role == 'admin')
		{
			this.customForm.get('role').setValue('Admin');
		}
		else
		{
			this.customForm.get('role').setValue('Super Admin');
		}
	}

	onChangePassword(): void
	{
		this.isChangingPassword = !this.isChangingPassword;
	}

	onCancel(): void
	{
		this.isChangingPassword = false;
	}

	getErrorMessage(field: any): any
	{
		return getProfileFieldMsg[field];
	}

	onSubmit(): void
	{
		if (this.Form.invalid)
		{
			this.alertService.alertError('WARNING', 'Please fill the required data.');
			return;
		}

		if (this.Form.get('newPassword').value != this.Form.get('confirmPassword').value)
		{
			this.alertService.alertError('WARNING', 'New password and Confirm password must be match.');
			return;
		}

		let formData = this.Form.value;

		this.apiService.post(this.formApi, formData, this.hasFile).then(response =>
		{
			if (response.code == 201 || response.code == 200)
			{
				this.alertService.alertSuccess(response.status, response.message);
				this.isChangingPassword = false;
				this.Form.reset();
				this.Form.get('email').setValue(this.customForm.get('email').value);
			}
			else
			{
				this.alertService.alertError(response.status, response.message);
			}
		})
	}
}


// export function ConfirmedValidator(controlName: string, matchingControlName: string)
// {
// 	return (formGroup: FormGroup) =>
// 	{
// 		const control = formGroup.controls[controlName];
// 		const matchingControl = formGroup.controls[matchingControlName];
// 		if (matchingControl.errors && !matchingControl.errors.confirmedValidator)
// 		{
// 			return;
// 		}
// 		if (control.value !== matchingControl.value)
// 		{
// 			matchingControl.setErrors({ confirmedValidator: true });
// 		} else
// 		{
// 			matchingControl.setErrors(null);
// 		}
// 	}
// }
