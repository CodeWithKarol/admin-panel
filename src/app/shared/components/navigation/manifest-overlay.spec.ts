import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManifestOverlayComponent } from './manifest-overlay';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { signal } from '@angular/core';

describe('ManifestOverlayComponent', () => {
  let component: ManifestOverlayComponent;
  let fixture: ComponentFixture<ManifestOverlayComponent>;
  let navService: { isTransitioning: ReturnType<typeof signal<boolean>> };

  beforeEach(async () => {
    navService = {
      isTransitioning: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [ManifestOverlayComponent],
      providers: [{ provide: NavigationService, useValue: navService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ManifestOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should expose isTransitioning signal from NavigationService', () => {
    navService.isTransitioning.set(true);
    expect(component.isTransitioning()).toBe(true);

    navService.isTransitioning.set(false);
    expect(component.isTransitioning()).toBe(false);
  });
});
