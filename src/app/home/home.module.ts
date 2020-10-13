import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PortfolioDetailsComponent } from './portfolio-details/portfolio-details.component';
import { TickerDetailsComponent } from './ticker-details/ticker-details.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PortfolioService } from '../_services/portfolio.service';
import { WatchlistService } from '../_services/watchlist.service';
import { InvestmentService } from '../_services/investment.service';
import { AuthService } from '../_services/auth.service';
import { NewsService } from '../_services/news.service';
import { ChatService } from '../_services/chat.service';
import { TickerService } from '../_services/ticker.service';
import { GlobalService } from '../_services/global.service';
import { ProdialogComponent } from './prodialog/prodialog.component';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule ,
    CommonModule,
    TranslateModule,
    HomeRoutingModule,
    Ng2TelInputModule,
    NgbModule
  ],
  declarations: [
    HomeComponent,
    PortfolioDetailsComponent,
    TickerDetailsComponent,
    HeaderComponent,
    FooterComponent

  ],
  providers: [PortfolioService, WatchlistService, InvestmentService, AuthService, NewsService, ChatService, TickerService, GlobalService]
})
export class HomeModule { }
