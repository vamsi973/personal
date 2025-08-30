import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { ProductManageComponent } from './product-manage/product-manage.component';
import { AffiliateDashboardComponent } from './affiliate-dashboard/affiliate-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    { path: '', component: ProductListingComponent },
    { path: 'manage', component: ProductManageComponent },
    { path: 'dashboard', component: AffiliateDashboardComponent }
];

@NgModule({
    declarations: [
        ProductListingComponent,
        ProductManageComponent,
        AffiliateDashboardComponent
    ],
    imports: [
        CommonModule, ReactiveFormsModule, FormsModule,
        RouterModule.forChild(routes)
    ]
})
export class ShopModule { }
