import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PanelOption } from './panel-option';
import { Router } from '@angular/router';

@Component({
	selector: 'app-side-panel',
	templateUrl: './side-panel.component.html',
	styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit
{
	selectedOption = null;
	@Input() sideMenuOpened = false;
	@Input() mode = '';
	@Output() onManageMenu: EventEmitter<any> = new EventEmitter<any>();

	public scrollbarOptions = { axis: 'y', theme: 'minimal', scrollInertia: 10 };
	menus: PanelOption[] = [];
	greenerUser: any;

	constructor(private router: Router)
	{
		this.menus = [];
	}

	ngOnInit(): void
	{
		this.greenerUser = JSON.parse(localStorage.getItem('greenerUser'));

		if (this.greenerUser.user.role == 'admin')
		{
			this.menus = [
				{ routerLink: 'dashboard', image: 'home', label: 'Dashboard' },
				{
					image: 'sapling',
					label: 'Sapling Requests',
					isParent: true,
					opened: false,
					children: [
						{ routerLink: 'sapling-requests/individuals', image: 'group_add', label: 'Individual' },
						{ routerLink: 'sapling-requests/organisation-contracted', image: 'group_add', label: 'Contracted Organisation' },
						{ routerLink: 'sapling-requests/organisation-nonContracted', image: 'group_add', label: 'Non Contracted Organisation' }
					]
				},
				{ routerLink: 'inventory', image: 'inventory', label: 'Inventory' },
				{ routerLink: 'species', image: 'species', label: 'Species' },
				{ routerLink: 'gardener', image: 'gardener', label: 'Gardeners' },
				{ routerLink: 'nursery', image: 'nursery', label: 'Nurseries' },
				{ routerLink: 'attendance', image: 'attendance', label: 'Attendance' },
				{ routerLink: 'reports', image: 'reports', label: 'Reports' },
				{ routerLink: 'settings', image: 'settings', label: 'App Settings' },
			];
		}
		else
		{
			this.menus = [
				{ routerLink: 'dashboard', image: 'home', label: 'Dashboard' },
				{
					image: 'sapling',
					label: 'Sapling Requests',
					isParent: true,
					opened: false,
					children: [
						{ routerLink: 'sapling-requests/individuals', image: 'group_add', label: 'Individual' },
						{ routerLink: 'sapling-requests/organisation-contracted', image: 'group_add', label: 'Contracted Organisation' },
						{ routerLink: 'sapling-requests/organisation-nonContracted', image: 'group_add', label: 'Non Contracted Organisation' }
					]
				},
				{ routerLink: 'inventory', image: 'inventory', label: 'Inventory' },
				{ routerLink: 'species', image: 'species', label: 'Species' },
				{ routerLink: 'gardener', image: 'gardener', label: 'Gardeners' },
				{ routerLink: 'nursery', image: 'nursery', label: 'Nurseries' },
				{ routerLink: 'attendance', image: 'attendance', label: 'Attendance' },
				{
					image: 'user',
					label: 'User Management',
					isParent: true,
					opened: false,
					children: [
						{ routerLink: 'user-management/admin', image: 'description', label: 'Admins' },
						{ routerLink: 'user-management/head-gardener', image: 'description', label: 'Head Gardeners' },
					]
				},
				{ routerLink: 'reports', image: 'reports', label: 'Reports' },
				{ routerLink: 'settings', image: 'settings', label: 'App Settings' },
			];
		}
	}

	onMenu(): void
	{
		this.onManageMenu.emit(this.sideMenuOpened);
	}

	onHover(state: string, sideMenu): void
	{
		let image = '';

		// if (state == 'over')
		// {
		// 	image = sideMenu.image.split('_w');
		// 	sideMenu.image = image[0];

		// }
		// else
		// {
		// 	image = sideMenu.image.split('_w');
		// 	sideMenu.image = image[0] + '_w';
		// }
	}

	onHomeClick(): void
	{
		this.router.navigate(['/main']);
	}

	onMenuClick(menu: PanelOption, event): void
	{
		if (menu.isParent)
		{
			menu.opened = !menu.opened;
			return;
		}

		// if (this.mode == 'over' && !menu.isParent)
		// {
		// 	this.onMenu();
		// }

		// menu.active = !menu.active;
		this.router.navigateByUrl('/main/' + menu.routerLink);

		event.preventDefault();
		event.stopPropagation();
	}

	onChildClick(menu, event): void
	{
		this.router.navigateByUrl('/main/' + menu.routerLink);
		event.preventDefault();
		event.stopPropagation();
	}
}
