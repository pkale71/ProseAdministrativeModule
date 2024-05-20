import { Time } from "@angular/common";
import { AcademicYear } from "./academic-year";
import { Grade } from "./grade";
import { School } from "./school";
import { User } from "./user";

export class GradeScheduleSetting {
  id?: number;
  uuid?:string;
  grade?: Grade;
  school?: School;
  academicYear?:AcademicYear;
  startTime?:Time;
  numberOfPeriods?:number;
  duration?:number;
  createdOn : Date;
  createdBy : User;
  modifyOn : Date;
  modifyBy : User;
  isExist : number;
}
