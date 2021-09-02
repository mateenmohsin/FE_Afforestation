
import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';

import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services';

@Component({
    selector: 'app-main-app',
    templateUrl: 'main-app.component.html',
    styleUrls: ['./main-app.component.scss']
})
export class MainAppComponent implements OnInit, OnDestroy
{

    @ViewChild('sidenav') sidenav: MatSidenav;
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    sub: Subscription;
    isMenuCollapsed: boolean = true;
    mode: string;
    openSidenav: boolean;
    private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
    sWidth: number;
    greenerUser: any;

    @HostListener('window:resize', ['$event'])
    onResize(event) 
    {
        this.screenWidth$.next(event.target.innerWidth);
    }

    constructor(protected _route: ActivatedRoute, protected apiService: ApiService, protected router: Router) 
    {
        // this.sub = this.collapsibleService.appCollapsibleStatus.subscribe((result: any) =>
        // {
        //     this.isMenuCollapsed = result;
        //     this.onManageMenu();
        // });
        this.greenerUser = JSON.parse(localStorage.getItem('greenerUser'));
        let user = this.greenerUser.user.name.split(' ');
        console.log(user)
        this.greenerUser.user.name = user[0];
    }

    ngOnInit() 
    {
        // this.onGetFormData();
        this.getNurseries();
        this.getGardeners();

        this.getScreenWidth().subscribe(width =>
        {

            this.sWidth = width;
            if (width < 961) 
            {
                this.mode = 'over';
                this.openSidenav = true;
            }
            else if (width > 960) 
            {
                this.mode = 'side';
                this.openSidenav = true;
            }
        });
    }

    ngOnDestroy(): void 
    {
        this.sub.unsubscribe();
    }

    getScreenWidth(): Observable<number> 
    {
        return this.screenWidth$.asObservable();
    }

    onManageMenu(e?: any): void
    {
        console.log(e);
        this.sidenav.toggle();
    }

    getNurseries(): any
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
    getGardeners(): any
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
    logOut()
    {
        this.apiService.logout().then(result =>
        {
            if (result.code === 200)
            {
                localStorage.clear();
                window.location.reload();
            }
            else
            {
                localStorage.clear();
                window.location.reload();
            }
        });
    }

    onProfile(): void
    {
        this.router.navigateByUrl('/main/profile');
    }
}
