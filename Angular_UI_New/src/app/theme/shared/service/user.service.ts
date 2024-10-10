import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private apiService: ApiService) { }

    authenticateUser(authParams : any) 
    {
        return this.apiService.post('/user/authenticate', authParams);
    }

    changePassword(data : any) 
    {
        return this.apiService.post('/user/changePassword', data);
    }

    sendResetLink(data : any)
    {
        return this.apiService.post('/sendResetLink', data);
    }

    getResetLinkData(code : string)
    {
        return this.apiService.get('/getResetLinkData/' + code);
    }

    resetPassword(data : any)
    {
        return this.apiService.post('/resetPassword/', data);
    }

    logout() 
    {
        return this.apiService.get('/user/signout');
    }

    //on Boarding link
    saveOnBoardingLink(onBoardinLink : any)
    {
        return this.apiService.post('/user/saveOnBoardingLink', onBoardinLink);
    }

    getOnBoardingLinks(status : string)
    {
        return this.apiService.get(`/user/getOnBoardingLinks/${status}`);
    }

    deleteOnBoardingLink(onBoardingLink : any)
    {
        return this.apiService.post('/user/deleteOnBoardingLink', onBoardingLink);
    }

    sendOnBoardingLink(onBoardingLink : any)
    {
        return this.apiService.post('/user/sendOnBoardingLink', onBoardingLink);
    }

    getOnBoardingLink(code : string)
    {
        return this.apiService.get(`/user/getOnBoardingLink/${code}`);
    }

    checkDuplicateEmailMobile(data : any)
    {
        return this.apiService.post('/user/checkDuplicateEmailMobile', data);
    }

    //user
    getUsers(userGradeId : number, userCategoryId : number, action : string)
    {
        return this.apiService.get('/user/getUsers/' + userGradeId + '/' + userCategoryId + '/' + action);
    }

    getUser(uuid : string)
    {
        return this.apiService.get('/user/getUser/' + uuid);
    }

    saveUser(user : any)
    {
        return this.apiService.post('/user/saveUser', user);
    }

    approveDenyUser(user : any)
    {
        return this.apiService.post('/user/approveDenyUser', user);
    }

    updateUser(user : any)
    {
        return this.apiService.post('/user/updateUser', user);
    }

    updateStatus(tempJson : any)
    {
        return this.apiService.post('/user/updateStatus', tempJson);
    }

    deleteUser(user : any)
    {
        return this.apiService.post('/user/deleteUser', user);
    }

    //user module
    saveUserModule(userModule : any)
    {
        return this.apiService.post('/user/saveUserModule', userModule);
    }

    getUserModule(userUUID : string, action : string)
    {
        return this.apiService.get('/user/getUserModules/' + userUUID + '/' + action);
    }

    approveDenyUserModule(userModule : any)
    {
        return this.apiService.post('/user/approveDenyUserModule', userModule);
    }

    deleteUserModule(userModule : any)
    {
        return this.apiService.post('/user/deleteUserModule', userModule);
    }
}
