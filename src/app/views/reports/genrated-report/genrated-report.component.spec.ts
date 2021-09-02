import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenratedReportComponent } from './genrated-report.component';

describe('GenratedReportComponent', () => {
  let component: GenratedReportComponent;
  let fixture: ComponentFixture<GenratedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenratedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenratedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
