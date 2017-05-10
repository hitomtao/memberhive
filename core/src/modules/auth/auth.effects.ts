import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import * as actions from './auth.actions';
import { Credentials, LoginResponse } from './auth.model';
import { HttpService } from '../../services/http.service';

@Injectable()
export class AuthEffects {

    /**
     * This effect makes use of the `startWith` operator to trigger
     * the effect immediately on startup.
     */
    @Effect()
    public login$: Observable<Action> = this._actions$
        .ofType(actions.authActionTypes.AUTHENTICATE)
        .map(toPayload)
        .switchMap((credentials: Credentials) =>
            this._http.unauthenticatedPost('login/login',
                {
                    username: credentials.username,
                    password: credentials.password
                }
            )
            .map((r: LoginResponse) => new actions.AuthenticationSuccessAction(r.user))
            .catch((response: Response) => {
                return Observable.of(new actions.AuthenticationFailureAction(response));
            })
        );

    /*/@Effect()
    public signOut: Observable<Action> = this._actions$
        .ofType(actions.authActionTypes.SIGN_OUT)
        .map(toPayload)
        .switchMap(payload => {
            return this.userService.signout()
                .map(value => new SignOutSuccessAction())
                .catch(error => Observable.of(new SignOutErrorAction({ error: error })));
        });*/

    constructor(private _actions$: Actions,
                private _http: HttpService) { }
}
