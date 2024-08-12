// angular import
import { Component } from '@angular/core';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent {
  loginUser : any;
  constructor(private commonSharedService : CommonSharedService, 
  )
  {
    this.commonSharedService.currentAcademicYearListObject.next({result : "success"});
    this.loginUser = this.commonSharedService.loginUser;
  }
}
