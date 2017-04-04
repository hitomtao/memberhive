import { Component, ElementRef, OnInit } from '@angular/core';
import { style, state, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { TitleService } from '../common/title.service';
import { AuthService } from '../common/auth/auth.service';
import { ShoutService } from '../common/shout.service';
import { InteractionService } from '../common/interaction.service';

import { Person } from '../person/person';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

import { Note } from '../note/note';
import { NoteService } from '../note/note.service';
import { NoteCreateDialogComponent } from '../note/dialogs/note-create.dialog';

import { Store } from '@ngrx/store';
import * as app from '../app.store';
import * as layout from 'mh-core';

@Component({
    selector: 'mh-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
    animations: [
        trigger('drawer', [
            state('true', style({
                width: '200px'
            })),
            state('false',  style({
                width: '75px',
                flex: '1 1 75px;',
                'min-width': '75px',
                'max-width': '75px'
            }))
        ])
    ],
    providers: [InteractionService]
})
export class ViewComponent implements OnInit {
    private dialogRef: MdDialogRef<any>;

    routes: Object[] = [
        {
            title: 'Dashboard', route: '/dashboard', icon: 'dashboard'
        }, {
            title: 'Persons', route: '/person', icon: 'people'
        }, {
            title: 'Events', route: '', icon: 'today'
        }, {
            title: 'Groups', route: '', icon: 'people_outline'
        }
    ];

    currentUser: Person;
    myInteractions: Observable<Note[]>;
    myOutstanding: Observable<Note[]>;

    drawerVisible$: Observable<boolean>;
    open: string = 'true';

    constructor(private _shoutService: ShoutService,
                private _interactionService: InteractionService,
                private _auth: AuthService,
                private _noteService: NoteService,
                private _element: ElementRef,
                private _router: Router,
                public _dialog: MdDialog,
                private store: Store<app.AppState>,
                public titleService: TitleService) {
        this.drawerVisible$ = this.store.select(app.getShowDrawer);
    }

    ngOnInit(): void {
        this.currentUser = this._auth.getCurrentUser();
        // TODO: use the core module to fetch the state
        this.myInteractions = this._interactionService.myInteractions;
        this.myOutstanding = this.myInteractions.map((data: Note[]) =>
            data.filter((n: Note) => n.dueOn && (!n.actions.doneOn && !n.actions.completedOn))
        );
        this._interactionService.loadMy();
    }

    openDrawer(): void {
        this.open = 'true';
        this.store.dispatch(new layout.OpenDrawerAction());
    }
    closeDrawer(): void {
        this.open = 'false';
        this.store.dispatch(new layout.CloseDrawerAction());
    }

    isActiveItem(title: any): boolean {
        return this.titleService.getModule() === title;
    }

    openDlgInteractions(): void {
        const config: MdDialogConfig = new MdDialogConfig();
        config.data = {
        };

        this.dialogRef = this._dialog.open(NoteCreateDialogComponent, config);
        this.dialogRef.afterClosed().subscribe((result: any) => {
            if (result instanceof Note) {
                this._interactionService.create(result);
                this._shoutService.success('Interaction created!');
            }
            this.dialogRef = undefined;
        });
    }
    createInteraction(): void {
        this._interactionService.setLastRoute(this._router.url);
        this._router.navigate(['/note/create']);
    }
}
