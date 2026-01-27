import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Skeleton } from './skeleton';
import { By } from '@angular/platform-browser';

describe('Skeleton', () => {
  let component: Skeleton;
  let fixture: ComponentFixture<Skeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Skeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(Skeleton);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply width and height styles via signal inputs', () => {
    fixture.componentRef.setInput('width', '50px');
    fixture.componentRef.setInput('height', '20px');
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles['width']).toBe('50px');
    expect(element.styles['height']).toBe('20px');
  });

  it('should apply custom class', () => {
    fixture.componentRef.setInput('className', 'custom-class');
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('div'));
    expect(element.nativeElement.classList).toContain('custom-class');
  });
});
