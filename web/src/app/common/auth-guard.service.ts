import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';

import {
    isAuthenticated,
    AppState
} from '../app.store';
import { ReAuthenticateAction, AuthService } from 'mh-core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _store: Store<AppState>,
                private _authSrv: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let url: string = state.url;
        const isAuthentic$: any = this._store.select(isAuthenticated);

        console.log();

        isAuthentic$.subscribe((authenticated: any) => {
            if (!authenticated) {
                if (this._authSrv.getToken()) {
                    this._store.dispatch(new ReAuthenticateAction(this._authSrv.getToken()));
                }
                this._store.dispatch(go('/login'));
            }
        });

        return isAuthentic$;
    }
}
