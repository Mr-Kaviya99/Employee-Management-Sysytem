import {Component, OnInit} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {debounceTime} from "rxjs";
import {RequestEmployeeDTO} from "../../../../../../share/dto/request/RequestEmployeeDTO";
import {UserTypeService} from "../../../../../../share/services/user-type/user-type.service";
import {SnackBarService} from "../../../../../../share/services/snack-bar/snack-bar.service";
import {MatDialog} from "@angular/material/dialog";
import {EmployeeService} from "../../../../../../share/services/employee/employee.service";
import {BranchService} from "../../../../../../share/services/branch/branch.service";
import {
    ConfirmToProceedComponent
} from "../../../../../../share/Widgets/pop-up/confirm-to-proceed/confirm-to-proceed.component";
import {ViewEmployeeComponent} from "../view-employee/view-employee.component";

@Component({
    selector: 'app-employee-management-context',
    templateUrl: './employee-management-context.component.html',
    styleUrls: ['./employee-management-context.component.scss']
})
export class EmployeeManagementContextComponent implements OnInit {

    page: number | undefined = 0;
    pageSize: number | undefined = 5;
    pageSizeOptions = [1, 2, 5, 10, 20, 30, 50];
    dataCount = 0;
    pageEvent: PageEvent | undefined;

    employees: any = [];
    branches: any;
    userTypes: any;

    branch: string = '';
    userType: string = '';
    employmentState: string = 'ALL';
    employeeAvailability: string = 'ALL';

    form = new FormGroup({
        branch: new FormControl(null, [Validators.required]),
        userType: new FormControl(null, [Validators.required]),
        employee: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        mobile: new FormControl(null, [Validators.required]),
        house: new FormControl(null, [Validators.required]),
        street: new FormControl(null, [Validators.required]),
        city: new FormControl(null, [Validators.required]),
        postal: new FormControl(null, [Validators.required]),
        country: new FormControl(null, [Validators.required])
    });

    searchForm = new FormGroup({
        branch: new FormControl(''),
        userType: new FormControl(''),
        employmentState: new FormControl(this.employmentState),
        employeeAvailability: new FormControl(this.employeeAvailability)
    });

    constructor(
        private employeeService: EmployeeService,
        private branchService: BranchService,
        private userTypeService: UserTypeService,
        private snackBarService: SnackBarService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.loadAllBranches();
        this.loadAllUserTypes();
        this.getAllEmployees();

        this.searchForm.valueChanges
            .pipe(debounceTime(500))
            .subscribe(data => {
                // @ts-ignore
                this.branch = data.branch;
                // @ts-ignore
                this.userType = data.userType;
                // @ts-ignore
                this.employmentState = data.employmentState;
                // @ts-ignore
                this.employeeAvailability = data.employeeAvailability;
                this.getAllEmployees();
            });
    }

    loadAllBranches() {
        this.branchService.allBranches().subscribe(response => {
            this.branches = response.data;
        }, error => {
            this.snackBarService.openErrorSnackBar('Something went wrong!', 'Close');
        })
    }

    loadAllUserTypes() {
        this.userTypeService.allUserTypes().subscribe(response => {
            this.userTypes = response.data;
        }, error => {
            this.snackBarService.openErrorSnackBar('Something went wrong!', 'Close');
        })
    }

    public getServerData(event?: PageEvent): any {
        this.pageSize = event?.pageSize;
        this.page = event?.pageIndex;
        this.getAllEmployees();
    }

    createEmployee(f: FormGroupDirective) {
        const branchId = this.form.get('branch')?.value!;
        const userTypeId = this.form.get('userType')?.value!;

        let employee = new RequestEmployeeDTO(
            this.form.get('employee')?.value!,
            this.form.get('email')?.value!,
            this.form.get('mobile')?.value!,
            this.form.get('house')?.value! + ', ' + this.form.get('street')?.value! + ', ' + this.form.get('city')?.value! + ', ' + this.form.get('postal')?.value! + ', ' + this.form.get('country')?.value!,
        )
        this.employeeService.newEmployee(employee, branchId, userTypeId).subscribe(response => {
            if (response.code === 201) {
                this.snackBarService.openSuccessSnackBar('Success!', 'Close');
                this.refreshForm(f);
            }
        })
    }

    getAllEmployees() {
        this.employeeService.allEmployees(this.employmentState, this.employeeAvailability, this.branch, this.userType).subscribe(response => {
            this.employees = response.data;
        }, error => {
            this.snackBarService.openErrorSnackBar('Something went wrong!', 'Close');
        })
    }

    terminatePopUp(propertyId: any, employmentState: boolean) {
        const dialogRef = this.dialog.open(ConfirmToProceedComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.employeeService.changeEmployment(propertyId, !employmentState).subscribe(response => {
                    console.log(response)
                    if (response?.code == 200) {
                        this.snackBarService.openSuccessSnackBar('Changed', 'Close');
                        this.getAllEmployees();
                    } else {
                        this.snackBarService.openErrorSnackBar('Something went wrong!', 'Close');
                    }
                }, error => {
                    this.snackBarService.openErrorSnackBar('Something went wrong!', 'Close');
                })
            }
        });
    }

    viewPopUp(propertyId: any) {
        this.dialog.open(ViewEmployeeComponent, {
            data: propertyId,
            width: '800px'
        });

    }

    DisablePopUp(propertyId: any, activeState: boolean) {
        const dialogRef = this.dialog.open(ConfirmToProceedComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.employeeService.changeState(propertyId, !activeState).subscribe(response => {
                    console.log(response)
                    if (response?.code == 200) {
                        this.snackBarService.openSuccessSnackBar('Changed', 'Close');
                        this.getAllEmployees();
                    } else {
                        this.snackBarService.openErrorSnackBar('Something went wrong!', 'Close');
                    }
                }, error => {
                    this.snackBarService.openErrorSnackBar('Something went wrong!', 'Close');
                })
            }
        });
    }

    private refreshForm(form: FormGroupDirective) {
        form.resetForm();
        form.reset();
    }
}