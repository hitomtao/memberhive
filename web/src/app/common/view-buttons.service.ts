import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';

@Injectable()
export class ViewButtonsService {
    private _buttons: BehaviorSubject<ViewButton[]>;
    private _dataStore: {
        buttons: ViewButton[];
    };

    constructor() {
        this._buttons = <BehaviorSubject<ViewButton[]>> new BehaviorSubject([]);
        // console.log('service cvonstructor');
        this._dataStore = { buttons: [] };
    }

    addButtons(buttons: ViewButton[]): void {
        // console.log('before add', this._dataStore.buttons);
        for (let button of buttons) {
            this._dataStore.buttons.push(button);
        }
        this._buttons.next(Object.assign({}, this._dataStore).buttons);
        // console.log('ds', this._dataStore);
    }

    load(): void {
        this._dataStore.buttons.push({icon: 'person_add', link: '/person/create'});
        this._buttons.next(Object.assign({}, this._dataStore).buttons);
    }

    get buttons(): Observable<ViewButton[]> {
        // console.log('getButtons:',this._buttons);
        this._buttons.next(Object.assign({}, this._dataStore).buttons);
        return this._buttons.asObservable();
    }
}

export interface ViewButton {
    icon: string;
    link: string;
}