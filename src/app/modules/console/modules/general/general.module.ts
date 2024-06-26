import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { GeneralComponent } from './general.component';
import { BranchManagementContextComponent } from './components/branch-management/branch-management-context/branch-management-context.component';
import { EmployeeManagementContextComponent } from './components/employee-management/employee-management-context/employee-management-context.component';
import { SalaryManagementContextComponent } from './components/salary-management/salary-management-context/salary-management-context.component';
import { UserTypeManagementContextComponent } from './components/user-type-management/user-type-management-context/user-type-management-context.component';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import { ViewEmployeeComponent } from './components/employee-management/view-employee/view-employee.component';
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    GeneralComponent,
    BranchManagementContextComponent,
    EmployeeManagementContextComponent,
    SalaryManagementContextComponent,
    UserTypeManagementContextComponent,
    ViewEmployeeComponent
  ],
    imports: [
        CommonModule,
        GeneralRoutingModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatPaginatorModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        FormsModule
    ]
})
export class GeneralModule { }
