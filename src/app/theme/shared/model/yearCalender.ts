import { AcademicYear } from "./academic-year";
import { School } from "./school";
import { User } from "./user";

export class YearCalender {
  id?: number;
  academicYear? : AcademicYear;
  school?: School;
  calenderDate? : Date;
  isTeaching? : Number;
  remark? : string;
  createdOn? : Date;
  modifyOn? : Date;
  modifyBy? : User;
}
