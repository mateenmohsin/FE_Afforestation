import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'date-range',
    templateUrl: './date-range.html'
})
export class DateRangeComponent implements OnInit
{
    currentDate = new Date();
    Form: FormGroup;
    @Input() label: any = null;
    @Input() start: any = null;
    @Input() end: any = null;
    @Output() onDateRange: EventEmitter<any> = new EventEmitter<any>();
    send: boolean;

    constructor()
    {
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();

        this.Form = new FormGroup({
            start: new FormControl(this.start),
            end: new FormControl(this.end)
        });

        this.Form.valueChanges.subscribe(result =>
        {
            // if (result.start && result.end && this.send == false)
            // {
            //     this.send = true;
            //     let start = result.start.setHours(0, 0, 0);
            //     let end = result.end.setHours(23, 59, 59);
            //     let dict = {
            //         startDateTime: new Date(start).getTime() / 1000,
            //         endDateTime: new Date(end).getTime() / 1000,
            //     }
            //     this.onDateRange.emit(dict);
            // }
            // else
            // {

            // }
        })
    }

    ngOnInit(): void
    {
    }

    valueChanged(): void
    {
        if (this.Form.get('start').value && this.Form.get('end').value)
        {
            let start = this.Form.get('start').value.setHours(0, 0, 0);
            let end = this.Form.get('end').value.setHours(23, 59, 59);
            let dict = {
                startDateTime: new Date(start).getTime() / 1000,
                endDateTime: new Date(end).getTime() / 1000,
            }
            this.onDateRange.emit(dict);
        }
        else
        {

        }
    }

    onClear(): void
    {
        this.Form.reset();
        this.onDateRange.emit('removed');
    }

    onClosed(): void
    {
        if (this.Form.get('start').value == null || this.Form.get('end').value == null)
        {
            this.onClear();
        }
    }
}
