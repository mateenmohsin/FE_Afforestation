import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseryAddComponent } from './nursery-add.component';

describe('NurseryAddComponent', () => {
  let component: NurseryAddComponent;
  let fixture: ComponentFixture<NurseryAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurseryAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
