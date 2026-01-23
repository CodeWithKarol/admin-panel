import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with users', () => {
    expect(service.users().length).toBeGreaterThan(0);
  });

  it('should select user and load messages', () => {
    const userId = service.users()[0].id;
    service.selectUser(userId);

    expect(service.currentUser()?.id).toBe(userId);
    // Messages might be empty or not depending on mock data, checking array exists
    expect(Array.isArray(service.currentMessages())).toBe(true);
  });

  it('should send message', () => {
    const userId = service.users()[0].id;
    service.selectUser(userId);

    const initialCount = service.currentMessages().length;
    service.sendMessage('Test Message');

    expect(service.currentMessages().length).toBe(initialCount + 1);
    expect(service.currentMessages()[initialCount].text).toBe('Test Message');
  });
});
