import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BullseyeProComponent } from './bullseye-pro.component';

const routes: Routes = [
    {
        path: '', component: BullseyeProComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BullseyeProRoutingModule {
}
