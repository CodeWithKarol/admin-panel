import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeCustomizer } from './theme-customizer';
import { ThemeService, BrandColor } from '../../../core/theme/theme.service';
import { LucideAngularModule } from 'lucide-angular';
import { signal } from '@angular/core';

describe('ThemeCustomizer', () => {
  let component: ThemeCustomizer;
  let fixture: ComponentFixture<ThemeCustomizer>;
  let mockThemeService: any;

  beforeEach(async () => {
    mockThemeService = {
      setBrandColor: vi.fn(),
      brandColor: signal('indigo' as BrandColor),
      isDarkMode: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [ThemeCustomizer, LucideAngularModule],
      providers: [{ provide: ThemeService, useValue: mockThemeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeCustomizer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle visibility', () => {
    expect(component.isOpen()).toBe(false);
    component.toggle();
    expect(component.isOpen()).toBe(true);
  });

  it('should call service when color selected', () => {
    component.selectColor('orange');
    expect(mockThemeService.setBrandColor).toHaveBeenCalledWith('orange');
    expect(component.isOpen()).toBe(false);
  });
});
