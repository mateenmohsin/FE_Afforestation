import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, ApiService } from 'src/app/services';
import { GlobalFormComponent } from 'src/app/shared/global-form';
import { getNurseryFieldMsg } from '../../../shared/field-validation-messages';

@Component({
	selector: 'app-nursery-add',
	templateUrl: './nursery-add.component.html',
	styleUrls: ['/src/app/views/shared-style.scss'],
})
export class NurseryAddComponent extends GlobalFormComponent implements OnInit
{

	title = "Nursery"
	headGardeners: any[];
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected alertService: AlertService,
		protected apiService: ApiService,
		protected formbuilder: FormBuilder)
	{

		super(router, _route, alertService, apiService, formbuilder);
		// Logs console.log('this');
		this.Form.addControl('nameEn', new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(42)]));
		this.Form.addControl('nameUr', new FormControl(null, [Validators.required]));
		this.Form.addControl('address', new FormControl(null, [Validators.required]));
		this.Form.addControl('coveredArea', new FormControl(null, [Validators.minLength(2), Validators.maxLength(6)]));
		this.Form.addControl('capacity', new FormControl(null, [Validators.minLength(2), Validators.maxLength(7)]));
		// this.Form.addControl('gardenerId', new FormControl(null, [Validators.required]));
		this.Form.addControl('status', new FormControl(true, [Validators.required]));
		// this.type = this.router.getCurrentNavigation().extras?.state.type;
		// this.checkType()
	}

	ngOnInit()
	{
		this.sub = this._route.params.subscribe(params =>
		{
			this.id = params['id'];

			if (this.id == 'add') 
			{
				this.formApi = "admin/add/nursery";
			}
			else
			{
				this.formApi = 'admin/update/nursery/' + this.id;
				this.detailApi = 'admin/find/nursery/' + this.id;
				this.getDetail();
			}
		});
		this.getHeadGardeners();
		super.ngOnInit();
	}
    
	getErrorMessage(field: any): any
    {
        return getNurseryFieldMsg[field];
    }

	getHeadGardeners(): void
	{
		this.apiService.get('admin/fetch/gardeners?attributes=[{"key": "role", "value": "headGardener"}]').then(res =>
		{
			if (res.code == 200)
			{
				this.headGardeners = res.data.listing;
			}
			else
			{
				this.headGardeners = [];
			}
		})
	}
}
