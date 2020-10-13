import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PortfolioComponent } from './portfolio.component';
import { PortfolioModule } from './portfolio.module';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          PortfolioModule,
          BrowserAnimationsModule,
          RouterTestingModule,
         ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
