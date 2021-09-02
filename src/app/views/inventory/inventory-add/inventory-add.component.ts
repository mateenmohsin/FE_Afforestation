import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, ApiService } from 'src/app/services';
import { GlobalFormComponent } from 'src/app/shared/global-form';
import { getInventoryFieldMsg } from '../../../shared/field-validation-messages';

@Component({
	selector: 'app-inventory-add',
	templateUrl: './inventory-add.component.html',
	styleUrls: ['/src/app/views/shared-style.scss'],
})
export class InventoryAddComponent extends GlobalFormComponent implements OnInit
{
	// inventoryTypeChange = false;
	weightType1 = "kg";
	weightType2 = "kg";

	label = "Species Image "
	customForm: FormGroup;
	editable = true
	nurseries: any;
	species: any;
	inventoryType: any;
	quantityType = "";
	alreadyAddedQuantity: any = 0;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected alertService: AlertService,
		protected apiService: ApiService,
		protected formbuilder: FormBuilder)
	{
		super(router, _route, alertService, apiService, formbuilder);

		this.getNurseries();
		this.getSpecies();
	}

	getErrorMessage(field: any): any
	{
		return getInventoryFieldMsg[field];
	}

	ngOnInit(): void
	{
		this.sub = this._route.params.subscribe(params =>
		{
			this.id = params['id'];
			this.type = params['type'];
			this.inventoryType = params['inventoryType'];

			if (this.inventoryType == 'consumable')
			{
				this.title = "Consumable Inventory";

				this.Form.addControl('id', new FormControl(null));
				this.Form.addControl('specieId', new FormControl(null, [Validators.required]));
				this.Form.addControl('nurseryId', new FormControl('1', [Validators.required]));
				this.Form.addControl('quantity', new FormControl(null, [Validators.required, Validators.max(1000000), Validators.min(1)]));
				this.Form.addControl('categoryEn', new FormControl('sapling', [Validators.required]));
			}
			else if (this.inventoryType == 'fixed')
			{
				this.title = "Fixed Inventory";

				this.Form.addControl('unit', new FormControl('kg', [Validators.required]));
				this.Form.addControl('nurseryId', new FormControl('1', [Validators.required]));
				this.Form.addControl('quantity', new FormControl(null, [Validators.required, Validators.max(1000000), Validators.min(1)]));
				this.Form.addControl('categoryEn', new FormControl(null, [Validators.required]));
			}

			if (this.type == 'View')
			{
				this.Form.disable();
				// this.customForm.disable();
			}
			console.log('fjdhfhdsjhfj')
			if (this.type == 'Edit') 
			{
				console.log('fjdhfhdsjhfj')
				if (this.inventoryType == 'consumable')
				{
					this.formApi = 'admin/update/consumable-inventory/' + this.id;

					this.Form.controls['id'].disable();
					this.Form.controls['specieId'].disable();
					this.Form.controls['nurseryId'].disable();
					this.Form.controls['categoryEn'].disable();
					this.Form.controls['quantity'].disable();
					this.Form.addControl('newQuantity', new FormControl(null, [Validators.required]));

					this.Form.valueChanges.subscribe(result =>
					{
						let quantity = this.Form.getRawValue().quantity;
						if (parseInt(result.newQuantity) > quantity)
						{
							this.Form.get('newQuantity').setErrors([Validators.required]);
						}
						else
						{
							this.Form.get('newQuantity').setErrors(null);
						}
					});
				}
			}

			if (this.id == 'add') 
			{
				if (this.inventoryType == 'consumable')
				{
					this.formApi = "admin/add/consumable-inventory";
				}
				else if (this.inventoryType == 'fixed')
				{
					this.formApi = "admin/add/fixed-inventory";
				}
			}
			else
			{
				this.detailApi = 'admin/find/inventory/' + this.id;
				this.getDetail();
			}
		});

		super.ngOnInit();
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
		this.alreadyAddedQuantity = this.formDetail.quantity;

		if (this.inventoryType == 'consumable')
		{
			this.Form.patchValue(this.formDetail);
			this.quantityType = (this.Form.get('categoryEn').value == 'seed') ? 'kg' : ''
		}
		else if (this.inventoryType == 'fixed')
		{
			this.Form.patchValue(this.formDetail);
		}
	}

	onSubmit(): void
	{
		if (this.Form.invalid)
		{
			this.alertService.alertError('WARNING', 'Please fill the required data.');
			return;
		}
		if (this.type == "Edit")
		{
			let formData = this.Form.getRawValue();
			formData.quantity = -1 * parseInt(formData.newQuantity);

			if (this.formValueChanged)
			{
				formData = this.otherForm;
				formData.quantity = -1 * parseInt(formData.newQuantity);
			}

			this.apiService.patch(this.formApi, formData, this.hasFile).then(response =>
			{
				if (response.code == 201 || response.code == 200)
				{
					this.alertService.alertSuccess(response.status, response.message).then(result =>
					{
						this.onLocationBack();
					});

					this.afterSuccessfullyAdd();
				}
				else
				{
					this.alertService.alertError(response.status, response.message);
				}
			})
		}
		else
		{
			super.onSubmit();
		}

	}
}
