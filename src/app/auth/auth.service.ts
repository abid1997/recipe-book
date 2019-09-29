import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

export interface AuthResponsedata{
    kind: string;
    idToken: string;	
    email: string;
    refreshToken: string;	
    expiresIn: string;
    localId: string;
    registered?: boolean; //Only for login
}

@Injectable({providedIn: 'root'})
export class AuthService{
    user = new BehaviorSubject<User>(null);
    tokenExpirationTimer: any;

    constructor(private http: HttpClient,private router: Router){}

    signup(email: string, pass: string){
        return this.http.post<AuthResponsedata>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIkey,
        {
           email: email,
           password: pass,
           returnSecureToken: true
        })
        .pipe(catchError(this.errorHandler), tap(resData => {
            this.authenticationHandler(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
    }

    login(email: string, pass: string){
        return this.http.post<AuthResponsedata>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIkey,
        {
           email: email,
           password: pass,
           returnSecureToken: true 
        })
        .pipe(catchError(this.errorHandler), tap(resData => {
            this.authenticationHandler(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        })); 
    }

    autoLogin(){
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData){
            return;
        }

        const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));

        if(loadedUser.token){
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        },expirationDuration)
    }

    private authenticationHandler(email: string, userId: string, token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + expiresIn*1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData',JSON.stringify(user));
    }

    private errorHandler(errorRes: HttpErrorResponse){
        let errorMessage = 'An unknown error Occured :(';
        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email is already registered!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This is not a registered email!';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'The password is not correct!';
                break;      
        }
        return throwError(errorMessage);
    }
}