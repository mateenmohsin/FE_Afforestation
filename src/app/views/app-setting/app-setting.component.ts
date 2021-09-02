import { Component, OnInit } from '@angular/core';
import { ApiService, AlertService } from 'src/app/services';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-app-setting',
	templateUrl: './app-setting.component.html',
	styleUrls: ['/src/app/views/shared-style.scss'],
})
export class AppSettingComponent implements OnInit
{
	title = "App Settings"

	drashboardGraph: any;
	settings: any;
	Form: FormGroup;
	settingsOld: any;

	constructor(protected apiService: ApiService, protected alertService: AlertService, protected formbuilder: FormBuilder)
	{
		this.Form = this.formbuilder.group({
			contactNumber: [null, [Validators.required,Validators.minLength(11)]]
		});
	}

	ngOnInit(): void
	{
		this.getSettings();
	}

	getSettings(): void
	{
		let url = 'admin/fetch/settings';
		this.apiService.get(url).then(result =>
		{
			if (result.code === 200 && result.data) 
			{
				this.settings = result.data;
				this.settingsOld = result.data;
				this.Form.patchValue(this.settings);
			}
			else
			{
				this.settings = [];
				this.alertService.alertError(result.status, result.message);
			}
		});
	}

	goBack(): void
	{
		this.Form.patchValue(this.settingsOld);
	}
    
	getField(field: any): any
    {
        return this.Form.get(field).invalid;
        // return false;
    } 


	onSubmit()
	{
		this.apiService.put('admin/configure/setting', this.Form.value).then(result =>
		{
			if (result.code == 200)
			{
				this.alertService.alertError(result.status, result.message)
			}
			else
			{
				this.alertService.alertError(result.status, result.message)
			}
		})
	}
}
