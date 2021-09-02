import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, AlertService } from 'src/app/services';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['../auth-app-login.component.scss']
})
export class LoginComponent implements OnInit
{
	formControl = new FormControl('', [
		Validators.required
		// Validators.email,
	]);
	forgotPassword: Boolean = false;
	gotCode: Boolean = false;
	buttonLabel: String = "Login";
	boldTExt: String = "Welcome To";
	bolderText: String = "Afforestation Portal";
	lighterText: String = "This is a secure website"
	iconClass: String = "lockIcon"
	emailIcon: String = "assets/images/ic_email.png"

	lighterText2: String = "Please enter your email and password to login";
	Form: FormGroup;


	constructor(protected alertService: AlertService, protected router: Router, protected formbuilder: FormBuilder, protected apiService: ApiService, protected alert: AlertService)
	{
		this.Form = this.formbuilder.group({
			email: [null, [Validators.required]],
			password: [null, [Validators.required]]
		});
	}

	ngOnInit(): void
	{

	}

	onClickForgot()
	{
		this.router.navigateByUrl('/auth/forgot');
	}

	onSubmit()
	{
		if (this.Form.invalid)
        {
            this.alertService.alertError('WARNING', 'Please fill the required data.');
            return;
        }
		this.apiService.auth('admin/login', this.Form.value).then(result =>
		{
			if (result.code == 200)
			{
				// Logs console.log(result);
				localStorage.setItem('email', this.Form.get('email').value);
				this.router.navigateByUrl('auth/otp');
			}
			else if (result.code == 401)
			{
				this.alert.alertError(result.status, 'Unauthorized user, Invalid Credentials.')
			}
			else
			{
				this.alert.alertError(result.status, result.message)
			}
		})
	}
}
