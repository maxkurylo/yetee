import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  mockOtherMessagesTime = new Date().toLocaleTimeString();
  mockMyMessagesTime = new Date(Date.now() - 43 * 1000).toLocaleTimeString();

  constructor() { }

  ngOnInit(): void {
  }

}
