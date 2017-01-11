import { Component, ViewChild, Input, Output, EventEmitter,
    trigger, state, style, transition, animate } from '@angular/core';

import {PersonService} from "./person/person.service";
import {Person} from "./person/person";
import { MdInputDirective } from '@angular/material';

@Component({
    selector: 'mh-search-box',
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.scss' ],
    providers: [PersonService],
    animations: [
        trigger('inputState', [
            state('false', style({
                width: '0%',
                'margin-left': '0px'
            })),
            state('true',  style({
                width: '100%',
                'margin-left': '*'
            })),
            transition('0 => 1', animate('200ms ease-in')),
            transition('1 => 0', animate('200ms ease-out'))
        ]),
        trigger('searchState', [
            state('false', style({
                transform: 'translateX(150%)',
                display: 'none'
            })),
            state('true',  style({
                transform: 'translateX(0%)',
                display: 'block'
            })),
            transition('0 => 1', animate('200ms ease-in')),
            transition('1 => 0', animate('200ms ease-out'))
        ])
    ]
})
export class MhSearchBoxComponent {

    private _searchVisible: boolean = false;

    @ViewChild(MdInputDirective) private _searchInput: MdInputDirective;

    public items: Array<any>;
    public item: any;

    /**
     * backIcon?: string
     * The icon used to close the search toggle, only shown when [alwaysVisible] is false.
     * Defaults to 'search' icon.
     */
    @Input('backIcon') backIcon: string = 'search';

    /**
     * showUnderline?: boolean
     * Sets if the input underline should be visible. Defaults to 'false'.
     */
    @Input('showUnderline') showUnderline: boolean = false;

    /**
     * debounce?: number
     * Debounce timeout between keypresses. Defaults to 400.
     */
    @Input('debounce') debounce: number = 400;

    /**
     * alwaysVisible?: boolean
     * Sets if the input should always be visible. Defaults to 'false'.
     */
    @Input('alwaysVisible') alwaysVisible: boolean = false;

    /**
     * placeholder?: string
     * Placeholder for the underlying input component.
     */
    @Input('placeholder') placeholder: string;

    /**
     * searchDebounce: function($event)
     * Event emitted after the [debounce] timeout.
     */
    @Output('searchDebounce') onSearchDebounce: EventEmitter<string> = new EventEmitter<string>();

    /**
     * search: function($event)
     * Event emitted after the key enter has been pressed.
     */
    @Output('search') onSearch: EventEmitter<string> = new EventEmitter<string>();

    /**
     * clear: function()
     * Event emitted after the clear icon has been clicked.
     */
    @Output('clear') onClear: EventEmitter<void> = new EventEmitter<void>();

    @Output('blur') onBlur: EventEmitter<void> = new EventEmitter<void>();

    set value(value: any) {
        this._searchInput.value = value;
    }
    get value(): any {
         return this._searchInput.value;
    }

    get searchVisible(): boolean {
        return this._searchVisible;
    }

    /**
     * Method executed when the search icon is clicked.
     */
    searchClicked(): void {
        if (this.alwaysVisible || !this._searchVisible) {
            this._searchInput.focus();
        }
        this.toggleVisibility();
    }

    toggleVisibility(): void {
        this._searchVisible = !this._searchVisible;
    }

    handleSearchDebounce(value: string): void {
        this.onSearchDebounce.emit(value);
    }

    handleSearch(value: string): void {
        this.onSearch.emit(value);
        console.log(this.value);
        //console.log(this._input.value);
        this.personService.getPersons()
            .subscribe((persons: Array<Person>) => this.items = persons);
    }

    handleClear(): void {
        this.onClear.emit(undefined);
        console.log('clear');
    }

    handleBlur(): void {
        this.onBlur.emit(undefined);
        this.value = '';
        console.log('blur');
    }

    stopPropagation(event: Event): void {
        event.stopPropagation();
    }

    constructor(private personService: PersonService) {}
}
