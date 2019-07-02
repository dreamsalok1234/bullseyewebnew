import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceAlertComponent } from './price-alert.component';

const routes: Routes = [
    {
        path: '', component: PriceAlertComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PriceAlertRoutingModule {
}
