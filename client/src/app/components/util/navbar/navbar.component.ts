import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  @ViewChild('appMenu')
    appMenu: MatMenu;

  @ViewChild('appMenuDropdown')
    appMenuTrigger: MatMenuTrigger;

  ngOnInit() {
  }

}
