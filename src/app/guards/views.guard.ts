import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class ViewsGuard implements CanActivate
{

    constructor(private router: Router) { }

    canActivate()
    {
        let greenerUser = JSON.parse(localStorage.getItem('greenerUser'));
        if (greenerUser) 
        {
            return true;
        }
        this.router.navigate(['/auth/login']);
        return false;
    }
}

