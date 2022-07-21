import {Component, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {take, takeUntil} from "rxjs/operators";
import {ReplaySubject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User, UsersService} from "../../services/users.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EventEmitter} from "@angular/core";
import {GroupCreation, GroupsService} from "../../services/groups.service";
import {CurrentUserService} from "../../services/current-user.service";
import {CompaniesService} from "../../services/companies.service";

@Component({
    selector: 'app-create-group-dialog',
    templateUrl: './create-group-dialog.component.html',
    styleUrls: ['./create-group-dialog.component.scss']
})
export class CreateGroupDialogComponent implements OnInit, OnDestroy {
    @Input() set showDialog(show: boolean) {
        if (show) {
            this.dialog.open(this.createGroupDialogTemplate, { disableClose: true });
        } else {
            this.dialog.closeAll();
        }
    }
    @Output() showDialogChange = new EventEmitter<boolean>();

    @ViewChild('createGroupDialogTemplate') createGroupDialogTemplate: TemplateRef<any>;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    availableUsers: User[] = [];
    participants: Set<string> = new Set<string>([this.cu.user.id]);

    groupCreationForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
    });

    constructor(private us: UsersService, private dialog: MatDialog, private gs: GroupsService,
                private cu: CurrentUserService, private companiesService: CompaniesService) {
        this.availableUsers = this.us.allUsers.filter(u => u.id !== this.cu.user.id);
    }

    ngOnInit(): void {
        this.dialog.afterAllClosed.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.groupCreationForm.reset();
        });
    }

    closeCreateGroupDialog() {
        this.showDialogChange.emit(false);
    }

    editParticipants(e: any, userId: string) {
        if (e.checked) {
            this.participants.add(userId);
        } else {
            this.participants.delete(userId);
        }
    }


    createGroup() {
        const group: GroupCreation = {
            name: this.groupCreationForm.controls.name.value,
            participants: Array.from(this.participants),
            companyId: this.companiesService.selectedCompany?.id,
        };
        this.gs.createGroup(group).pipe(take(1)).subscribe(res => {
            console.log('GROUP CREATED!!!');
        },
        (err) => {
            console.log(err);
        });
        this.closeCreateGroupDialog();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
