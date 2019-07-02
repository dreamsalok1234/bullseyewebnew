import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TickerDetailsComponent } from './ticker-details.component';

const routes: Routes = [
    {
        path: ':tsymbol/:tname', component: TickerDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TickerDetailsRoutingModule {
}
