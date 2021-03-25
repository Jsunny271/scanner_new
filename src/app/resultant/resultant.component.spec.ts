import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultantComponent } from './resultant.component';

describe('ResultantComponent', () => {
  let component: ResultantComponent;
  let fixture: ComponentFixture<ResultantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
