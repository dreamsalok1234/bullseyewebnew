import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchMarketComponent } from './search-market.component';

const routes: Routes = [
    {
        path: '', component: SearchMarketComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SearchMarketRoutingModule {
}
