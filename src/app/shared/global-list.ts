import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, ApiService } from '../services';

import * as moment from 'moment';

export class TableFiltersOptions
{
    label: string;
    value: any;
    key: string;
}

export class TableFilters
{
    label: string;
    type: string;
    key: string;
    selected: any;
    options: TableFiltersOptions[]
}

@Component({
    selector: 'app-global-list',
    template: ``
})
export class GlobalListComponent implements OnInit
{
    dataItems: any[] = [];

    pagination: any;
    page: any = 1;
    perPage: any = 10;
    filterUrl: any;


    deleteApi: string;
    listApi: string;

    detailUrl: string;
    createUrl: string;
    updateUrl = '';

    section: string;
    deleteItems: any;
    filterArray: TableFilters[] = [];
    nurseries: any;
    paginationUrl: string;
    greenerUser: any;

    constructor(protected router: Router, protected apiService: ApiService, protected alertService: AlertService)	
    {
        this.dataItems = [];

        this.nurseries = JSON.parse(localStorage.getItem('nurseries'));

        this.filterArray = [
            {
                label: 'Select Nursery', type: 'search', key: 'nurseryId', selected: 'All',
                options: []
            },
            {
                label: 'Sort by Name', type: 'sort', key: 'name', selected: 'All',
                options: [
                    { key: 'All', value: 'All', label: 'All' },
                    { key: 'ASC', value: 'ASC', label: 'ASC' },
                    { key: 'DESC', value: 'DESC', label: 'DESC' }
                ]
            },
            {
                label: 'Filter by Status', type: 'filter', key: 'status', selected: 'All',
                options: [
                    { key: 'All', value: 'All', label: 'All' },
                    { key: 'status', value: true, label: 'Active' },
                    { key: 'status', value: false, label: 'Inactive' }
                ]
            },
        ]

        this.greenerUser = JSON.parse(localStorage.getItem('greenerUser'));
        console.log(this.greenerUser);
        this.getNurseriesNew();
        this.getGardenersNew();
        this.getSpeciesNew();
    }

    ngOnInit() 
    {
        // this.getNurseries();
    }

    onCreate(): void
    {
        this.router.navigateByUrl(this.createUrl);
    }

    getNurseriesNew(): any
    {
        let data = [{ key: 'All', value: 'All', label: 'All' }];
        this.apiService.get('admin/fetch/nurseries?fetchType=dropdown').then(res =>
        {
            if (res.code == 200)
            {
                res.data.forEach(element =>
                {
                    let dict = {
                        key: 'nurseryId',
                        value: element.id,
                        label: element.nameEn,
                    }
                    data.push(dict);
                });

                localStorage.setItem('nurseries', JSON.stringify(data));
            }
            else
            {
                localStorage.setItem('nurseries', JSON.stringify(data));
            }
        });
    }
    getGardenersNew(): any
    {
        let data = [{ key: 'All', value: 'All', label: 'All' }];
        this.apiService.get('admin/fetch/gardeners?fetchType=dropdown').then(res =>
        {
            if (res.code == 200)
            {
                res.data.forEach(element =>
                {
                    let dict = {
                        key: 'gardenerId',
                        value: element.id,
                        label: element.nameEn,
                    }
                    data.push(dict);
                });

                localStorage.setItem('gardeners', JSON.stringify(data));
            }
            else
            {
                localStorage.setItem('gardeners', JSON.stringify(data));
            }
        });
    }

    getSpeciesNew(): any
    {
        let data = [{ key: 'All', value: 'All', label: 'All' }];
        this.apiService.get('admin/fetch/species?fetchType=dropdown').then(res =>
        {
            if (res.code == 200)
            {
                res.data.forEach(element =>
                {
                    let dict = {
                        key: 'nurseryId',
                        value: element.id,
                        label: element.nameEn,
                    }
                    data.push(dict);
                });

                localStorage.setItem('species', JSON.stringify(data));
            }
            else
            {
                localStorage.setItem('species', JSON.stringify(data));
            }
        });
    }

    // getNurseries(): any
    // {
    //     
    //     this.apiService.get('admin/fetch/nurseries?fetchType=dropdown').then(res =>
    //     {
    //         if (res.code == 200)
    //         {
    //             res.data.forEach(element =>
    //             {
    //                 let dict = {
    //                     key: 'nurseryId',
    //                     label: element.nameEn,
    //                     value: element.id
    //                 }
    //                 data.push(dict);
    //             });

    //             this.filterArray[0].options = data;

    //             // return data;
    //         }
    //         else
    //         {
    //             // return [];
    //         }
    //     });

    //     // Logs console.log(this.filterArray);
    //     // return data;
    // }

    onSuperDetail(): void
    {
        this.router.navigateByUrl(this.detailUrl);
    }

    onDateRange(event): void
    {
        if (event == 'removed')
        {
            // this.getDashboardGraphData('');
        }
        else
        {
            // this.getDashboardGraphData(event)
        }
    }

    onPagination(event): void
    {
        console.log('onPagination', event);
        this.paginationUrl = '&page=' + event.page;
        this.page = event.page

        this.getList(this.filterUrl);
    }

    filnalFilters(event): void
    {
        let filterUrl = '';

        if (event.filter.length > 0)
        {
            filterUrl = '&attributes=' + JSON.stringify(event.filter);
        }
        else if (event.filter.length == 0)
        {
            filterUrl = '&attributes=[]';
        }

        if (event.sort)
        {
            filterUrl = filterUrl + event.sort;
        }
        if (event.range)
        {
            filterUrl = filterUrl + event.range;
        }
        if (event.search)
        {
            filterUrl = filterUrl + event.search;
        }

        if (event.date)
        {
            filterUrl = filterUrl + event.date;
        }

        this.getList(filterUrl)
    }

    getList(filterUrl?: any): void
    {
        let url = this.listApi;
        this.filterUrl = '';

        if (filterUrl)
        {
            url = url + filterUrl;
            this.filterUrl = filterUrl;
        }

        if (this.paginationUrl)
        {
            url = url + this.paginationUrl;
        }

        this.apiService.get(url).then(result =>
        {
            if (result.code === 200) 
            {
                if (result.data.hasOwnProperty('listing'))
                {
                    this.dataItems = result.data.listing;
                }
                else
                {
                    this.dataItems = result.data;
                }

                this.dataItems.forEach((element, index) =>
                {
                    let date = element.createdTime;
                    if (date)
                    {
                        element['dateTime'] = moment(date * 1000).format('MM/DD/YYYY HH:mm');
                    }
                    else
                    {
                        element['dateTime'] = moment().format('MM/DD/YYYY HH:mm');
                    }

                    let date2 = element.updatedTime;
                    if (date2)
                    {
                        element['updateTime'] = moment(date * 1000).format('MM/DD/YYYY HH:mm');
                    }
                    else
                    {
                        element['updateTime'] = moment().format('MM/DD/YYYY HH:mm');
                    }

                    if (this.page == 1)
                    {
                        element['serialNumber'] = index + 1;

                    }
                    else 
                    {
                        element['serialNumber'] = 10 * (this.page - 1) + index + 1;

                    }


                });

                this.pagination = result.data.pagination;
                console.log("i got ", this.dataItems)
                this.afterListResponse();
            }
            else
            {
                this.dataItems = [];
                this.alertService.alertError(result.status, result.message);
            }
        });
    }

    afterListResponse(): void
    {
        console.log("i got ", this.dataItems)
    }

    checkAdult(element)
    {
        return element.delete == true;
    }
    onUpdate(data)
    {

        this.apiService.patch(this.updateUrl, data).then(response =>
        {
            if (response.code == 201 || response.code == 200)
            {
                this.alertService.alertSuccess(response.status, response.message);
                this.getList(this.filterUrl);

            }
            else
            {
                this.alertService.alertError(response.status, response.message);
            }
        })


    }
    statusChanged(event, type)
    {
        console.log("status has changed", type, event.status, event.id)
        this.updateUrl = 'admin/update/' + type + '-status/';
        this.updateUrl = this.updateUrl + event.id;
        var dataTosend = { status: event.status };
        console.log(this.updateUrl, dataTosend)
        this.onUpdate(dataTosend)
    }
    processSamplingReq(event)
    {
        console.log("in processing", samplingRequestData)
        var items = []
        var samplingRequestData = {}
        var id = event.row.id
        event.row.samplingRequestItems.forEach(element =>
        {
            let obj = {};
            obj["id"] = element.id;
            obj["quantity"] = element.quantityGiven;
            console.log(obj)
            items.push(obj);
        });
        samplingRequestData["processingStatusEn"] = event.status
        samplingRequestData["items"] = items
        samplingRequestData["reasonEn"] = event.reason
        console.log("going to fetch", samplingRequestData)
        this.fetchSaplingReq(id, samplingRequestData)

    }
    fetchSaplingReq(id, dataTosend)
    {
        this.updateUrl = 'admin/process/sampling-request/'
        this.updateUrl = this.updateUrl + id;
        console.log(this.updateUrl, dataTosend)
        this.onUpdate(dataTosend)
    }
    onDelete(event): void 
    {
        if (this.deleteItems.length == 0)
        {
            this.alertService.alertError('Error', 'Select records to delete.');
            return;
        }

        let heading = 'Delete ' + this.section + '?';
        let message = 'Are you sure you want to delete ' + this.section + '?';
        let rightButton = 'Delete ';
        let leftButton = 'Cancel';

        this.alertService.alertAsk(heading, message, rightButton, leftButton, false).then(result =>
        {
            if (result)
            {
                let url = this.deleteApi;

                this.apiService.patch(url, { ids: this.deleteItems }).then(result =>
                {
                    if (result.code == 200)
                    {
                        this.getList();
                        this.alertService.alertSuccess(result.status, result.message);
                    }
                    else
                    {
                        this.alertService.alertError(result.status, result.message);
                    }
                });
            }
        })
    }
}