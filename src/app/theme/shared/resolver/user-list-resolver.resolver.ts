import { Injectable } from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { UserService } from '../service/user.service';
import { CommonSharedService } from '../service/common-shared.service';

@Injectable({
  providedIn: 'root'
})
export class UserListResolver implements Resolve<any> {
  constructor(private userService: UserService, 
    private commonSharedService : CommonSharedService) 
    { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.commonSharedService.loginUser.role.name == 'Head')
    {
      return this.userService.getUsers(0, 0, "");
    }
    else
    {
      return this.userService.getUsers(this.commonSharedService.loginUser.role.id, 0, this.commonSharedService.loginUser.schools[0].uuid);
    }
  }
}
