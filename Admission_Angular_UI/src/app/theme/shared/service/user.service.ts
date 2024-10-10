import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { ApiAdminService } from './api-admin.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private apiService: ApiService, private apiAdminService : ApiAdminService) { }

    authenticateUser(authParams : any) 
    {
        return this.apiAdminService.post('/user/authenticateModuleUser', authParams);
    }

    changePassword(data : any) 
    {
        return this.apiAdminService.post('/user/changePassword', data);
    }

    logout() 
    {
        return this.apiAdminService.get('/user/signout');
    }

    //user
    getUsers(userGradeId : number, userCategoryId : number, action : string)
    {
        return this.apiService.get('/user/getUsers/' + userGradeId + '/' + userCategoryId + '/' + action);
    }
}
