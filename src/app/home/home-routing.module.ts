import { NgModule } from '@angular/core';
import { Routes, RouterModule,ActivatedRoute } from '@angular/router';
import { HomeComponent } from './home.component';
import { PortfolioDetailsComponent } from './portfolio-details/portfolio-details.component';
import { TickerDetailsComponent } from './ticker-details/ticker-details.component';
const routes: Routes = [
    {
        path: '', component: HomeComponent,
		children: [
            { path: 'home/:username', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            // { path: 'drag-drop', loadChildren: './drag-drop/drag-drop.module#DrDropModule' },
            { path: 'account-settings', loadChildren: './account-settings/account-settings.module#AccountSettingsModule' },
			{ path: 'check-pro', loadChildren: './account-settings/account-settings.module#AccountSettingsModule' },
            { path: 'portfolio', loadChildren: './portfolio/portfolio.module#PortfolioModule' },
			{ path: ':pname/:username', component: PortfolioDetailsComponent, children: [
			  {path: ':pname/:username', loadChildren:'./portfolio-details/portfolio-details.module#PortfolioDetailsModule'}
			]},
			{ path: 'investment/:pname/:username', component: TickerDetailsComponent, children: [
			  {path: 'investment/:pname/:username', loadChildren:'./ticker-details/ticker-details.module#TickerDetailsModule'}
			]},
			{ path: 'investment', loadChildren: './investment/investment.module#InvestmentModule'},
            { path: 'news', loadChildren: './news/news.module#NewsModule'},
            { path: 'chat', loadChildren: './chat/chat.module#ChatModule'},
            { path: 'enquiry', loadChildren: './enquiry/enquiry.module#EnquiryModule' },
            { path: 'chat/:ctsymbol/:ctname', loadChildren: './chat-details/chat-details.module#ChatDetailsModule'},
            { path: 'market-search', loadChildren: './search-market/search-market.module#SearchMarketModule' },
            { path: 'portfolio-history', loadChildren: './portfolio-history/portfolio-history.module#PortfolioHistoryModule' },
            { path: 'bullseye-pro' , loadChildren: './bullseye-pro/bullseye-pro.module#BullseyeProModule'},
            { path: 'privacy-policy', loadChildren: './privacy-policy/privacy-policy.module#PrivacyPolicyModule' },
            { path: 'terms-of-service', loadChildren: './terms-service/terms-service.module#TermsServiceModule' },
            { path: 'change-password', loadChildren: './change-user-password/change-user-password.module#ChangeUserPasswordModule'},
            { path: 'market-price-alerts', loadChildren: './price-alert/price-alert.module#PriceAlertModule' }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule {
	
}
