import { TestBed } from '@angular/core/testing';
import { InspectorService } from './inspector.service';

describe('InspectorService', () => {
  let service: InspectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InspectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with closed state and null data', () => {
    expect(service.isOpen()).toBe(false);
    expect(service.activeData()).toBeNull();
    expect(service.activeType()).toBeNull();
    expect(service.isCreating()).toBe(false);
  });

  it('should update state when open is called', () => {
    const mockData = { id: 1, name: 'Test User' };
    service.open(mockData, 'user');

    expect(service.isOpen()).toBe(true);
    expect(service.activeData()).toEqual(mockData);
    expect(service.activeType()).toBe('user');
    expect(service.isCreating()).toBe(false);
  });

  it('should update state when initializeNew is called', () => {
    service.initializeNew('user');

    expect(service.isOpen()).toBe(true);
    expect(service.isCreating()).toBe(true);
    expect(service.activeData()).toBeNull();
    expect(service.activeType()).toBe('user');
  });

  it('should update state when close is called', () => {
    service.open({ some: 'data' }, 'milestone');
    expect(service.isOpen()).toBe(true);

    service.close();
    expect(service.isOpen()).toBe(false);
    expect(service.isCreating()).toBe(false);
  });
});
