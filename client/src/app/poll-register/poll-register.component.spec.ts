import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollRegisterComponent } from './poll-register.component';

describe('PollRegisterComponent', () => {
  let component: PollRegisterComponent;
  let fixture: ComponentFixture<PollRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PollRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
