import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChatDetailsComponent } from './chat-details.component';
import { ChatDetailsModule } from './chat-details.module';

describe('ChatDetailsComponent', () => {
  let component: ChatDetailsComponent;
  let fixture: ComponentFixture<ChatDetailsComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          ChatDetailsModule,
          BrowserAnimationsModule,
          RouterTestingModule,
         ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
