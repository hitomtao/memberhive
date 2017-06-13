import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';

import * as app from '../../app.store';
import {
    Person,
    TitleService,
    UPDATE_PERSON,
    VIEW_PERSON} from 'mh-core';

import { AvatarEditDialogComponent } from '../dialogs/avatar-edit.dialog';
import { PersonRelationsDialogComponent } from '../dialogs/person-relations.dialog';

import { Interaction } from '../../interaction/interaction';

@Component({
    moduleId: 'mh-person',
    selector: 'mh-person-view',
    templateUrl: './person-view.component.html',
    styleUrls: ['./person-view.component.scss']
})
export class PersonViewComponent implements OnInit, OnDestroy {
    private _alive: boolean = true;
    interactions: Array<Interaction>;
    people: Array<Person>;
    person?: Person;
    person$: Observable<Person>;
    subscription: Subscription;
    dialogRef: MdDialogRef<any>;

    constructor(private _store: Store<app.AppState>,
                private _titleService: TitleService,
                private _router: Router,
                private _route: ActivatedRoute,
                private _dialog: MdDialog) {
        this._store.select(app.getPeople).takeWhile(() => this._alive)
            .subscribe((people: Person[]) => this.people = people);
        this.person$ = this._store.select(app.getSelectedPerson);
    }

    ngOnInit(): void {
        this._route.params
            .map((params: Params) =>
                this._store.dispatch({type: VIEW_PERSON, payload: params['id']}))
            .switchMap((p: any) => this.person$)
            .subscribe((person: Person) => {
                this.person = person;
                this._titleService.setTitle(this.person.fullName);
            });
    }

    ngOnDestroy(): void {
        this._alive = false;
    }

    prevPerson(): void {
        let idx: number = this.people.findIndex((p: Person) => p.uid === this.person.uid);
        idx = (idx > 0) ? idx - 1 : this.people.length - 1;
        if (this.people[idx]) {
            this.gotoPerson(this.people[idx].uid);
        }
    }

    nextPerson(): void {
        let idx: number = this.people.findIndex((p: Person) => p.uid === this.person.uid);
        idx = (idx < this.people.length - 1) ? idx + 1  : 0;
        if (this.people[idx]) {
            this.gotoPerson(this.people[idx].uid);
        }
    }

    gotoPerson(uid: string): void {
        this._router.navigate(['/person/view', uid]);
        // this._store.dispatch(go(['/person/view', uid]));
    }

    savePerson(person: Person): void {
        person.uid = this.person.uid;
        this._store.dispatch({type: UPDATE_PERSON, payload: person});
    }

    openDlgRelationships(): void {
        this.dialogRef = this._dialog.open(PersonRelationsDialogComponent);

        this.dialogRef.afterClosed().subscribe((result: string) => {
            this.dialogRef = undefined;
        });
    }

    openDlgAvatar(): void {
        const config: MdDialogConfig = new MdDialogConfig();
        config.data = {
            context: 'person',
            id: this.person.uid,
            avatar: this.person.avatar
        };

        this.dialogRef = this._dialog.open(AvatarEditDialogComponent, config);
        this.dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.person = result;
            }
            this.dialogRef = undefined;
        });
    }

    createInteraction(): void {
        // this._interactionService.init(this.person);
        // this._interactionService.setLastRoute(this._router.url);
        // this._router.navigate(['/interaction/create']);
    }
}
