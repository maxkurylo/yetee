import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedYetiComponent } from './animated-yeti.component';

describe('LoginYetiComponent', () => {
  let component: AnimatedYetiComponent;
  let fixture: ComponentFixture<AnimatedYetiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimatedYetiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatedYetiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
