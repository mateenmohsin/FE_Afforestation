import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, ApiService } from 'src/app/services';
import { GlobalFormComponent } from 'src/app/shared/global-form';
import { getSpecieFieldMsg } from '../../../shared/field-validation-messages';

@Component({
	selector: 'app-specie-add',
	templateUrl: './specie-add.component.html',
	styleUrls: ['/src/app/views/shared-style.scss']
})
export class SpecieAddComponent extends GlobalFormComponent implements OnInit
{
	// inventoryTypeChange = false;
	weightType1 = "kg";
	weightType2 = "kg";
	imageUrl = "assets/images/ic_gardeners@2x.png"
	label = "Species Image "
	customForm: FormGroup;
	editable = true
	nurseries: any;
	// inventoryType: any;
	quantityType = "";
	showInput = true;
	disableInput = false

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected alertService: AlertService,
		protected apiService: ApiService,
		protected formbuilder: FormBuilder)
	{

		super(router, _route, alertService, apiService, formbuilder);
		this.Form.addControl('id', new FormControl(null));
		this.Form.addControl('nameEn', new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(16)]));
		this.Form.addControl('nameUr', new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(16)]));
		this.Form.addControl('alternativeNameEn', new FormControl(null, [ Validators.minLength(4), Validators.maxLength(16)]));
		this.Form.addControl('alternativeNameUr', new FormControl(null, [ Validators.minLength(4), Validators.maxLength(16)]));
		this.Form.addControl('seedCountPerKg', new FormControl(null, [Validators.required,Validators.max(1000000), Validators.min(1)]));
		this.Form.addControl('benchmarkSuccessRatio', new FormControl('', [Validators.required, Validators.max(100), Validators.min(0)]));
		// this.Form.addControl('categoryEn', new FormControl('seed', [Validators.required]));
		this.Form.addControl('image', new FormControl(null, ));

		this.title = "Species";
		this.hasFile = true;

		this.getNurseries();
	}

	ngOnInit(): void
	{
		this.sub = this._route.params.subscribe(params =>
		{
			this.id = params['id'];

			this.showInput = params.type == "new" ? false : true;
			if (params.type == "Edit")
			{
				this.Form.controls['id'].disable()
			}
			if (this.id == 'add') 
			{
				this.formApi = "admin/add/specie";
			}
			else
			{
				this.formApi = 'admin/update/specie/' + this.id;
				this.detailApi = 'admin/find/specie/' + this.id;
				this.getDetail();
			}
		});
		super.ngOnInit();

	}

	getErrorMessage(field: any): any
    {
        return getSpecieFieldMsg[field];
    }

	quantityTypeChanged(value)
	{
		if (value == "seed")
		{
			this.quantityType = "Kg"
		}
		else
		{
			this.quantityType = ""
		}
	}

	afterDetail(): void
	{
		// if (this.inventoryType == 'consumable')
		// {
		this.Form.patchValue(this.formDetail);
		// }
		// else if (this.inventoryType == 'fixed')
		// {
		// 	this.customForm.patchValue(this.formDetail);
		// }
	}
}

