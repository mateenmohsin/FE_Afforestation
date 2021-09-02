import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService, AlertService } from 'src/app/services';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-attendance-detail',
    templateUrl: './attendance-detail.html',
    styleUrls: ['./attendance-detail.scss']
})
export class AttendanceDetailComponent implements OnInit
{
    public date = moment();
    public currentMonth = moment();
    public disabledNext = false;
    public daysArr = [];

    sub: Subscription;
    attendanceId: any;
    type: any;
    attendanceDetail: any;
    gardenerId: string;
    attendanceKpi: any = {
        totalWorkingDays: 1,
        totalAbsents: 0,
        totalLeaves: 0,
    };
    detailUrl: string;
    reportData: any;
    dateUrl: string;
    kpiUrl: string;
    reportUrl: string;
    attendanceReport: any;
    otherDaysArr: any[] = [];
    gardenerDetail: any;
    selectedDay: any;
    gardenerName: any;
    nurseryName: any;
    gardenerRole: any;

    constructor(protected apiService: ApiService, protected alertService: AlertService, protected _route: ActivatedRoute)
    {

    }

    public ngOnInit()
    {
        this.sub = this._route.params.subscribe(params =>
        {
            this.attendanceId = params['attendanceId'];
            this.gardenerId = params['gardenerId'];
            this.type = params['type'];
            this.type = 'report';
            if (this.type == 'report')
            {
                this.reportUrl = 'admin/fetch/attendance/report?';
                this.reportData = JSON.parse(localStorage.getItem('attendance'));
            }
            else if (this.type == 'detail')
            {

            }

            this.detailUrl = 'admin/find/attendance/' + this.attendanceId;

            this.getDetail();
            this.getGardener();
        });
    }

    getDetail(): void
    {
        this.apiService.get(this.detailUrl).then(result =>
        {
            if (result.code === 200 && result.data) 
            {
                this.attendanceDetail = result.data;

                this.gardenerName = this.attendanceDetail.gardener.nameEn;
                this.nurseryName = this.attendanceDetail.nursery.nameEn;
                this.gardenerRole = this.attendanceDetail.gardener.role;

                // if (this.type == 'detail')
                // {
                //     var date = new Date(this.attendanceDetail.createdTime * 1000);
                //     this.date = moment(date);
                //     this.daysArr = this.createCalendar(this.date);

                //     this.getDaysArray();
                // }

                // if (this.type == 'report')
                // {

                var date = new Date(this.attendanceDetail.createdTime * 1000);

                this.date = moment(date);
                console.log(this.date);

                var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                let startDateTime = firstDay.getTime() / 1000;
                let endDateTime = lastDay.getTime() / 1000;

                this.dateUrl = 'startDateTime=' + startDateTime + '&endDateTime=' + endDateTime;

                let attributes = [
                    { key: "nurseryId", value: this.attendanceDetail.nurseryId },
                    { key: "gardenerId", value: this.gardenerId }
                ];

                this.reportUrl = this.reportUrl + this.dateUrl + '&attributes=' + JSON.stringify(attributes);
                this.kpiUrl = 'admin/fetch/attendance/kpis?' + this.dateUrl + '&attributes=' + JSON.stringify(attributes) + '&gardenerId=' + this.gardenerId;

                this.getAttendanceReport();
                this.getAttendanceKpis();
                // }
            }
            else
            {
                this.attendanceDetail = {};
                this.alertService.alertError(result.status, result.message);
            }
        });
    }

    getAttendanceReport(): void
    {
        this.apiService.get(this.reportUrl).then(result =>
        {
            if (result.code === 200 && result.data) 
            {
                this.attendanceReport = result.data.listing;

                this.attendanceReport.forEach(element =>
                {
                    element.selected = false;
                });

                if (this.type == 'report')
                {
                    this.daysArr = this.createCalendar(this.date);
                    this.getDaysArray();
                }
            }
            else
            {
                this.attendanceReport = [];
                this.alertService.alertError(result.status, result.message);
            }
        });
    }

    getGardener(): void
    {
        this.apiService.get('admin/find/gardener/' + this.gardenerId).then(result =>
        {
            if (result.code === 200 && result.data) 
            {
                this.gardenerDetail = result.data;
            }
            else
            {
                this.gardenerDetail = {};
                this.alertService.alertError(result.status, result.message);
            }
        });
    }

    getAttendanceKpis(): void
    {
        this.apiService.get(this.kpiUrl).then(result =>
        {
            if (result.code === 200 && result.data) 
            {
                this.attendanceKpi = result.data;
            }
            else
            {
                this.attendanceKpi = [];
                this.alertService.alertError(result.status, result.message);
            }
        });
    }

    // checkEqualDate(date): any
    // {
    //     if (this.type == 'report')
    //     {
    //         for (let index = 0; index < this.attendanceReport.length; index++)
    //         {
    //             const element = this.attendanceReport[index];

    //             if (element.selected == false)
    //             {
    //                 if (element.timeIn > 0)
    //                 {
    //                     let afterTimeIn = new Date(element.timeIn * 1000).setHours(0, 0, 0, 0);
    //                     let afterDate = moment(date).toDate().setHours(0, 0, 0, 0);

    //                     if (afterDate == afterTimeIn)
        // {
    //                         element.selected = true;
    //                         return {
    //                             attendance: element.attendance,
    //                             detail: element
    //                         };
    //                     }
    //                 }
    //                 else if (element.timeIn == 0)
        //     {
    //                     let afterTimeIn = new Date(element.createdTime * 1000).setHours(0, 0, 0, 0);
        //         let afterDate = moment(date).toDate().setHours(0, 0, 0, 0);

        //         if (afterDate == afterTimeIn)
        //         {
    //                         element.selected = true;
        //             return {
    //                             attendance: element.attendance,
    //                             detail: element
        //             };
        //         }
        //     }
    //                 else
    //                 {
    //                     return {};
    //                 }
    //             }
    //             else
    //             {
    //                 return {};
    //             }
    //         }
    //     }
    //     // else if (this.type == 'detail')
    //     // {
    //     //     if (this.attendanceDetail.timeIn)
    //     //     {
    //     //         let afterTimeIn = new Date(this.attendanceDetail.timeIn * 1000).setHours(0, 0, 0, 0);
    //     //         let afterDate = moment(date).toDate().setHours(0, 0, 0, 0);

    //     //         if (afterDate == afterTimeIn)
    //     //         {
    //     //             return {
    //     //                 attendance: this.attendanceDetail.attendance,
    //     //                 detail: this.attendanceDetail
    //     //             };
    //     //         }
    //     //     }
    //     // }
        // }

    getDaysArray(): any
    {
        let daysArr = [];
        if (this.daysArr.length > 0)
        {
            this.daysArr.forEach(element =>
            {
                let dict = {
                    date: element,
                    value: 'off',
                    detail: null,
                    current: false,
                    filled: false
                }
                let currentDate = new Date().setHours(0, 0, 0, 0);
                let afterDate = moment(element).toDate().setHours(0, 0, 0, 0);

                this.attendanceReport.forEach(atReport => 
                {
                    let afterTimeIn = new Date(atReport.createdTime * 1000).setHours(0, 0, 0, 0);
                    let afterDate = moment(element).toDate().setHours(0, 0, 0, 0);

                    if (afterDate == afterTimeIn)
                    {
                        console.log(atReport.attendance, moment(atReport.createdTime * 1000).format('DD/MM/YYYY HH:mm')); 
                        
                        if (atReport.attendance == 'absent')
                        {
                            if (atReport.absenteeReason == 'unknown')
                            {
                                dict.value = 'absent';
                            }
                            else
                            {
                                dict.value = 'leave';
                            }
                        }
                        else
                        {
                            dict.value = 'present';
                        }
                        dict.detail = atReport;
                        dict.filled = true;
                }
                });

                if (afterDate == currentDate)
                {
                    dict.current = true;
                    if (dict.value != 'off')
                    {
                        this.selectedDay = dict;
                    }
                }

                daysArr.push(dict);
            });
        }
        this.otherDaysArr = daysArr;
        // return daysArr;
    }

    public createCalendar(month)
    {
        this.selectedDay = null;

        var dateMili = moment(this.date).toDate().setHours(0, 0, 0, 0);
        var currentMili = moment(this.currentMonth).toDate().setHours(0, 0, 0, 0);

        var date = new Date(dateMili);
        var current = new Date(currentMili);

        var dateDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var currentDay = new Date(current.getFullYear(), current.getMonth(), 1);

        let startDateDay = dateDay.getTime() / 1000;
        let startCurrentDay = currentDay.getTime() / 1000;

        if (startDateDay == startCurrentDay)
        {
            this.disabledNext = true;
        }
        else
        {
            this.disabledNext = false;
        }


        let firstDay = moment(month).startOf('M');
        let days = Array.apply(null, { length: month.daysInMonth() }).map(Number.call, Number).map(n =>
        {
            return moment(firstDay).add(n, 'd');
        });

        for (let n = 0; n < firstDay.weekday(); n++)
        {
            days.unshift(null);
        }
        return days;
    }

    public nextMonth()
    {
        this.date.add(1, 'M');
        this.daysArr = this.createCalendar(this.date);

        if (this.type == 'report')
        {
            this.reportUrl = 'admin/fetch/attendance/report?';
            this.reportData = JSON.parse(localStorage.getItem('attendance'));

            var dateMili = moment(this.date).toDate().setHours(0, 0, 0, 0)

            var date = new Date(dateMili);

            this.date = moment(date);

            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            let startDateTime = firstDay.getTime() / 1000;
            let endDateTime = lastDay.getTime() / 1000;

            this.dateUrl = 'startDateTime=' + startDateTime + '&endDateTime=' + endDateTime;

            let attributes = [];
            if (this.reportData)
            {
                attributes = [
                    { key: "nurseryId", value: this.reportData.nurseryId },
                    { key: "gardenerId", value: this.gardenerId }
                ];
            }
            else
            {
                attributes = [
                    { key: "nurseryId", value: this.attendanceDetail.nurseryId },
                    { key: "gardenerId", value: this.gardenerId }
                ];
            }

            this.reportUrl = this.reportUrl + this.dateUrl + '&attributes=' + JSON.stringify(attributes);
            this.kpiUrl = 'admin/fetch/attendance/kpis?' + this.dateUrl + '&attributes=' + JSON.stringify(attributes) + '&gardenerId=' + this.gardenerId;

            this.getAttendanceReport();
            this.getAttendanceKpis();
        }
        else if (this.type == 'detail')
        {

        }
    }

    public previousMonth()
    {
        this.date.subtract(1, 'M');
        this.daysArr = this.createCalendar(this.date);

        if (this.type == 'report')
        {
            this.reportUrl = 'admin/fetch/attendance/report?';
            this.reportData = JSON.parse(localStorage.getItem('attendance'));

            var dateMili = moment(this.date).toDate().setHours(0, 0, 0, 0)

            var date = new Date(dateMili);

            this.date = moment(date);

            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            let startDateTime = firstDay.getTime() / 1000;
            let endDateTime = lastDay.getTime() / 1000;

            this.dateUrl = 'startDateTime=' + startDateTime + '&endDateTime=' + endDateTime;

            let attributes = [];
            if (this.reportData)
            {
                attributes = [
                    { key: "nurseryId", value: this.reportData.nurseryId },
                    { key: "gardenerId", value: this.gardenerId }
                ];
            }
            else
            {
                attributes = [
                    { key: "nurseryId", value: this.attendanceDetail.nurseryId },
                    { key: "gardenerId", value: this.gardenerId }
                ];
            }

            this.reportUrl = this.reportUrl + this.dateUrl + '&attributes=' + JSON.stringify(attributes);
            this.kpiUrl = 'admin/fetch/attendance/kpis?' + this.dateUrl + '&attributes=' + JSON.stringify(attributes) + '&gardenerId=' + this.gardenerId;

            this.getAttendanceReport();
            this.getAttendanceKpis();
        }
        else if (this.type == 'detail')
        {

        }
    }

    onClickDate(day): void
    {
        if (this.type == 'report')
        {
            if (day.detail)
            {
                this.attendanceDetail = day.detail;
                this.selectedDay = day;
            }
        }
    }
}
