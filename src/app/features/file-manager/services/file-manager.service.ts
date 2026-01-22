import { Injectable, signal } from '@angular/core';

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'document' | 'video';
  size: string;
  modified: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  private _files = signal<FileItem[]>([
    {
      id: '1',
      name: 'Marketing Assets',
      type: 'folder',
      size: '-',
      modified: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Q4 Report.pdf',
      type: 'document',
      size: '2.5 MB',
      modified: new Date('2024-01-20'),
    },
    {
      id: '3',
      name: 'Banner.png',
      type: 'image',
      size: '1.2 MB',
      modified: new Date('2024-01-21'),
    },
    {
      id: '4',
      name: 'Team Photo.jpg',
      type: 'image',
      size: '4.5 MB',
      modified: new Date('2024-01-22'),
    },
    {
      id: '5',
      name: 'Project Demo.mp4',
      type: 'video',
      size: '150 MB',
      modified: new Date('2024-01-10'),
    },
  ]);

  files = this._files.asReadonly();

  uploadFile(file: File) {
    // Simulate upload
    const newFile: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: this.determineType(file.type),
      size: this.formatSize(file.size),
      modified: new Date(),
    };

    setTimeout(() => {
      this._files.update((files) => [...files, newFile]);
    }, 1000); // Simulate network delay
  }

  deleteFile(id: string) {
    this._files.update((files) => files.filter((f) => f.id !== id));
  }

  private determineType(mime: string): FileItem['type'] {
    if (mime.startsWith('image')) return 'image';
    if (mime.startsWith('video')) return 'video';
    return 'document';
  }

  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
