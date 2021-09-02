import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { appConfig } from '../../config';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class ApiService 
{
    greenerUser: any = {};

    headers: HttpHeaders;
    options: any;
    public baseUrl: string;

    constructor(private http: HttpClient, protected loaderService: LoaderService) 
    {
        this.greenerUser = JSON.parse(localStorage.getItem('greenerUser'));
        this.baseUrl = appConfig.base_url;

        if (this.greenerUser)
        {
            this.headers = new HttpHeaders({ 'Authorization': this.greenerUser.token });
        }
        else
        {
            this.headers = new HttpHeaders({ 'Authorization': appConfig.default_auth_key });
        }
        this.options = { headers: this.headers, observe: 'response' };
    }

    getToken(): void
    {
        this.greenerUser = JSON.parse(localStorage.getItem('greenerUser'));
        this.baseUrl = appConfig.base_url;

        if (this.greenerUser)
        {
            this.headers = new HttpHeaders({ 'Authorization': this.greenerUser.token });
        }
        else
        {
            this.headers = new HttpHeaders({ 'Authorization': appConfig.default_auth_key });
        }
        this.options = { headers: this.headers, observe: 'response' };
    }

    public get(url: string): Promise<any>
    {
        this.getToken();
        this.loaderService.setLoading(true);

        return this.http.get(this.baseUrl + url, this.options).toPromise().then((response: any) =>
        {
            return this.onResponse(response, 'response');
        }, (reason: any) =>
        {
            return this.onResponse(reason, 'error');
        }).catch(this.handleError);
    }

    public delete(url: string): Promise<any>
    {
        this.getToken();
        return this.http.delete(this.baseUrl + url, this.options).toPromise().then((response: any) =>
        {
            return this.onResponse(response, 'response');
        }, (reason: any) =>
        {
            return this.onResponse(reason, 'error');
        }).catch(this.handleError);
    }

    public deleteBody(url: string, formData: any): Promise<any>
    {
        this.getToken();
        let options = { headers: this.headers, body: formData };

        return this.http.delete(this.baseUrl + url, options).toPromise().then((response: any) =>
        {
            return this.onResponse(response, 'response');
        }, (reason: any) =>
        {
            return this.onResponse(reason, 'error');
        }).catch(this.handleError);
    }

    public post(apiSlug: string, formData: any, hasFile?: boolean): Promise<any>
    {
        this.getToken();
        let data: any = formData;
        if (hasFile)
        {
            data = new FormData();
            for (var key in formData)
            {
                data.append(key, formData[key]);
            }
        }

        return this.http.post(this.baseUrl + apiSlug, data, this.options).toPromise().then((response: any) =>
        {
            return this.onResponse(response, 'response');
        }, (reason: any) => 
        {
            return this.onResponse(reason, 'error');
        }).catch(this.handleError);
    }

    public put(apiSlug: string, formData: any, hasFile?: boolean): Promise<any>
    {
        this.getToken();
        let data: any = formData;
        if (hasFile)
        {
            data = new FormData();
            for (var key in formData)
            {
                data.append(key, formData[key]);
            }
        }

        return this.http.put(this.baseUrl + apiSlug, data, this.options).toPromise().then((response: any) =>
        {
            return this.onResponse(response, 'response');
        }, (reason: any) => 
        {
            return this.onResponse(reason, 'error');
        }).catch(this.handleError);
    }

    public patch(apiSlug: any, formData: any, hasFile?: boolean): Promise<any>
    {
        this.getToken();
        let data: any = formData;
        if (hasFile)
        {
            data = new FormData();
            for (var key in formData)
            {
                data.append(key, formData[key]);
            }
        }
        return this.http.patch(this.baseUrl + apiSlug, data, this.options).toPromise().then((response: any) =>
        {
            return this.onResponse(response, 'response');
        }, (reason: any) =>
        {
            return this.onResponse(reason, 'error');
        }).catch(this.handleError);
    }

    public logout(): Promise<any>
    {
        this.getToken();
        return this.http.get(this.baseUrl + 'admin/logout', this.options).toPromise().then((response: any) =>
        {
            return this.onResponse(response, 'response');
        }, (reason: any) =>
        {
            return this.onResponse(reason, 'error');
        }).catch(this.handleError);
    }


    public auth(url, formData: any): Promise<any>
    {
        return this.http.post(this.baseUrl + url, formData, this.options).toPromise().then((response: any) =>
        {
            if (url == 'admin/verify/otp-code')
            {
                localStorage.setItem('greenerUser', JSON.stringify(response.body.data));
            }
            return response.body;
        }, (reason: any) =>
        {
            return this.onResponse(reason, 'error');
        }).catch(this.handleError);
    }

	/**
	 * onResponse
	 */
    public onResponse(response, type)
    {
        setTimeout(() =>
        {
            this.loaderService.setLoading(false);
        }, 800);

        if (type == 'response')
        {
            if (response.code === 403)
            {
                localStorage.clear();
                window.location.reload();
            }
            else 
            {
                return response.body;
            }
        }
        else
        {
            if (response.error.code === 401)
            {
                localStorage.clear();

                let res = {
                    code: response.error.code,
                    status: "ERROR",
                    message: 'Unauthorized user.',
                }
                return res;
            }
            else if (response.error.code === 403)
            {
                localStorage.clear();

                let res = {
                    code: response.error.code,
                    status: "ERROR",
                    message: 'Unauthorized user , you can not access the route.',
                }
                return res;
            }
            else if (response.error.code === 422)
            {
                let res = {
                    code: response.error.code,
                    status: "ERROR",
                    message: response.error.data,
                }
                return res;
            }
            else if (response.error.code === 500)
            {
                let res = {
                    code: response.error.code,
                    status: "ERROR",
                    message: response.error.message,
                }
                return res;
            }
            else
            {
                return response;
            }
        }
    }

    public handleError(error: any): Promise<any>
    {
        return error;
    }
}
