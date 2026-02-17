import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormComponent } from './user-form';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Save, X, Fingerprint } from 'lucide-angular';
import { TeamMember } from '../../../../core/models/analytics.models';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  const mockUser: TeamMember & { bio?: string } = {
    id: '123',
    name: 'Test Operator',
    role: 'Test Architect',
    squad: 'AXON_CORE',
    specializations: ['SPEC1', 'SPEC2'],
    avatar: 'https://i.pravatar.cc/150?u=123',
    status: 'online',
    activeTasks: 5,
    completedTasks: 10,
    bio: 'Test Bio'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserFormComponent,
        FormsModule,
        LucideAngularModule.pick({ Save, X, Fingerprint })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with user data when provided (Edit Mode)', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.formData.name).toBe(mockUser.name);
    expect(component.formData.role).toBe(mockUser.role);
    expect(component.formData.status).toBe(mockUser.status);
    expect(component.formData.bio).toBe(mockUser.bio);
    expect(component.specInput).toBe(mockUser.specializations.join(', '));
  });

  it('should process specialization input into array', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
    component.ngOnInit();

    const saveSpy = vi.fn();
    component.identityCommitted.subscribe(saveSpy);

    component.specInput = ' TAG1, TAG2 , tag3 ';
    component.submit();

    const emitted = saveSpy.mock.calls[0][0];
    expect(emitted.specializations).toEqual(['TAG1', 'TAG2', 'TAG3']);
  });

  it('should initialize with empty data when user is null (Create Mode)', () => {
    fixture.componentRef.setInput('user', null);
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.formData.name).toBe('');
    expect(component.formData.role).toBe('');
    expect(component.formData.status).toBe('online');
    expect(component.formData.bio).toBe('');
  });

  it('should emit updated user on submit in edit mode', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
    component.ngOnInit();

    const saveSpy = vi.fn();
    component.identityCommitted.subscribe(saveSpy);

    component.formData.name = 'Updated Name';
    component.submit();

    expect(saveSpy).toHaveBeenCalledWith({
      ...mockUser,
      name: 'Updated Name'
    });
  });

  it('should emit new user with generated ID on submit in create mode', () => {
    fixture.componentRef.setInput('user', null);
    fixture.detectChanges();
    component.ngOnInit();

    const saveSpy = vi.fn();
    component.identityCommitted.subscribe(saveSpy);

    component.formData.name = 'New Operator';
    component.formData.role = 'New Role';
    component.submit();

    const emitted = saveSpy.mock.calls[0][0];
    expect(emitted.id).toBeDefined();
    expect(emitted.name).toBe('New Operator');
    expect(emitted.role).toBe('New Role');
    expect(emitted.activeTasks).toBe(0);
    expect(emitted.completedTasks).toBe(0);
    expect(emitted.avatar).toContain(emitted.id);
  });

  it('should emit identityAborted event', () => {
    const cancelSpy = vi.fn();
    component.identityAborted.subscribe(cancelSpy);
    component.identityAborted.emit();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
