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
import { SchoolingProgramListComponent } from './demo/application-master/schooling-program/schooling-program-list/schooling-program-list.component';
import { AcademicSessionListComponent } from './demo/application-master/academic-session/academic-session-list/academic-session-list.component';
import { SubjectListComponent } from './demo/application-master/subject/subject-list/subject-list.component';
import { ChapterListComponent } from './demo/application-master/chapter/chapter-list/chapter-list.component';
import { TopicListComponent } from './demo/application-master/topic/topic-list/topic-list.component';
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
import { BusinessPartnerDetailComponent } from './demo/business-master/business-partner/business-partner-detail/business-partner-detail.component';
import { TieUpSchoolListComponent } from './demo/business-master/tie-up-school/tie-up-school-list/tie-up-school-list.component';
import { TieUpSchoolDetailComponent } from './demo/business-master/tie-up-school/tie-up-school-detail/tie-up-school-detail.component';
import { StudyCenterListComponent } from './demo/business-master/study-center/study-center-list/study-center-list.component';
import { StudyCenterAddComponent } from './demo/business-master/study-center/study-center-add/study-center-add.component';
import { StudyCenterDetailComponent } from './demo/business-master/study-center/study-center-detail/study-center-detail.component';
import { SchoolingGroupListComponent } from './demo/application-master/schooling-group/schooling-group-list/schooling-group-list.component';
import { SchoolingCategoryListComponent } from './demo/application-master/schooling-category/schooling-category-list/schooling-category-list.component';
import { SyllabusDetailComponent } from './demo/application-master/syllabus/syllabus-detail/syllabus-detail.component';
import { SchoolSubGroupListComponent } from './demo/application-master/school-sub-group/school-sub-group-list/school-sub-group-list.component';
import { BatchTypeListComponent } from './demo/application-master/batch-type/batch-type-list/batch-type-list.component';
import { SchoolListComponent } from './demo/business-master/school/school-list/school-list.component';
import { SchoolDetailComponent } from './demo/business-master/school/school-detail/school-detail.component';

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
                path: 'academicMaster/grades',
                loadComponent: () => GradeListComponent,
                canActivate: [AuthGuardService],
                resolve: 
                { 
                grades : GradeListResolver,
                },
            },
            {
                path: 'user/userRoles',
                loadComponent: () => UserRoleListComponent,
                canActivate: [AuthGuardService],
                resolve: 
                { 
                },
            },
            {
                path: 'user/userTypes',
                loadComponent: () => UserTypeListComponent,
                canActivate: [AuthGuardService],
                resolve: 
                { 
                },
            },  
            {
                path: 'academicMaster/gradeCategories',
                loadComponent: () => GradeCategoryListComponent,
                canActivate: [AuthGuardService],
                resolve: 
                { 
                },
            },
            //routing
            {
                path: 'academicMaster/grade',
                loadComponent: () => GradeListComponent,
                canActivate: [AuthGuardService],
            },

            {
                path: 'academicMaster/academicSessions',
                loadComponent: () => AcademicSessionListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'schoolingMaster/schoolingGroups',
                loadComponent: () => SchoolingGroupListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'schoolingMaster/schoolingCategories',
                loadComponent: () => SchoolingCategoryListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'schoolingMaster/schoolingPrograms',
                loadComponent : () => SchoolingProgramListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'academicMaster/syllabuses',
                loadComponent: () => SyllabusListComponent,
                canActivate: [AuthGuardService],
                // resolve: 
                // { 
                //   syllabuses : SyllabusListResolver,
                // },
            },
            {
                path: 'academicMaster/syllabus/detail/:id',
                loadComponent: () => SyllabusDetailComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'schoolingMaster/schoolSubGroups',
                loadComponent: () => SchoolSubGroupListComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'schoolingMaster/batchTypes',
                loadComponent: () => BatchTypeListComponent,
                canActivate: [AuthGuardService]
            },      
            {
                path: 'academicMaster/subjects',
                loadComponent : () => SubjectListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'academicMaster/chapters',
                loadComponent : () => ChapterListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'academicMaster/topics',
                loadComponent : () => TopicListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'academicDocument/academyEnclosureDocument',
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
                path: 'business/countries',
                loadComponent : () => CountryListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'business/stateRegions',
                loadComponent : () => StateRegionListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'business/districts',
                loadComponent : () => DistrictListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'business/cities',
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
            {
                path: 'business/businessPartner/detail/:uuid',
                loadComponent: () => BusinessPartnerDetailComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'business/tieUpSchools',
                loadComponent : () => TieUpSchoolListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'business/tieUpSchool/detail/:uuid',
                loadComponent: () => TieUpSchoolDetailComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'business/studyCenters',
                loadComponent: () => StudyCenterListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'business/studyCenter/add/:id',
                loadComponent: () => StudyCenterAddComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'business/studyCenter/detail/:uuid',
                loadComponent: () => StudyCenterDetailComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'business/schools',
                loadComponent: () => SchoolListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'business/school/detail/:uuid',
                loadComponent: () => SchoolDetailComponent,
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
            },
            {
                path: 'pages',
                loadChildren: () => import('./demo/pages/select-module/select-module.module').then((m) => m.SelectModule)
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
