import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: 'filter-control',
    templateUrl: 'filter-control.component.html',
    styleUrls: ['./filter.scss']
})
export class FilterControlComponent implements OnInit, OnChanges
{
    currentDate = new Date();
    @Input() placeholder: any = 'abc';
    @Input() options: any;
    @Input() builtInFilters: any;
    @Input() filterArray: any = [];
    @Input() storage: any = [];

    selectedFilters: any = [];

    valueSelected: string;
    options1 = { 'sort 1': 'Product 1', 'sort 2': 'Product 2', 'sort 3': 'Product 3' }

    @Output() selectedItem: EventEmitter<string> = new EventEmitter<string>();
    @Output() filnalFilters: EventEmitter<any> = new EventEmitter<any>();

    Form: FormGroup;
    FormTwo: FormGroup;
    @Input() label: any = null;
    @Input() start: any = null;
    @Input() end: any = null;
    @Input() hasDatePicker: any = false;
    @Input() hasOnlyDate: any = false;
    @Input() hasSearch: any = false;
    @Input() searchConfig: any = null;
    searchTimer: number;
    minDate: Date;

    constructor()
    {
        const currentYear = new Date().getFullYear();
        this.minDate = new Date(currentYear - 20, 0, 1);

        this.Form = new FormGroup({
            start: new FormControl(this.start),
            end: new FormControl(this.end)
        });

        this.FormTwo = new FormGroup({
            date: new FormControl(this.start)
        });

        this.Form.valueChanges.subscribe(result =>
        {

        })
    }

    ngOnChanges(changes: SimpleChanges): void
    {
        // this.filterArray = [];
        // console.log('ngOnChanges', changes);
        // this.filterArray = changes.currentValue;
        // console.log('ngOnChanges', this.filterArray);
    }

    ngOnInit()
    {
        setTimeout(() =>
        {
            this.storage.forEach(element =>
            {
                this.filterArray[element.at].options = JSON.parse(localStorage.getItem(element.get))
            });
        }, 1000);

        // if (this.builtInFilters)
        // {
        //     this.selectedFilters.push(this.builtInFilters);
        // }

        // let final = {
        //     sort: "",
        //     filter: this.selectedFilters
        // }

        // console.log('final', final, this.builtInFilters, this.selectedFilters);

        // this.filnalFilters.emit(final);
        this.onChangeFilters();
    }

    optionSelected(value)
    {
        // Logs console.log("option selected is", value);
        this.valueSelected = value;
        this.selectedItem.emit(this.valueSelected);
        // Logs console.log(this.selectedItem)
    }



    onChangeFilters(): void
    {
        this.selectedFilters = [];
        let sort = '';
        let range = '';
        let search = '';
        let onlyDate = '';

        if (this.builtInFilters)
        {
            this.selectedFilters.push(this.builtInFilters);
        }

        if (this.Form.get('start').value && this.Form.get('end').value && this.hasDatePicker)
        {
            let start = this.Form.get('start').value.setHours(0, 0, 0);
            let end = this.Form.get('end').value.setHours(23, 59, 59);
            let dict = {
                startDateTime: new Date(start).getTime() / 1000,
                endDateTime: new Date(end).getTime() / 1000,
            }

            range = '&startDateTime=' + dict.startDateTime + '&endDateTime=' + dict.endDateTime;
        }

        if (this.FormTwo.get('date').value && this.hasOnlyDate)
        {
            let start = moment(this.FormTwo.get('date').value).format('YYYY-MM-DD');

            onlyDate = '&date=' + start;
        }

        if (this.searchConfig && this.hasSearch)
        {
            if (this.searchConfig.value)
            {
                search = '&search=' + this.searchConfig.value;
            }
        }

        this.filterArray.forEach(element =>
        {
            if (element.selected != 'All')
            {
                if (element.type == 'sort')
                {
                    sort = '&sortBy=' + element.key + '&sortOrder=' + element.selected;
                }
                else
                {
                    let dict = {
                        key: element.key, value: element.selected
                    }
                    this.selectedFilters.push(dict);
                }
            }
        });

        let final = {
            sort: sort,
            range: range,
            search: search,
            date: onlyDate,
            filter: this.selectedFilters
        }

        this.filnalFilters.emit(final);
    }

    valueChanged(): void
    {
        this.onChangeFilters();
    }

    valueChanged2(): void
    {
        if (this.Form.get('start').value && this.Form.get('end').value && this.hasDatePicker)
        {
            this.onChangeFilters();
        }
    }

    onSearch(): void
    {
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() =>
        {
            this.onChangeFilters();
        }, 500);
    }

    onClear(): void
    {
        this.Form.reset();
        // this.onDateRange.emit('removed');
        this.onChangeFilters();
    }

    onClear2(): void
    {
        this.FormTwo.reset();
        // this.onDateRange.emit('removed');
        this.onChangeFilters();
    }

    onClosed(): void
    {
        if (this.Form.get('start').value == null || this.Form.get('end').value == null)
        {
            this.onClear();
        }
    }
}