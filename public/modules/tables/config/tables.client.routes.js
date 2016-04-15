'use strict';

//Setting up route
angular.module('tables').config(['$stateProvider',
	function($stateProvider) {
		// Tables state routing
		$stateProvider.
		state('listTables', {
			url: '/tables',
			templateUrl: 'modules/tables/views/list-tables.client.view.html'
		}).
		state('createTable', {
			url: '/tables/create',
			templateUrl: 'modules/tables/views/create-table.client.view.html'
		}).
		state('viewTable', {
			url: '/tables/:tableId',
			templateUrl: 'modules/tables/views/view-table.client.view.html'
		}).
		state('editTable', {
			url: '/tables/:tableId/edit',
			templateUrl: 'modules/tables/views/edit-table.client.view.html'
		});
	}
]);