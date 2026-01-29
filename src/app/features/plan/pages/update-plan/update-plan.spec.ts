import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePlan } from './update-plan';

describe('UpdatePlan', () => {
  let component: UpdatePlan;
  let fixture: ComponentFixture<UpdatePlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
