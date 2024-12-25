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
import { UserDetailComponent } from './demo/user/user-detail/user-detail.component';
import { B2cApplicationListComponent } from './demo/admission/b2c-application/b2c-application-list/b2c-application-list.component';
import { B2cApplicationStageOneComponent } from './demo/admission/b2c-application/b2c-application-stage-one/b2c-application-stage-one.component';
import { B2cApplicationDeatilComponent } from './demo/admission/b2c-application/b2c-application-deatil/b2c-application-deatil.component';
import { B2cApplicationStageTwoComponent } from './demo/admission/b2c-application/b2c-application-stage-two/b2c-application-stage-two.component';
import { B2cApplicationStageThreeComponent } from './demo/admission/b2c-application/b2c-application-stage-three/b2c-application-stage-three.component';
import { B2cApplicationStageFourComponent } from './demo/admission/b2c-application/b2c-application-stage-four/b2c-application-stage-four.component';
import { B2cApplicationStageFiveComponent } from './demo/admission/b2c-application/b2c-application-stage-five/b2c-application-stage-five.component';
import { BlankAdmissionFormComponent } from './demo/admission/blank-admission-form/blank-admission-form.component';
import { UserModuleAccessibilityComponent } from './demo/user/user-module-accessibility/user-module-accessibility.component';
import { FeePaymentListComponent } from './demo/admission/fee-payment/fee-payment-list/fee-payment-list.component';
import { FeePaymentDetailComponent } from './demo/admission/fee-payment/fee-payment-detail/fee-payment-detail.component';

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
                path: 'user/users',
                loadComponent : () => UserListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'user/detail/:uuid',
                loadComponent : () => UserDetailComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'user/accessibility/:uuid/:moduleId',
                loadComponent : () => UserModuleAccessibilityComponent,
                canActivate: [AuthGuardService],
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
            {
                path: 'b2cApplication/blankForm',
                loadComponent : () => BlankAdmissionFormComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'b2cApplication/admissions',
                loadComponent : () => B2cApplicationListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'b2cApplication/detail/:applicationFor/:uuid',
                loadComponent : () => B2cApplicationDeatilComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'b2cApplication/b2cApplicationStage1/add',
                loadComponent : () => B2cApplicationStageOneComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'b2cApplication/b2cApplicationStage2/add/:uuid',
                loadComponent : () => B2cApplicationStageTwoComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'b2cApplication/b2cApplicationStage3/add/:uuid',
                loadComponent : () => B2cApplicationStageThreeComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'b2cApplication/b2cApplicationStage4/add/:uuid',
                loadComponent : () => B2cApplicationStageFourComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'b2cApplication/b2cApplicationStage5/add/:uuid',
                loadComponent : () => B2cApplicationStageFiveComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'feeCollections',
                loadComponent : () => FeePaymentListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'feeCollection/detail/:uuid',
                loadComponent : () => FeePaymentDetailComponent,
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
