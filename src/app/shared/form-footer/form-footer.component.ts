import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-form-footer',
	templateUrl: './form-footer.component.html'
})
export class FormFooterComponent implements OnInit
{
	activated = true;
	@Input() save: any = 'Save';
	@Input() cancel: any = 'Cancel';

	constructor() { }

	ngOnInit(): void
	{
		console.log(this.save)
		if (this.save == "View")
		{
			this.activated = false;
			this.cancel = "Back"
		}
	}

	goBack()
	{
		window.history.back();
	}
}
