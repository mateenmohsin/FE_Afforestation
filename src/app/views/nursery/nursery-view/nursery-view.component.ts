import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ApiService, AlertService } from 'src/app/services';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-nursery-view',
	templateUrl: './nursery-view.component.html',
	styleUrls: ['./nursery-view.component.scss']
})
export class NurseryViewComponent implements OnInit
{
	dataLoaded: boolean;
	nurseryKpi: any = {
		totalSamplingApprovedRequests: 0,
		totalSamplingCancelledRequests: 0,
		totalSamplingPendingRequests: 0,
		totalSamplingRejectedRequests: 0,
		totalSamplingRequests: 0,
		totalSpecies: 0,
	};

	nurseryId: any;
	sub: Subscription;
	nurseryData: any = {
		nameEn: 'Loading...',
		nameUr: 'Loading...',
		coveredArea: 'Loading...',
		capacity: 'Loading...',
		headGardener: {
			nameEn: 'Loading...'
		},
		address: 'Loading...',
	};

	constructor(protected apiService: ApiService, protected alertService: AlertService, protected _route: ActivatedRoute)
	{

	}

	ngOnInit(): void
	{
		this.sub = this._route.params.subscribe(params =>
		{
			this.nurseryId = params['id'];
		});

		this.getNurseryData();
		this.getNurseryKpis(this.nurseryId);
	}

	getNurseryData(): void
	{
		let url = 'admin/find/nursery/' + this.nurseryId;
		this.apiService.get(url).then(result =>
		{
			if (result.code === 200 && result.data) 
			{
				this.nurseryData = result.data;
			}
			else
			{
				this.nurseryData = null;
				this.alertService.alertError(result.status, result.message);
			}
		});
	}

	filnalFilters(event): void
	{
		let filterUrl = '?';

		if (event.range)
		{
			filterUrl = filterUrl + event.range;
		}

		this.getNurseryKpis(this.nurseryId)
	}

	getNurseryKpis(nurseryId): void
	{
		this.dataLoaded = false;
		let url = 'admin/fetch/nursery/' + nurseryId + '/kpis';

		// if (filter)
		// {
		// 	url = url + filter;
		// }

		this.apiService.get(url).then(result =>
		{
			if (result.code === 200 && result.data) 
			{
				this.nurseryKpi = result.data;
				this.dataLoaded = true;
			}
			else
			{
				this.nurseryKpi = {
					totalSamplingApprovedRequests: 0,
					totalSamplingCancelledRequests: 0,
					totalSamplingPendingRequests: 0,
					totalSamplingRejectedRequests: 0,
					totalSamplingRequests: 0,
					totalSpecies: 0,
				};
				this.dataLoaded = true;
				this.alertService.alertError(result.status, result.message);
			}
		});
	}
}
