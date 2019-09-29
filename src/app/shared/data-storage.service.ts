import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService{
   
    constructor(private http: HttpClient,
                private recipeService: RecipeService,
                private authService: AuthService){}

    saveRecipe(){
       const recipes = this.recipeService.getRecipes();

       this.http.put('https://recipe-book-7682e.firebaseio.com/recipes.json',recipes)
       .subscribe(resData => {
           console.log(resData)
       })
    }

    // fetchData(){
    //    return this.http.get<Recipe[]>('https://recipe-book-7682e.firebaseio.com/recipes.json')
    //    .pipe(map(recipes => {
    //        return recipes.map(recipe => {
    //            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
    //        })
    //    }),
    //    tap(recipes => {
    //     this.recipeService.setRecipes(recipes);
    //    }))
    // }

    fetchData(){
        return this.http.get<Recipe[]>(
        'https://recipe-book-7682e.firebaseio.com/recipes.json'
        ).pipe(
          map(recipes => {
            return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
          })}),
          tap(recipes => {
            this.recipeService.setRecipes(recipes);
          }))
    }
}