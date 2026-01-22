import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import {
  LucideAngularModule,
  Send,
  Phone,
  Video,
  Info,
  Paperclip,
  MessageSquare,
} from 'lucide-angular';

@Component({
  selector: 'app-chat-page',
  imports: [DatePipe, LucideAngularModule],
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatPage {
  private chatService = inject(ChatService);

  readonly Send = Send;
  readonly Phone = Phone;
  readonly Video = Video;
  readonly Info = Info;
  readonly Paperclip = Paperclip;
  readonly MessageSquare = MessageSquare;

  users = this.chatService.users;
  currentUser = this.chatService.currentUser;
  messages = this.chatService.currentMessages;

  selectUser(id: string) {
    this.chatService.selectUser(id);
  }

  sendMessage(input: HTMLInputElement) {
    if (input.value.trim()) {
      this.chatService.sendMessage(input.value);
      input.value = '';
    }
  }
}
