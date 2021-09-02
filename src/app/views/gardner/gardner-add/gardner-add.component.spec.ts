import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GardnerAddComponent } from './gardner-add.component';

describe('GardnerAddComponent', () => {
  let component: GardnerAddComponent;
  let fixture: ComponentFixture<GardnerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GardnerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GardnerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
