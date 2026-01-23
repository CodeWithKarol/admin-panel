import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatPage } from './chat-page';
import { ChatService } from '../../services/chat.service';
import { signal, WritableSignal } from '@angular/core';
import { ChatMessage, ChatUser } from '../../services/chat.service';

describe('ChatPage', () => {
  let component: ChatPage;
  let fixture: ComponentFixture<ChatPage>;
  let chatServiceSpy: {
    users: WritableSignal<ChatUser[]>;
    currentUser: WritableSignal<ChatUser | null>;
    currentMessages: WritableSignal<ChatMessage[]>;
    selectUser: ReturnType<typeof vi.fn>;
    sendMessage: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    chatServiceSpy = {
      users: signal([]),
      currentUser: signal(null),
      currentMessages: signal([]),
      selectUser: vi.fn(),
      sendMessage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ChatPage],
      providers: [{ provide: ChatService, useValue: chatServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectUser on service', () => {
    component.selectUser('1');
    expect(chatServiceSpy.selectUser).toHaveBeenCalledWith('1');
  });

  it('should call sendMessage on service when input is valid', () => {
    const input = document.createElement('input');
    input.value = 'test message';
    component.sendMessage(input);

    expect(chatServiceSpy.sendMessage).toHaveBeenCalledWith('test message');
    expect(input.value).toBe('');
  });

  it('should not call sendMessage when input is empty', () => {
    const input = document.createElement('input');
    input.value = '   ';
    component.sendMessage(input);

    expect(chatServiceSpy.sendMessage).not.toHaveBeenCalled();
  });
});
