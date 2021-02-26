import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollStartComponent } from './poll-start.component';

describe('PollStartComponent', () => {
  let component: PollStartComponent;
  let fixture: ComponentFixture<PollStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PollStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
