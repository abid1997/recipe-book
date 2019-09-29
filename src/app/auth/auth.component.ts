import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponsedata } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null; 

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm){ 
    if(authForm.invalid){
      return
    }
    const email = authForm.value.email;
    const password = authForm.value.password;

    let authObs: Observable<AuthResponsedata>;

    this.isLoading = true;
    if(this.isLoginMode){
        authObs = this.auth.login(email,password);
    } else {
      authObs = this.auth.signup(email,password);
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    )
    
    authForm.reset();
  }

  closeAlert(){
    this.error = null;
  }

  onclose(){
    this.error = null;
  }
}
