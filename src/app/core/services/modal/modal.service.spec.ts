import { TestBed } from '@angular/core/testing';
import { ModalService, ModalConfig } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalService],
    });
    service = TestBed.inject(ModalService);
  });

  it('should start closed', () => {
    expect(service.isOpen()).toBe(false);
    expect(service.config()).toBeNull();
  });

  it('should open with config', () => {
    const config: ModalConfig = { title: 'Test Modal' };
    service.open(config);
    expect(service.isOpen()).toBe(true);
    expect(service.config()).toEqual(config);
  });

  it('should close and reset config', () => {
    service.open({ title: 'Test' });
    service.close();
    expect(service.isOpen()).toBe(false);
    expect(service.config()).toBeNull();
  });
});
