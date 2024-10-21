// angular import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { UserListComponent } from './demo/user/user-list/user-list.component';
import { AuthGuardService } from './theme/shared/service/auth-guard.service';
import { TaxTypeListComponent } from './demo/application-master/tax-type/tax-type-list/tax-type-list.component';
import { FeeTypeListComponent } from './demo/application-master/fee-type/fee-type-list/fee-type-list.component';
import { DiscountTypeListComponent } from './demo/application-master/discount-type/discount-type-list/discount-type-list.component';
import { TaxRateListComponent } from './demo/application-master/tax-rate/tax-rate-list/tax-rate-list.component';
import { StudentDocumentListComponent } from './demo/application-master/student-document/student-document-list/student-document-list.component';
import { FeeCategoryListComponent } from './demo/application-master/fee-category/fee-category-list/fee-category-list.component';
import { CourseExitReasonListComponent } from './demo/application-master/course-exit-reason/course-exit-reason-list/course-exit-reason-list.component';
import { GradeSectionListComponent } from './demo/application-master/grade-section/grade-section-list/grade-section-list.component';
import { SubjectGroupListComponent } from './demo/application-master/subject-group-allocation/subject-group-list/subject-group-list.component';
import { SubjectGroupDetailComponent } from './demo/application-master/subject-group-allocation/subject-group-detail/subject-group-detail.component';
import { FeeStructureAddComponent } from './demo/application-master/fee-structure/fee-structure-add/fee-structure-add.component';
import { FeeStructureListComponent } from './demo/application-master/fee-structure/fee-structure-list/fee-structure-list.component';
import { FeeStructureDetailComponent } from './demo/application-master/fee-structure/fee-structure-detail/fee-structure-detail.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                redirectTo: '/auth/signin/:uuid/:moduleId',
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
                path: 'admissionMaster/taxTypes',
                loadComponent : () => TaxTypeListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admissionMaster/feeTypes',
                loadComponent : () => FeeTypeListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admissionMaster/discountTypes',
                loadComponent : () => DiscountTypeListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admissionMaster/taxRates',
                loadComponent : () => TaxRateListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admissionMaster/studentDocuments',
                loadComponent : () => StudentDocumentListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admissionMaster/feeCategories',
                loadComponent : () => FeeCategoryListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admissionMaster/courseExitReasons',
                loadComponent : () => CourseExitReasonListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admissionMaster/gradeSections',
                loadComponent : () => GradeSectionListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admissionMaster/subjectGroups',
                loadComponent : () => SubjectGroupListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admissionMaster/subjectGroup/detail/:id',
                loadComponent : () => SubjectGroupDetailComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admissionMaster/feeStructures',
                loadComponent : () => FeeStructureListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admissionMaster/feeStructure/add',
                loadComponent : () => FeeStructureAddComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admissionMaster/feeStructure/detail/:uuid',
                loadComponent : () => FeeStructureDetailComponent,
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
        ]
    },  
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash : true})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
