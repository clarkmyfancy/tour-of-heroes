import { Component, OnInit } from '@angular/core';

import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(
    // the msgService is public because it needs to be bound to the template
    public messageService: MessageService
  ) { }

  ngOnInit() {
  }

}
