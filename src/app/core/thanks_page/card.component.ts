import { Component, OnInit, Input } from '@angular/core';


@Component({
	selector: 'card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit
{
	@Input() count: any;
	@Input() info: any;
	@Input() colortype: any;
	@Input() heading: any;
	@Input() icon: any;
	@Input() imgHeight: any = '55px';
	@Input() hasImage: any;
	@Input() bigCard: any = false;


	constructor()
	{
		// Logs console.log(this.heading);

	}

	ngOnInit()
	{
	}
}
