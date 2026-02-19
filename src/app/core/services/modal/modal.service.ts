import { Injectable, signal, TemplateRef, Type } from '@angular/core';

export interface ModalConfig {
  title: string;
  data?: unknown;
  component?: Type<unknown>;
  template?: TemplateRef<unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  isOpen = signal(false);
  config = signal<ModalConfig | null>(null);

  open(config: ModalConfig) {
    this.config.set(config);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.config.set(null);
  }
}
