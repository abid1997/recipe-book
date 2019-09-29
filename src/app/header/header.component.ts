import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit,OnDestroy {
  isAuthenticated = false;
  subs: Subscription;
  constructor(private ds: DataStorageService,private authService: AuthService){}

  ngOnInit(){
    this.subs = this.authService.user.subscribe(user => {
      this.isAuthenticated = user ? true : false; 
    });
  }

  onSave(){
    this.ds.saveRecipe();
  }

  onFetch(){
    this.ds.fetchData().subscribe();
  }

  onlogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
