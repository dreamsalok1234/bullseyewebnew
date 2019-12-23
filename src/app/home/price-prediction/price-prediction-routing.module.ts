import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricePredictionComponent } from './price-prediction.component';

const routes: Routes = [
  {
      path: '', component: PricePredictionComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricePredictionRoutingModule { }
