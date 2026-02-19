import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivePersonnelComponent } from './active-personnel';
import { InspectorService } from '../../../../core/services/inspector/inspector.service';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { TeamMember } from '../../../../core/models/analytics.models';

describe('ActivePersonnelComponent', () => {
  let component: ActivePersonnelComponent;
  let fixture: ComponentFixture<ActivePersonnelComponent>;
  let mockInspector: { open: (data: unknown, type: string) => void };
  let mockNav: { navigateWithManifest: (path: string) => void };

  beforeEach(async () => {
    mockInspector = { open: vi.fn() };
    mockNav = { navigateWithManifest: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ActivePersonnelComponent],
      providers: [
        { provide: InspectorService, useValue: mockInspector },
        { provide: NavigationService, useValue: mockNav },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivePersonnelComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('members', [
      { id: '1', name: 'User 1', role: 'Role 1', activeTasks: 5, avatar: '' },
    ]);
    fixture.detectChanges();
  });

  it('should open inspector for member', () => {
    const member = { id: '1' } as TeamMember;
    component.openInspector(member);
    expect(mockInspector.open).toHaveBeenCalledWith(member, 'user');
  });

  it('should navigate to team on viewFullRoster', () => {
    component.viewFullRoster();
    expect(mockNav.navigateWithManifest).toHaveBeenCalledWith('/team');
  });
});
