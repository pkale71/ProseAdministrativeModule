// angular import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { UserListComponent } from './demo/user/user-list/user-list.component';
import { AuthGuardService } from './theme/shared/service/auth-guard.service';
import { UserListResolver } from './theme/shared/resolver/user-list-resolver.resolver';
import { SchoolListComponent } from './demo/school/school-list/school-list.component';
import { SchoolListResolver } from './theme/shared/resolver/school-list-resolver.resolver';
import { SchoolDetailComponent } from './demo/school/school-detail/school-detail.component';
import { SchoolDetailResolver } from './theme/shared/resolver/school-detail-resolver.resolver';
import { AcademicYearListComponent } from './demo/application-master/academic-year/academic-year-list/academic-year-list.component';
import { AcademicYearListResolver } from './theme/shared/resolver/academic-year-list-resolver.resolver';
import { SyllabusListComponent } from './demo/application-master/syllabus/syllabus-list/syllabus-list.component';
import { SyllabusListResolver } from './theme/shared/resolver/syllabus-list-resolver.resolver';
import { GradeListComponent } from './demo/application-master/grade/grade-list/grade-list.component';
import { GradeListResolver } from './theme/shared/resolver/grade-list-resolver.resolver';
import { GradeDetailResolver } from './theme/shared/resolver/grade-detail-resolver.resolver';
import { SubjectListComponent } from './demo/application-master/subject/subject-list/subject-list.component';
import { ChapterListComponent } from './demo/application-master/chapter/chapter-list/chapter-list.component';
import { SubjectDetailResolver } from './theme/shared/resolver/subject-detail-resolver.resolver';
import { ChapterListResolver } from './theme/shared/resolver/chapter-list-resolver.resolver';
import { ChapterDetailResolver } from './theme/shared/resolver/chapter-detail-resolver.resolver';
import { TopicListResolver } from './theme/shared/resolver/topic-list-resolver.resolver';
import { TopicListComponent } from './demo/application-master/topic/topic-list/topic-list.component';
import { UserDetailComponent } from './demo/user/user-detail/user-detail.component';
import { UserDetailResolver } from './theme/shared/resolver/user-detail-resolver.resolver';
import { CurriculumGradeSubjectsComponent } from './demo/curriculum-completion/curriculum-grade-subjects/curriculum-grade-subjects.component';
import { UserTeachGradeResolver } from './theme/shared/resolver/user-teach-grade-resolver.resolver';
import { CurriculumSubjectChaptersComponent } from './demo/curriculum-completion/curriculum-subject-chapters/curriculum-subject-chapters.component';
import { UserTeachChapterResolver } from './theme/shared/resolver/user-teach-chapter-resolver.resolver';
import { CurrentAcademicYearResolver } from './theme/shared/resolver/current-academic-year-resolver.resolver';
import { CurriculumChapterTopicsComponent } from './demo/curriculum-completion/curriculum-chapter-topics/curriculum-chapter-topics.component';
import { UserTeachChapterTopicsResolver } from './theme/shared/resolver/user-teach-chapter-topics-resolver.resolver';
import { CurriculumCompletionReportComponent } from './demo/report/curriculum-completion-report/curriculum-completion-report.component';
import { MaterialTypeListComponent } from './demo/application-master/material-type/material-type-list/material-type-list.component';
import { MaterialTypeListResolver } from './theme/shared/resolver/material-type-list-resolver.resolver';
import { CurriculumUploadListComponent } from './demo/curriculum-upload/curriculum-upload-list/curriculum-upload-list.component';
import { CurriculumUploadDetailResolver } from './theme/shared/resolver/curriculum-upload-detail-resolver.resolver';
import { CurriculumShowComponent } from './demo/curriculum-upload/curriculum-show/curriculum-show.component';
import { YearCalenderListComponent } from './demo/application-master/year-calender/year-calender-list/year-calender-list.component';
import { GradeScheduleSettingListComponent } from './demo/application-master/grade-schedule-setting/grade-schedule-setting-list/grade-schedule-setting-list.component';
import { WeeklyTimetableDisplayComponent } from './demo/weekly-timetable/weekly-timetable-display/weekly-timetable-display.component';
import { TeacherTimetableCalenderComponent } from './demo/teacher-timetable/teacher-timetable-calender/teacher-timetable-calender.component';
import { LessonPlanListComponent } from './demo/lesson-plan/lesson-plan-list/lesson-plan-list.component';
import { LessonPlanAddComponent } from './demo/lesson-plan/lesson-plan-add/lesson-plan-add.component';
import { LessonPlanResolver } from './theme/shared/resolver/lesson-plan-resolver.resolver';
import { LessonPlanDetailComponent } from './demo/lesson-plan/lesson-plan-detail/lesson-plan-detail.component';
import { LessonPlanEditComponent } from './demo/lesson-plan/lesson-plan-edit/lesson-plan-edit.component';
import { LessonPlanResourcePlayerComponent } from './demo/teacher-timetable/lesson-plan-resource-player/lesson-plan-resource-player.component';
import AuthChangePasswordComponent from './demo/pages/authentication/auth-change-password/auth-change-password.component';
import { UserRoleListComponent } from './demo/application-master/user-role/user-role-list/user-role-list.component';
import { UserTypeAddComponent } from './demo/application-master/user-type/user-type-add/user-type-add.component';
import { UserTypeListComponent } from './demo/application-master/user-type/user-type-list/user-type-list.component';
import { GradeCategoryListComponent } from './demo/application-master/grade-category/grade-category-list/grade-category-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/auth/signin',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./demo/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
//myCode
      {
        path: 'users',
        loadComponent: () => UserListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          users : UserListResolver,
        },
      },
      {
        path: 'user/detail/:userUUID',
        loadComponent: () => UserDetailComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          user : UserDetailResolver,
        },
      },
      {
        path: 'schools',
        loadComponent: () => SchoolListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          schools : SchoolListResolver,
        },
      },
      {
        path: 'school/detail/:schoolUUID',
        loadComponent: () => SchoolDetailComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          school : SchoolDetailResolver
        },
      },
      {
        path: 'applicationMaster/syllabuses',
        loadComponent: () => SyllabusListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          syllabuses : SyllabusListResolver,
        },
      },
      {
        path: 'applicationMaster/grades',
        loadComponent: () => GradeListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          grades : GradeListResolver,
        },
      },
      {
        path: 'applicationMaster/grade/detail/:gradeId',
        loadComponent: () => SubjectListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          grade : GradeDetailResolver,
        },
      },
      {
        path: 'applicationMaster/subject/detail/:subjectUUID',
        loadComponent: () => ChapterListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          gradeSubject : SubjectDetailResolver,
          subjectChapters : ChapterListResolver,
        },
      },
      {
        path: 'applicationMaster/chapter/detail/:chapterUUID',
        loadComponent: () => TopicListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          subjectChapter : ChapterDetailResolver,
          chapterTopics : TopicListResolver,
        },
      },
      {
        path: 'applicationMaster/academicYears',
        loadComponent: () => AcademicYearListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          academicYears : AcademicYearListResolver,
        },
      },
      {
        path: 'applicationMaster/materialTypes',
        loadComponent: () => MaterialTypeListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          materialTypes : MaterialTypeListResolver,
        },
      },
    //   {
    //     path: 'applicationMaster/yearCalender',
    //     loadComponent: () => YearCalenderListComponent,
    //     canActivate: [AuthGuardService],
    //     resolve: 
    //     { 
    //     },
    //   },
      {
        path: 'applicationMaster/gradeScheduleSettings',
        loadComponent: () => GradeScheduleSettingListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
        },
      },
      {
        path: 'applicationMaster/userRoles',
        loadComponent: () => UserRoleListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
        },
      },
      
      {
        path: 'applicationMaster/userTypes',
        loadComponent: () => UserTypeListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
        },
      },
      
      {
        path: 'applicationMaster/gradeCategories',
        loadComponent: () => GradeCategoryListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
        },
      },
    //   {
    //     path: 'curriculumCompletion/:userUUID',
    //     loadComponent: () => CurriculumGradeSubjectsComponent,
    //     canActivate: [AuthGuardService],
    //     resolve: 
    //     { 
    //       grades : UserTeachGradeResolver,
    //     },
    //   },
    //   {
    //     path: 'curriculumCompletionChapter/:subjectUUID',
    //     loadComponent: () => CurriculumSubjectChaptersComponent,
    //     canActivate: [AuthGuardService],
    //     resolve: 
    //     { 
    //       currentAcademicYear : CurrentAcademicYearResolver,
    //       gradeSubject : SubjectDetailResolver,
    //       subjectChapters : UserTeachChapterResolver,
    //     },
    //   },
    //   {
    //     path: 'curriculumCompletionChapterTopic/:chapterUUID',
    //     loadComponent: () => CurriculumChapterTopicsComponent,
    //     canActivate: [AuthGuardService],
    //     resolve: 
    //     { 
    //       currentAcademicYear : CurrentAcademicYearResolver,
    //       subjectChapter : ChapterDetailResolver,
    //       chapterTopics : UserTeachChapterTopicsResolver,
    //     },
    //   },
      {
        path: 'curriculumUploads',
        loadComponent: () => CurriculumUploadListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          academicYears : AcademicYearListResolver
        },
      },
      {
        path: 'showCurriculumUpload/:curriculumUploadUUID',
        loadComponent: () => CurriculumShowComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          curriculumUpload : CurriculumUploadDetailResolver
        },
      },
      {
        path: 'weeklyTimeTable',
        loadComponent: () => WeeklyTimetableDisplayComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
        },
      },
      {
        path: 'teachingSchedule',
        loadComponent: () => TeacherTimetableCalenderComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
        },
      },
      {
        path: 'lessonPlans',
        loadComponent: () => LessonPlanListComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          academicYears : AcademicYearListResolver
        },
      },
      {
        path: 'lessonPlan/edit/:lessonPlanUUID',
        loadComponent: () => LessonPlanEditComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          lessonPlan : LessonPlanResolver
        },
      },
      {
        path: 'lessonPlan/detail/:lessonPlanUUID',
        loadComponent: () => LessonPlanDetailComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          lessonPlan : LessonPlanResolver
        },
      },
      {
        path: 'lessonPlan/add',
        loadComponent: () => LessonPlanAddComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          
        },
      },
      {
        path: 'lessonPlan/add/:lessonPlanUUID',
        loadComponent: () => LessonPlanAddComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          oldLessonPlan : LessonPlanResolver
        },
      },
      {
        path: 'lessonPlan/player/:lessonPlanUUID',
        loadComponent: () => LessonPlanResourcePlayerComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          lessonPlan : LessonPlanResolver
        },
      },
    //   {
    //     path: 'reports/curriculumCompletetionReport',
    //     loadComponent: () => CurriculumCompletionReportComponent,
    //     canActivate: [AuthGuardService],
    //     resolve: 
    //     { 
    //       academicYears : AcademicYearListResolver
    //     },
    //   },
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  },
  {
    path: 'reset-link/:code',
    loadComponent: () => AuthChangePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
