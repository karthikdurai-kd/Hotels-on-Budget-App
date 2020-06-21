import { NgModule, PlatformRef } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacesPage } from './places.page';
import { Page404NotFoundComponent } from '../page404-not-found/page404-not-found.component';


const routes: Routes = [
  {
    path: 'tabs',
    component: PlacesPage,
  
    children:[
      {
        path: '',
        redirectTo: 'discover',
        pathMatch: 'full'
      },

      {path: 'discover', children:[
       { path:'',
         loadChildren: ()=> import('./discover/discover.module').then(m=>m.DiscoverPageModule),
       
       },
       {
         path: ':placeId',
         loadChildren: ()=> import('./discover/place-details/place-details.module').then(m=> m.PlaceDetailsPageModule)
       }
      ]},

      {path: 'offers', children:[
        {
          path: '',
          loadChildren: ()=> import('./offers/offers.module').then(m=> m.OffersPageModule)
        },

        {
          path: 'new',
          loadChildren: ()=> import('./offers/new-offers/new-offers.module').then(m=> m.NewOffersPageModule)
        },

        {
          path: 'edit/:placeId',
          loadChildren: ()=> import('./offers/edit-offers/edit-offers.module').then(m=> m.EditOffersPageModule)
        },

        {
          path: ':placeId',
          loadChildren: ()=> import('./offers/offer-bookings/offer-bookings.module').then(m=> m.OfferBookingsPageModule)
        }
      ]}
    ]},

   /* {
      path:'404', component:Page404NotFoundComponent
    },
    
    {
      path: '**', redirectTo: '404', pathMatch: 'full' 
    }*/
  
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path:'404', component:Page404NotFoundComponent
  },
  
  {
    path: '**', redirectTo: '404', pathMatch: 'full' 
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}
