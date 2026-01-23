import { Injectable, signal } from '@angular/core';

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastMessage?: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _users = signal<ChatUser[]>([
    {
      id: '1',
      name: 'User 1',
      avatar: 'https://i.pravatar.cc/150?u=1',
      status: 'online',
      lastMessage: 'Hey, how are you?',
      unreadCount: 2,
    },
    {
      id: '2',
      name: 'User 2',
      avatar: 'https://i.pravatar.cc/150?u=2',
      status: 'busy',
      lastMessage: 'Can we meet later?',
      unreadCount: 0,
    },
    {
      id: '3',
      name: 'User 3',
      avatar: 'https://i.pravatar.cc/150?u=3',
      status: 'offline',
      lastMessage: 'Thanks for the help!',
      unreadCount: 0,
    },
  ]);

  private _messages = signal<ReadonlyMap<string, ChatMessage[]>>(new Map());

  users = this._users.asReadonly();

  currentUser = signal<ChatUser | null>(null);
  currentMessages = signal<ChatMessage[]>([]);

  constructor() {
    // Initialize some dummy messages
    const initialMap = new Map<string, ChatMessage[]>();
    initialMap.set('1', [
      {
        id: '1',
        senderId: '1',
        text: 'Hey, how are you?',
        timestamp: new Date(Date.now() - 3600000),
        isMe: false,
      },
      {
        id: '2',
        senderId: 'me',
        text: 'I am good, thanks!',
        timestamp: new Date(Date.now() - 3500000),
        isMe: true,
      },
    ]);
    this._messages.set(initialMap);
  }

  selectUser(userId: string) {
    const user = this._users().find((u) => u.id === userId);
    if (user) {
      this.currentUser.set(user);
      const msgs = this._messages().get(userId) || [];
      this.currentMessages.set(msgs);

      // Clear unread
      this._users.update((users) =>
        users.map((u) => (u.id === userId ? { ...u, unreadCount: 0 } : u)),
      );
    }
  }

  sendMessage(text: string) {
    const currentUser = this.currentUser();
    if (!currentUser || !text.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date(),
      isMe: true,
    };

    const currentMap = new Map(this._messages());
    const userMsgs = currentMap.get(currentUser.id) || [];

    const updatedMsgs = [...userMsgs, newMessage];
    currentMap.set(currentUser.id, updatedMsgs);

    this._messages.set(currentMap);
    this.currentMessages.set(updatedMsgs);

    // Simulate reply
    setTimeout(() => {
      const reply: ChatMessage = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        text: 'This is an automated reply.',
        timestamp: new Date(),
        isMe: false,
      };
      const map = new Map(this._messages());
      const msgs = map.get(currentUser.id) || [];
      const newMsgs = [...msgs, reply];
      map.set(currentUser.id, newMsgs);
      this._messages.set(map);

      if (this.currentUser()?.id === currentUser.id) {
        this.currentMessages.set(newMsgs);
      }
    }, 2000);
  }
}
