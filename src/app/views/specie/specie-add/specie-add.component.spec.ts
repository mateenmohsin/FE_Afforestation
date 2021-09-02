import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecieAddComponent } from './specie-add.component';

describe('SpecieAddComponent', () => {
  let component: SpecieAddComponent;
  let fixture: ComponentFixture<SpecieAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecieAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecieAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
