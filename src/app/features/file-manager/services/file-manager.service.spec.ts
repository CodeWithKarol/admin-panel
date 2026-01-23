import { TestBed } from '@angular/core/testing';
import { FileManagerService } from './file-manager.service';
import { vi } from 'vitest';

describe('FileManagerService', () => {
  let service: FileManagerService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileManagerService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default files', () => {
    expect(service.files().length).toBeGreaterThan(0);
  });

  it('should delete a file', () => {
    const initialCount = service.files().length;
    const fileId = service.files()[0].id;

    service.deleteFile(fileId);

    expect(service.files().length).toBe(initialCount - 1);
    expect(service.files().find((f) => f.id === fileId)).toBeUndefined();
  });

  it('should upload a file', () => {
    const initialCount = service.files().length;
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });

    service.uploadFile(file);

    // Should wait for delay
    expect(service.files().length).toBe(initialCount);

    vi.advanceTimersByTime(1000);

    expect(service.files().length).toBe(initialCount + 1);
    const uploaded = service.files()[service.files().length - 1];
    expect(uploaded.name).toBe('test.txt');
  });
});
