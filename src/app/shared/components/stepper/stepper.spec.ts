import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stepper, Step } from './stepper';
import { By } from '@angular/platform-browser';

describe('Stepper', () => {
  let component: Stepper;
  let fixture: ComponentFixture<Stepper>;

  const mockSteps: Step[] = [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stepper],
    }).compileComponents();

    fixture = TestBed.createComponent(Stepper);
    component = fixture.componentInstance;

    // Set required inputs directly
    fixture.componentRef.setInput('steps', mockSteps);
    fixture.componentRef.setInput('currentStep', 0);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct number of steps', () => {
    const steps = fixture.debugElement.queryAll(By.css('li'));
    expect(steps.length).toBe(3);
  });

  it('should indicate current step', () => {
    const currentStepUrl = fixture.debugElement.query(By.css('[aria-current="step"]'));
    expect(currentStepUrl).toBeTruthy();
    expect(currentStepUrl.nativeElement.textContent).toContain('Step 1');
  });

  it('should update current step when input changes', () => {
    fixture.componentRef.setInput('currentStep', 1);
    fixture.detectChanges();

    const currentStepUrl = fixture.debugElement.query(By.css('[aria-current="step"]'));
    expect(currentStepUrl.nativeElement.textContent).toContain('Step 2');
  });

  it('should emit step click and output change', () => {
    vi.spyOn(component.stepClick, 'emit');

    // Move to step 1 so step 0 is clickable/completed
    fixture.componentRef.setInput('currentStep', 1);
    fixture.detectChanges();

    const step0 = fixture.debugElement.queryAll(By.css('li'))[0].query(By.css('button'));
    step0.triggerEventHandler('click', null);

    expect(component.stepClick.emit).toHaveBeenCalledWith(0);
    expect(component.currentStep()).toBe(0);
  });
});
