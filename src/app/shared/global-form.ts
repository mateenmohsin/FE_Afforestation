import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, ApiService } from '../services';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { appConfig } from '../../config';

import { getInventoryFieldMsg } from '../shared/field-validation-messages';

@Component({
    selector: 'app-global-form',
    template: ``
})
export class GlobalFormComponent implements OnInit
{

    currentDate = new Date();

    Form: FormGroup;
    sub: Subscription;
    formApi: string;
    id: any;
    detailApi: string;
    formDetail: any;
    otherForm: any;
    formValueChanged: any;
    type: any;
    title: any;
    onlyImage: boolean = false;
    hasFile: boolean = false;
    nurseries: any[] = [];
    gardeners: any[] = [];
    species: any[] = [];
    minDate: Date;
    greenerUser: any;

    constructor(protected router: Router,
        protected _route: ActivatedRoute,
        protected alertService: AlertService,
        protected apiService: ApiService,
        protected formbuilder: FormBuilder)
    {
        const currentYear = new Date().getFullYear();
        this.minDate = new Date(currentYear - 74, 0, 1);
        // Logs console.log('supoer')
        this.Form = this.formbuilder.group({});


        this.Form.valueChanges.subscribe(result =>
        {
            // Logs console.log(result);
        });

        this.greenerUser = JSON.parse(localStorage.getItem('greenerUser'));
    }

    ngOnInit()
    {
        this.sub = this._route.params.subscribe(params =>
        {
            this.id = params['id'];
            this.type = params['type'];

            this.checkFormUrls();
            this.checkType();
        });
    }

    checkFormUrls(): void
    {

    }

    getField(field: any): any
    {
        return this.Form.get(field).invalid;
        // return false;
    }

    getErrorMessage(field: any): any
    {
        return getInventoryFieldMsg[field];
    }

    checkType()
    {
        if (this.type != "")
        {
            if (this.type === 'View')
            {
                this.title = "View " + this.title;
                this.onlyImage = true;
                this.Form.disable();
            }
            else if (this.type === 'Edit')
            {
                this.onlyImage = false;
                this.title = "Edit " + this.title
            }
            else
            {
                this.onlyImage = false;
                this.title = "Add " + this.title
            }
        }
    }
    onLocationBack(): void
    {
        window.history.back();
    }

    onSubmit(): void
    {
        if (this.Form.invalid)
        {
            let string = '';
            let form = this.Form.controls;
            for (let key in form)
            {
                if (this.Form.get(key).invalid)
                {
                    // console.log('this.Form.get(key)', this.Form.get(key));
                    // // string = string + getInventoryFieldMsg[key] + ' <br>';
                }
            }
            this.alertService.alertError('WARNING', 'Please fill the required data.');
            return;
        }
        if (this.type == "View")
        {


        }
        else
        {
            let formData = this.Form.value;

            if (this.formValueChanged)
            {
                formData = this.otherForm;
            }

            if (this.Form.value.hasOwnProperty('dateOfBirth'))
            {
                formData['dateOfBirth'] = new Date(formData['dateOfBirth']).getTime() / 1000;
            }

            if (this.type == 'Edit')
            {
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
                this.apiService.post(this.formApi, formData, this.hasFile).then(response =>
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

        }

    }

    afterSuccessfullyAdd(): void
    {

    }

    getDetail(): void
    {
        this.apiService.get(this.detailApi).then(result =>
        {
            if (result.code === 200 && result.data) 
            {

                this.formDetail = result.data;
                this.Form.patchValue(this.formDetail);
                this.afterDetail();

            }
            else
            {
                this.formDetail = {};
                this.alertService.alertError(result.status, result.message);
            }
        });
    }

    afterDetail(): void
    {

    }

    getImage(item): any
    {
        if (this.formDetail)
        {
            let file = this.formDetail[item];
            if (file)
                return file;
            else
                return '';
        }
        else
        {
            return '';
        }
    }

    onFileSelect(event)
    {
        if (event.valid)
        {
            console.log('File', event);
            this.Form.get(event.controlName).setValue(event.file);
        }
        else
        {
            this.Form.get(event.controlName).setValue(event.file);
            this.alertService.alertError('Image', 'Selected file is not valid.')
        }
    }

    onDeleteFile(event): void
    {
        this.Form.get(event.controlName).setValue(null);
    }
    returnFirstWord(title)
    {
        var val;
        val = title.substr(0, title.indexOf(" "));
        if (val == "Edit")
        {
            return "Update";

        }
        else
        {
            return val;
        }
    }

    getNurseries(newUrl?: any): any
    {
        let data = [];
        let url = 'admin/fetch/nurseries?fetchType=dropdown';
        if (newUrl)
        {
            url = url + newUrl;
        }
        this.apiService.get(url).then(res =>
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

                this.nurseries = data;
            }
            else
            {
                this.nurseries = [];
            }
        });
    }

    getSpecies(): any
    {
        let data = [];
        this.apiService.get('admin/fetch/species?fetchType=dropdown').then(res =>
        {
            if (res.code == 200)
            {
                console.log(res, res.data, "this is data")
                res.data.forEach(element =>
                {
                    console.log(element, "element is")
                    let dict = {
                        key: 'specieId',
                        value: element.id,
                        label: element.nameEn,
                    }
                    data.push(dict);
                });

                this.species = data;
                console.log(this.species, "now species")
            }
            else
            {
                this.species = [];
            }
        });
    }

    getGardeners(): any
    {
        let data = [];
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

                this.gardeners = data;
            }
            else
            {
                this.gardeners = data;
            }
        });
    }
}
