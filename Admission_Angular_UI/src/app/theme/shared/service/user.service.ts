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
    getModuleUsers(moduleId : string)
    {
        return this.apiAdminService.get('/user/getModuleUsers/' + moduleId);
    }

    getUser(uuid : string)
    {
        return this.apiAdminService.get('/user/getUser/' + uuid);
    }

    getUserModules(userUUID : string, action : string, moduleId : number)
    {
        return this.apiAdminService.get('/user/getUserModules/' + userUUID + '/' + action + '/' + moduleId);
    }

    updateUserModuleStatus(tempJSON: any)
    {
        return this.apiAdminService.post('/user/updateStatus', tempJSON);
    }
    
    approveDenyUserModule(userModule : any)
    {
        return this.apiAdminService.post('/user/approveDenyUserModule', userModule);
    }

    approveDenyUser(user : any)
    {
        return this.apiAdminService.post('/user/approveDenyUser', user);
    }

    assignUserRoleTypeModule(assignUserRoleTypeModule)
    {
        return this.apiAdminService.post('/user/assignUserRoleTypeModule', assignUserRoleTypeModule);
    }
}
