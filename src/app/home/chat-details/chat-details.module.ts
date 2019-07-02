import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChatDetailsRoutingModule } from './chat-details-routing.module';
import { ChatDetailsComponent } from './chat-details.component';
import { NgxEditorModule } from 'ngx-editor';
@NgModule({
    imports: [
		FormsModule,
		ReactiveFormsModule ,
		CommonModule,
		TranslateModule, 
		NgbModule,
		ChatDetailsRoutingModule,
		NgxEditorModule 
	],
    declarations: [ChatDetailsComponent]
})
export class ChatDetailsModule {}
