import { Injectable } from '@angular/core';
import { AlertDialog } from '../core/alert/alert.dialog';
import { SaplingAlertComponent } from '../core/alert/sapling-alert/sapling-alert.component'
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class AlertService 
{

    constructor(protected dialog: MatDialog) 
    {

    }

    alertAsk(heading: string, message: string, rightButton: string, leftButton: string, hasInput: boolean)
    {
        var promise = new Promise((resolve, reject) =>
        {
            let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
            dialogRef.componentInstance.alertData = {
                heading: heading,
                message: message,
                hasInput: hasInput,
                rightButton: {
                    text: rightButton,
                    class: 'btn-blue'
                },
                leftButton: {
                    text: leftButton,
                    class: 'btn-white'
                },
                type: 'ask',
            };

            dialogRef.afterClosed().subscribe(result =>
            {
                resolve(result);
            })
        });
        return promise;
    }
    saplingAlertAsk(heading: string, message: string, rightButton: string, leftButton: string, hasInput: boolean, dataToSubmit: any, inputEditable: boolean)
    {
        var promise = new Promise((resolve, reject) =>
        {
            let dialogRef = this.dialog.open(SaplingAlertComponent, { autoFocus: false });
            dialogRef.componentInstance.alertData = {
                heading: heading,
                message: message,
                hasInput: hasInput,
                dataToSubmit: dataToSubmit,
                inputEditable: inputEditable,
                rightButton: {
                    text: rightButton,
                    class: 'btn-blue'
                },
                leftButton: {
                    text: leftButton,
                    class: 'btn-white'
                },
                type: 'ask',
            };

            dialogRef.afterClosed().subscribe(result =>
            {
                resolve(result);
            })
        });
        return promise;
    }

    //     asyncAction().then(() => // Logs console.log("Resolved!")
    // );

    private alertAsk2(heading: string, message: string, rightButton: string, leftButton: string): any
    {
        let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
        dialogRef.componentInstance.alertData = {
            heading: heading,
            message: message,
            hasInput: false,
            rightButton: {
                text: rightButton,
                class: 'btn-red'
            },
            leftButton: {
                text: leftButton,
                class: 'btn-white'
            },
            type: 'ask',
        };

        dialogRef.afterClosed().subscribe(result =>
        {
            return result;
        })
    }

    public alertError(heading: string, message: string): Promise<any>
    {
        return this.alert(heading, message, 'btn-red');
    }

    public alertSuccess(heading: string, message: string): Promise<any>
    {
        return this.alert(heading, message, 'btn-blue');
    }

    public alertInfo(heading: string, message: string): Promise<any>
    {
        return this.alert(heading, message, 'btn-white');
    }

    private alert(heading: string, message: string, btnClass: string): any
    {
        // let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
        // dialogRef.componentInstance.alertData = {
        //     heading: heading,
        //     message: message,
        //     rightButton: {
        //         text: '',
        //         class: ''
        //     },
        //     leftButton: {
        //         text: 'Ok',
        //         class: btnClass
        //     },
        //     type: 'error',
        // }

        var promise = new Promise((resolve, reject) =>
        {
            let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
            dialogRef.componentInstance.alertData = {
                heading: heading,
                message: message,
                hasInput: false,
                rightButton: {
                    text: '',
                    class: 'btn-red'
                },
                leftButton: {
                    text: 'Ok',
                    class: btnClass
                },
                type: 'success',
            };

            dialogRef.afterClosed().subscribe(result =>
            {
                resolve(result);
            })
        });
        // Logs console.log(promise);
        return promise;
    }
}
