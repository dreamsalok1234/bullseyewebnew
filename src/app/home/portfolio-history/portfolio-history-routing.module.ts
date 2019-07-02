import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortfolioHistoryComponent } from './portfolio-history.component';

const routes: Routes = [
    {
        path: '', component: PortfolioHistoryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PortfolioHistoryRoutingModule {}
