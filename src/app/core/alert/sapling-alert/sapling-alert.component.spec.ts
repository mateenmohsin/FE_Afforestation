import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaplingAlertComponent } from './sapling-alert.component';

describe('SaplingAlertComponent', () => {
  let component: SaplingAlertComponent;
  let fixture: ComponentFixture<SaplingAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaplingAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaplingAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
