import { TemplateRef } from '@angular/core';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  cellTemplate?: TemplateRef<unknown>;
  width?: string;
  classes?: string;
}

export interface TableConfig {
  pageSize: number;
  selectable: boolean;
  searchable: boolean;
}
