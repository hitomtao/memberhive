import { Component, Input, ViewChild } from '@angular/core';

import { MdSidenav, MdDrawerToggleResult } from '@angular/material';

@Component({
  selector: 'mh-layout-manage-list',
  styleUrls: ['./layout-manage-list.component.scss' ],
  templateUrl: './layout-manage-list.component.html'
})
export class MhLayoutManageListComponent {

  @ViewChild(MdSidenav) _sideNav: MdSidenav;

  /**
   * mode?: 'side', 'push' or 'over'
   *
   * The mode or styling of the sidenav.
   * Defaults to "side".
   * See "MdSidenav" documentation for more info.
   *
   * https://github.com/angular/material2/tree/master/src/lib/sidenav
   */
  @Input('mode') mode: 'side' | 'push' | 'over' = 'side';

  /**
   * opened?: boolean
   *
   * Whether or not the sidenav is opened. Use this binding to open/close the sidenav.
   * Defaults to "true".
   *
   * See "MdSidenav" documentation for more info.
   *
   * https://github.com/angular/material2/tree/master/src/lib/sidenav
   */
  @Input('opened') opened: boolean = true;

  /**
   * sidenavWidth?: string
   *
   * Sets the "width" of the sidenav in either "px" or "%" ("%" is not well supported yet as stated in the layout docs)
   * Defaults to "257px".
   *
   * https://github.com/angular/material2/tree/master/src/lib/sidenav
   */
  @Input('sidenavWidth') sidenavWidth: string = '257px';

  /**
   * Checks if `ESC` should close the sidenav
   * Should only close it for `push` and `over` modes
   */
  get disableClose(): boolean {
    return this.mode === 'side';
  }

  /**
   * Proxy toggle method to access sidenav from outside (from mh-layout template).
   */
  public toggle(): Promise<MdDrawerToggleResult> {
    return this._sideNav.toggle(!this._sideNav.opened);
  }

  /**
   * Proxy open method to access sidenav from outside (from mh-layout template).
   */
  public open(): Promise<MdDrawerToggleResult> {
    return this._sideNav.open();
  }

  /**
   * Proxy close method to access sidenav from outside (from mh-layout template).
   */
  public close(): Promise<MdDrawerToggleResult> {
    return this._sideNav.close();
  }

}
