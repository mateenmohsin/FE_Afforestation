import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService, AlertService } from 'src/app/services';
import * as Highcharts from 'highcharts';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit
{
	options = { 'Nursery 1': 'Product 1', 'Nursery 2': 'Product 2', 'Nursery 3': 'Product 3' }
	currentDate: Date = new Date();
	dataLoaded: boolean;
	drashboardKpi: any = {
		totalNurseries: 0,
		totalSpecies: 0,
		totalGardeners: 0,
		totalHeadGardeners: 0,
		totalSamplingApprovedRequests: 0,
		totalSamplingPendingRequests: 0,
		totalSamplingCancelledRequests: 0,
		totalSamplingRejectedRequests: 0,
	};

	filterArray: { label: string; type: string; key: string; selected: string; options: any[]; }[];
	drashboardGraph: any;
	columnChart: any = {
		chart: {
			type: 'column',
			// renderTo: 'chart',
			// margin: 0,
			// defaultSeriesType: 'areaspline'
		},
		credits: {
			enabled: false
		},
		title: {
			text: ''
		},
		xAxis: {
			categories: []
		},
		yAxis: {
			min: 0,
			title: {
				text: ''
			},
			stackLabels: {
				enabled: true,
				style: {
					fontWeight: 'bold',
					color: ( // theme
						Highcharts.defaultOptions.title.style &&
						Highcharts.defaultOptions.title.style.color
					) || 'gray'
				}
			}
		},
		legend: {
			align: 'right',
			x: -30,
			verticalAlign: 'top',
			y: 25,
			floating: true,
			backgroundColor:
				Highcharts.defaultOptions.legend.backgroundColor || 'white',
			borderColor: '#CCC',
			borderWidth: 1,
			shadow: false
		},
		tooltip: {
			headerFormat: '<b>{point.x}</b><br/>',
			pointFormat: '{series.name}: {point.y}'
		},
		plotOptions: {
			column: {
				// stacking: 'normal',
				dataLabels: {
					enabled: true
				},
				maxPointWidth: 20
			}
		},
		series: [{
			name: 'Inventory',
			color: '#8ABB2A',
			// borderRadiusTopLeft: 50,
			// borderRadiusTopRight: 50,
			dataLabels: {
				enabled: false
			},
			data: []
		}, {
			name: 'Demand',
			color: '#0D1E5C',
			dataLabels: {
				enabled: false
			},
			data: []
		}]
	}
	successRatio: any;
	successRatioClass: any = {
		seed: 0,
		cutting: 0
	};
	graphUrl: string;
	graphUrlCheck: string;


	constructor(protected apiService: ApiService, protected alertService: AlertService)
	{
		this.filterArray = [
			{
				label: 'Select Nursery', type: 'search', key: 'nurseryId', selected: 'All',
				options: []
			},
			{
				label: 'Search Species', type: 'search', key: 'specieId', selected: 'All',
				options: []
			}
		];

		this.graphUrl = 'admin/fetch/dashboard-graphs';
		this.graphUrlCheck = 'admin/fetch/dashboard-graphs';
	}

	ngOnInit(): void
	{
		this.getDashboardData();
		this.getDashboardGraphData('');
	}

	filnalFilters(event): void
	{
		let filterUrl = '';

		this.graphUrl = 'admin/fetch/dashboard-graphs';
		this.graphUrlCheck = 'admin/fetch/dashboard-graphs';

		if (event.filter.length > 0)
		{
			console.log(event);

			if (event.filter.length == 1)
			{
				if (event.filter[0].key == "specieId")
				{
					this.graphUrl = 'admin/fetch/v2/dashboard-graphs'
					this.graphUrlCheck = 'admin/fetch/v2/dashboard-graphs'
				}
				else
				{
					this.graphUrl = 'admin/fetch/dashboard-graphs';
					this.graphUrlCheck = 'admin/fetch/dashboard-graphs';
				}
			}
			
			if (event.filter.length > 1)
			{
				if (event.filter[1].key == "specieId")
				{
					this.graphUrl = 'admin/fetch/v2/dashboard-graphs';
					this.graphUrlCheck = 'admin/fetch/v2/dashboard-graphs';
				}
				else
				{
					this.graphUrl = 'admin/fetch/dashboard-graphs';
					this.graphUrlCheck = 'admin/fetch/dashboard-graphs';
				}
			}
			filterUrl = '?attributes=' + JSON.stringify(event.filter);
		}
		else if (event.filter.length == 0)
		{
			filterUrl = '?attributes=[]';
		}

		if (event.sort)
		{
			filterUrl = filterUrl + event.sort;
		}
		if (event.range)
		{
			filterUrl = filterUrl + event.range;
		}
		this.getDashboardGraphData(filterUrl)
		// {{baseUrl}}/fetch/dashboard-graphs?startDateTime=1612137600&endDateTime=1612396799
	}

	getDashboardData(): void
	{
		// this.dataLoaded = false;
		let url = 'admin/fetch/dashboard-kpis';
		this.apiService.get(url).then(result =>
		{
			if (result.code === 200 && result.data) 
			{
				this.drashboardKpi = result.data;

				// this.dataLoaded = true;
			}
			else
			{
				// this.dataLoaded = true;
				this.drashboardKpi = [];
				this.alertService.alertError(result.status, result.message);
			}
		});
	}

	getDashboardGraphData(filter): void
	{
		this.columnChart.series[0].data = [];
		this.columnChart.series[1].data = [];
		this.columnChart.xAxis.categories = [];

		this.dataLoaded = false;

		if (filter)
		{
			this.graphUrl = this.graphUrl + filter;
		}
		this.apiService.get(this.graphUrl).then(result =>
		{
			if (result.code === 200 && result.data) 
			{
				this.drashboardGraph = result.data;
				this.successRatio = result.data.sucessRatio;

				this.successRatioClass.seed = Math.round(result.data.sucessRatio.seed).toString();
				this.successRatioClass.cutting = Math.round(result.data.sucessRatio.cutting).toString();

				this.drashboardGraph.demandQuantityRatio.forEach(element =>
				{
					if (element.inventory == 0 && element.demand == 0)
					{
						console.log('Both 0', element.inventory, element.demand)
					}
					else
					{
						this.columnChart.series[0].data.push(element.inventory);
						this.columnChart.series[1].data.push(element.demand);

						if(this.graphUrlCheck == 'admin/fetch/v2/dashboard-graphs')
						{
							this.columnChart.xAxis.categories.push(element.nurseryNameEn);
						}
						else
						{
							this.columnChart.xAxis.categories.push(element.nameEn);
						}
					}
				});

				console.log(this.columnChart);

				this.dataLoaded = true;
			}
			else
			{
				this.dataLoaded = true;
				this.drashboardGraph = [];
				this.alertService.alertError(result.status, result.message);
			}
		});
	}

	onDateRange(event): void
	{
		if (event == 'removed')
		{
			this.getDashboardGraphData('');
		}
		else
		{
			this.getDashboardGraphData(event)
		}
	}

}
