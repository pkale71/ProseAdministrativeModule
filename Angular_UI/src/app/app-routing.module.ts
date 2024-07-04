// angular import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { UserListComponent } from './demo/user/user-list/user-list.component';
import { AuthGuardService } from './theme/shared/service/auth-guard.service';
// import { UserListResolver } from './theme/shared/resolver/user-list-resolver.resolver';
import { SyllabusListComponent } from './demo/application-master/syllabus/syllabus-list/syllabus-list.component';
import { GradeListComponent } from './demo/application-master/grade/grade-list/grade-list.component';
import { GradeListResolver } from './theme/shared/resolver/grade-list-resolver.resolver';
import { UserDetailComponent } from './demo/user/user-detail/user-detail.component';
import AuthChangePasswordComponent from './demo/pages/authentication/auth-change-password/auth-change-password.component';
import { UserRoleListComponent } from './demo/application-master/user-role/user-role-list/user-role-list.component';
import { UserTypeAddComponent } from './demo/application-master/user-type/user-type-add/user-type-add.component';
import { UserTypeListComponent } from './demo/application-master/user-type/user-type-list/user-type-list.component';
import { GradeCategoryListComponent } from './demo/application-master/grade-category/grade-category-list/grade-category-list.component';
import { GradeWiseSyllabusListComponent } from './demo/application-master/grade-wise-syllabus/grade-wise-syllabus-list/grade-wise-syllabus-list.component';
import { SchoolingProgramListComponent } from './demo/application-master/schooling-program/schooling-program-list/schooling-program-list.component';
import { AcademicSessionListComponent } from './demo/application-master/academic-session/academic-session-list/academic-session-list.component';
import { SyllabusWiseSubjectListComponent } from './demo/application-master/syllabus-wise-subject/syllabus-wise-subject-list/syllabus-wise-subject-list.component';
import { SubjectWiseChapterListComponent } from './demo/application-master/subject-wise-chapter/subject-wise-chapter-list/subject-wise-chapter-list.component';
import { ChapterWiseTopicListComponent } from './demo/application-master/chapter-wise-topic/chapter-wise-topic-list/chapter-wise-topic-list.component';
import { OnBoardingLinkListComponent } from './demo/application-master/on-boarding-link/on-boarding-link-list/on-boarding-link-list.component';
import { AcademyEnclosureDocumentListComponent } from './demo/application-master/academy-enclosure-document/academy-enclosure-document-list/academy-enclosure-document-list.component';
import { BusinessVerticalListComponent } from './demo/business-master/business-vertical/business-vertical-list/business-vertical-list.component';
import { BusinessVerticalGroupListComponent } from './demo/business-master/business-vertical-group/business-vertical-group-list/business-vertical-group-list.component';
import { BusinessVerticalTypeListComponent } from './demo/business-master/business-vertical-type/business-vertical-type-list/business-vertical-type-list.component';
import { CoachListComponent } from './demo/business-master/coach/coach-list/coach-list.component';
import { CountryListComponent } from './demo/application-master/country/country-list/country-list.component';
import { StateRegionListComponent } from './demo/application-master/state-region/state-region-list/state-region-list.component';
import { DistrictListComponent } from './demo/application-master/district/district-list/district-list.component';
import { CityListComponent } from './demo/application-master/city/city-list/city-list.component';
import { BusinessPartnerListComponent } from './demo/business-master/business-partner/business-partner-list/business-partner-list.component';
import { BusinessPartnerAddComponent } from './demo/business-master/business-partner/business-partner-add/business-partner-add.component';

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
      
   // for user 
      {
        path: 'users',
        loadComponent: () => UserListComponent,
        canActivate: [AuthGuardService],
        // resolve: 
        // { 
          // users : UserListResolver,
        // },
      },
      {
        path: 'user/detail/:userUUID',
        loadComponent: () => UserDetailComponent,
        canActivate: [AuthGuardService],
        resolve: 
        { 
          // user : UserDetailResolver,
        },
      },
      {
        path: 'user/onBoardingLinks',
        loadComponent : () => OnBoardingLinkListComponent,
        canActivate: [AuthGuardService],
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
      //routing
      {
        path: 'applicationMaster/grade',
        loadComponent: () => GradeListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'applicationMaster/academicSessions',
        loadComponent: () => AcademicSessionListComponent,
        canActivate: [AuthGuardService],

      },

      {
        path: 'applicationMaster/schoolingPrograms',
        loadComponent : () => SchoolingProgramListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'applicationMaster/syllabuses',
        loadComponent: () => SyllabusListComponent,
        canActivate: [AuthGuardService],
        // resolve: 
        // { 
        //   syllabuses : SyllabusListResolver,
        // },
      },

      {
        path: 'applicationMaster/grade-wise-syllabus',
        loadComponent: () => GradeWiseSyllabusListComponent,
        canActivate: [AuthGuardService],

      },
      
      {
        path: 'applicationMaster/SyllabusWiseSubjects',
        loadComponent : () => SyllabusWiseSubjectListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'applicationMaster/SubjectWiseChapters',
        loadComponent : () => SubjectWiseChapterListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'applicationMaster/ChapterWiseTopics',
        loadComponent : () => ChapterWiseTopicListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'applicationMaster/academyEnclosureDocument',
        loadComponent : () => AcademyEnclosureDocumentListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'business/businessVertical',
        loadComponent : () => BusinessVerticalListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'business/businessVerticalGroup',
        loadComponent : () => BusinessVerticalGroupListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'business/businessVerticalType',
        loadComponent : () => BusinessVerticalTypeListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'business/coaches',
        loadComponent : () => CoachListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'applicationMaster/countries',
        loadComponent : () => CountryListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'applicationMaster/stateRegions',
        loadComponent : () => StateRegionListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'applicationMaster/districts',
        loadComponent : () => DistrictListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'applicationMaster/cities',
        loadComponent : () => CityListComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'business/businessPartners',
        loadComponent : () => BusinessPartnerListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'business/businessPartner/add/:id',
        loadComponent: () => BusinessPartnerAddComponent,
        canActivate: [AuthGuardService],
      },
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      },
      {
        path: 'userProfile/:code',
        loadChildren: () => import('./demo/pages/user-profile/user-profile.module').then((m) => m.UserProfileModule)
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
