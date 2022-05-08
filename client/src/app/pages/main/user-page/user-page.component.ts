import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../../services/users.service";
import {Call, CallsService} from "../../../services/calls.service";
import {CurrentUserService} from "../../../services/current-user.service";

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  constructor(public us: UsersService, private cs: CallsService, private cu: CurrentUserService) { }

  ngOnInit(): void {
  }

  callNow() {
    const recipient = this.us.selectedUser?.id || '';
    const callInfo: Call = {
      initiatedBy: this.cu.user.id,
      name: "Private call"
    };
    this.cs.createCall(recipient, callInfo);
  }

}
