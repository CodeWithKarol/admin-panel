import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileManagerPage } from './file-manager-page';
import { FileManagerService } from '../../services/file-manager.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { signal } from '@angular/core';

describe('FileManagerPage', () => {
  let component: FileManagerPage;
  let fixture: ComponentFixture<FileManagerPage>;
  let fileManagerServiceSpy: {
    files: ReturnType<typeof signal>;
    deleteFile: ReturnType<typeof vi.fn>;
    uploadFile: ReturnType<typeof vi.fn>;
  };
  let notificationServiceSpy: { add: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    fileManagerServiceSpy = {
      files: signal([]),
      deleteFile: vi.fn(),
      uploadFile: vi.fn(),
    };

    notificationServiceSpy = {
      add: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FileManagerPage],
      providers: [
        { provide: FileManagerService, useValue: fileManagerServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileManagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle drag over event', () => {
    const event = {
      type: 'dragover',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent;

    component.onDragOver(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.isDragOver()).toBe(true);
  });

  it('should handle drag leave event', () => {
    component.isDragOver.set(true);
    const event = {
      type: 'dragleave',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent;

    component.onDragLeave(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.isDragOver()).toBe(false);
  });

  it('should handle drop event', () => {
    component.isDragOver.set(true);
    const event = {
      type: 'drop',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        files: [new File([''], 'test.png', { type: 'image/png' })],
      },
    } as unknown as DragEvent;

    component.onDrop(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.isDragOver()).toBe(false);
    expect(fileManagerServiceSpy.uploadFile).toHaveBeenCalled();
    expect(notificationServiceSpy.add).toHaveBeenCalled();
  });

  it('should delete file when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteFile('123');
    expect(fileManagerServiceSpy.deleteFile).toHaveBeenCalledWith('123');
    expect(notificationServiceSpy.add).toHaveBeenCalled();
  });

  it('should NOT delete file when NOT confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.deleteFile('123');
    expect(fileManagerServiceSpy.deleteFile).not.toHaveBeenCalled();
  });
});
