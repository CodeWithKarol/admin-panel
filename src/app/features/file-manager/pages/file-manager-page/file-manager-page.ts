import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  LucideAngularModule,
  Upload,
  FileText,
  Image,
  Video,
  Folder,
  Trash2,
  Cloud,
} from 'lucide-angular';
import { FileManagerService } from '../../services/file-manager.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-file-manager-page',
  imports: [DatePipe, LucideAngularModule],
  templateUrl: './file-manager-page.html',
  styleUrl: './file-manager-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerPage {
  private fileService = inject(FileManagerService);
  private notificationService = inject(NotificationService);

  readonly Upload = Upload;
  readonly FileText = FileText;
  readonly Image = Image;
  readonly Video = Video;
  readonly Folder = Folder;
  readonly Trash2 = Trash2;
  readonly Cloud = Cloud;

  files = this.fileService.files;
  isDragOver = signal(false);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFiles(input.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    if (event.dataTransfer?.files.length) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  deleteFile(id: string) {
    if (confirm('Are you sure you want to delete this file?')) {
      this.fileService.deleteFile(id);
      this.notificationService.add({
        title: 'File Manager',
        message: 'File deleted successfully',
        type: 'success',
      });
    }
  }

  private handleFiles(files: FileList) {
    Array.from(files).forEach((file) => {
      this.fileService.uploadFile(file);
    });
    this.notificationService.add({
      title: 'File Manager',
      message: `${files.length} file(s) uploading in background...`,
      type: 'info',
    });
  }
}
