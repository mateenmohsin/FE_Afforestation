import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, ApiService } from 'src/app/services';
import { GlobalFormComponent } from 'src/app/shared/global-form';
import { getAdminFieldMsg } from '../../../shared/field-validation-messages';

@Component({
	selector: 'app-admin-add',
	templateUrl: './admin-add.component.html',
	styleUrls: ['/src/app/views/shared-style.scss'],
})
export class AdminAddComponent extends GlobalFormComponent implements OnInit
{
	title = "Admin"
	imageUrl = "assets/images/ic_gardeners@2x.png"
	label = "Photo "
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected alertService: AlertService,
		protected apiService: ApiService,
		protected formbuilder: FormBuilder)
	{

		super(router, _route, alertService, apiService, formbuilder);
		// Logs console.log('this');
		this.Form.addControl('name', new FormControl(null, [Validators.required]));
		this.Form.addControl('email', new FormControl(null, [Validators.required,Validators.email]));
		this.Form.addControl('status', new FormControl(true, [Validators.required]));
		this.Form.addControl('role', new FormControl('admin', [Validators.required]));
		this.Form.addControl('password', new FormControl(null,[Validators.minLength(6),Validators.maxLength(14)]));
		this.Form.addControl('profilePicture', new FormControl(null));

		// this.type = this.router.getCurrentNavigation().extras?.state.type;
		// this.checkType()
		this.hasFile = true;

	}
	ngOnInit(): void
	{
		this.sub = this._route.params.subscribe(params =>
		{
			this.id = params['id'];

			if (this.id == 'add') 
			{
				this.formApi = "admin/add/admin";
				this.Form.get('password').setValidators(Validators.required);
			}
			else if (this.id == 'detail') 
			{

			}
			else
			{
				this.formApi = 'admin/update/admin/' + this.id;
				this.detailApi = 'admin/find/admin/' + this.id;
				this.getDetail();
			}
		});
		super.ngOnInit();
	}
	
	getErrorMessage(field: any): any
    {
        return getAdminFieldMsg[field];
    }


}
