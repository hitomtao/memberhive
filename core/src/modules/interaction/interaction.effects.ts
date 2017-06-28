import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

import { Effect, Actions, toPayload } from '@ngrx/effects';
import * as actions from './interaction.actions';
import { Interaction, InteractionPayload, InteractionCollection } from './interaction.model';
import { HttpService } from '../../services/http.service';

@Injectable()
export class InteractionEffects {
    constructor(private actions$: Actions,
                private http: HttpService) {
    }

    @Effect()
    getInteractions$ = this.actions$
        .ofType(actions.LIST_INTERACTIONS)
        .map((action: actions.ListInteractionsAction) => action.payload)
        .switchMap((data: InteractionPayload) => {
            // console.log('from effects[I]', data);
            return this.http.get('interaction/list?')// + data.id
                // + '&noMarkup=' + data.noMarkup + '&me=' + data.me)
                .map((r: Interaction[]) => {
                    console.log('from effect', r);
                    return new actions.ListInteractionsSuccessAction(r);
                })
                .catch((r: any) => of(new actions.ListInteractionsFailureAction(r)));
        });

    @Effect()
    addInteraction$ = this.actions$
        .ofType(actions.ADD_INTERACTION)
        .map((action: actions.AddInteractionAction) => action.payload)
        .switchMap((data: Interaction) => this.http.post('interaction/create-person', data)
            .map((r: Interaction) => new actions.AddInteractionSuccessAction(r))
            .catch((r: any) => of(new actions.AddInteractionFailureAction(r)))
        );
}
