import { Component, OnInit } from '@angular/core';
import {GroupsService} from "../../../services/groups.service";
import {Call, CallsService} from "../../../services/calls.service";
import {UsersService} from "../../../services/users.service";
import {CurrentUserService} from "../../../services/current-user.service";

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.scss']
})
export class GroupPageComponent implements OnInit {

  constructor(public gs: GroupsService, public us: UsersService, private cs: CallsService,
              private cu: CurrentUserService) { }

  ngOnInit(): void {
  }

  callNow() {
    const recipient = this.gs.selectedGroupId;
    const callInfo: Call = {
      initiatedBy: this.cu.user.id,
      name: "Private call"
    };
    this.cs.createCall(recipient, callInfo);
  }

}
