/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandPaletteComponent } from './command-palette';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/theme/theme.service';
import { AuthService } from '../../../core/auth/auth-service';
import { LayoutService } from '../../../core/layout/layout-service';
import { LucideAngularModule } from 'lucide-angular';
import { signal } from '@angular/core';

describe('CommandPaletteComponent', () => {
  let component: CommandPaletteComponent;
  let fixture: ComponentFixture<CommandPaletteComponent>;
  let mockLayoutService: any;
  let mockThemeService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockLayoutService = {
      toggleCommandPalette: vi.fn(),
      openCommandPalette: vi.fn(),
      closeCommandPalette: vi.fn(),
      isCommandPaletteOpen: signal(false),
    };

    mockThemeService = {
      isDarkMode: signal(false),
      toggleDarkMode: vi.fn(),
    };

    mockAuthService = {
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CommandPaletteComponent, LucideAngularModule],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: LayoutService, useValue: mockLayoutService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle palette via service', () => {
    // We can't easily trigger the HostListener without dispatching window events
    // But we can call the toggle method directly if it was public (it is protected).
    // In unit tests, we can cast to any to access protected members if needed,
    // or rely on HostListeners triggering.

    // Dispatch event
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
    window.dispatchEvent(event);

    expect(mockLayoutService.toggleCommandPalette).toHaveBeenCalled();
  });

  it('should filter items based on query', () => {
    (component as any).query.set('Dash');
    fixture.detectChanges();
    // Access the computed signal
    const items = (component as any).filteredItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].label).toBe('Dashboard');
  });
});
