import { AcademicYear } from "./academic-year";
import { School } from "./school";
import { TeachingScheduleDetail } from "./teachingScheduleDetail";
import { User } from "./user";

export class TeachingScheduleMaster {
  id?: number;
  uuid?:string;
  school?: School;
  academicYear?:AcademicYear;
  userId?:User;
  scheduleDate?:Date;
  isPresent?:number;
  createdOn : Date;
  createdBy : User;
  teachingScheduleDetails : TeachingScheduleDetail[];
}
