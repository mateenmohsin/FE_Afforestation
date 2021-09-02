import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate
{
    constructor(private router: Router) { }
    canActivate() 
    {
        let greenerUser = JSON.parse(localStorage.getItem('greenerUser'));
        if (greenerUser == void 0) 
        {
            return true;
        }
        else 
        {
            this.router.navigate(['/main']);
            return false;
        }
    }
}
