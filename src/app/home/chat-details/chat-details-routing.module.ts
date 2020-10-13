import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatDetailsComponent } from './chat-details.component';

const routes: Routes = [
    {
        path: '', component: ChatDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChatDetailsRoutingModule {
}
