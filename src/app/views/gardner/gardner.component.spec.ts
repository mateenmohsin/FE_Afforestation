import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GardnerComponent } from './gardner.component';

describe('GardnerComponent', () => {
  let component: GardnerComponent;
  let fixture: ComponentFixture<GardnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GardnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GardnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
