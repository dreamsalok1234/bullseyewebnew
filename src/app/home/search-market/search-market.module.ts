import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchMarketRoutingModule } from './search-market-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchMarketComponent } from './search-market.component';

@NgModule({
    imports: [
		FormsModule,
		ReactiveFormsModule ,
		CommonModule,
		TranslateModule,
		SearchMarketRoutingModule,
		NgbModule
	],
	declarations: [SearchMarketComponent]
})
export class SearchMarketModule {}
