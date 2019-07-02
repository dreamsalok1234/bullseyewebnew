import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortfolioDetailsComponent } from './portfolio-details.component';

const routes: Routes = [
    {
        path: '/:pname/:username', component: PortfolioDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PortfolioDetailsRoutingModule {
}
