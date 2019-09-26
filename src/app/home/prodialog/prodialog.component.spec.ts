import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdialogComponent } from './prodialog.component';

describe('ProdialogComponent', () => {
  let component: ProdialogComponent;
  let fixture: ComponentFixture<ProdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
