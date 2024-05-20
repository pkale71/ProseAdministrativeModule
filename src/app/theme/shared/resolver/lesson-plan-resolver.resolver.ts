import { Injectable } from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { LessonPlanService } from '../service/lesson-plan.service';

@Injectable({
  providedIn: 'root'
})
export class LessonPlanResolver implements Resolve<any> {
  constructor(private lessonPlanService: LessonPlanService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let uuid : string = route.paramMap.get('lessonPlanUUID');
    if(uuid != "")
    {
      return this.lessonPlanService.getLessonPlan(uuid);
    }
    else
    {
      return null;
    }
  }
}
