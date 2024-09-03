import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectModuleComponent } from './select-module.component';

const routes: Routes = [
    {
        path: 'module-selection',
        component: SelectModuleComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SelectModuleRoutingModule {}
