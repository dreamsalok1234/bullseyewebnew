import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewsRoutingModule } from './news-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewsComponent } from './news.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    imports: [
		FormsModule,
		ReactiveFormsModule ,
		CommonModule,
		TranslateModule,
		NewsRoutingModule,
		NgbModule,
		NgMultiSelectDropDownModule.forRoot()
	],
    declarations: [NewsComponent]
})
export class NewsModule {}
