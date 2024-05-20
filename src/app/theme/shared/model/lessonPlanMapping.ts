import { LessonPlanMaster } from "./lessonPlanMaster";
import { TeachingScheduleDetail } from "./teachingScheduleDetail";
import { User } from "./user";

export class LessonPlanMapping {
  id?: number;
  uuid?:string;
  lessonPlanMaster : LessonPlanMaster;
  teachingScheduleDetail : TeachingScheduleDetail;
  teachUser : User;
  applyDate : Date;
  startDate : Date;
  endDate : Date;
  createdOn  : Date;
}
