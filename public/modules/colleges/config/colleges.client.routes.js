'use strict';

//Setting up route
angular.module('colleges').config(['$stateProvider',
	function($stateProvider) {
		// Colleges state routing
		$stateProvider.
		state('listColleges', {
			url: '/colleges',
			templateUrl: 'modules/colleges/views/list-colleges.client.view.html'
		}).
		state('createCollege', {
			url: '/colleges/create',
			templateUrl: 'modules/colleges/views/create-college.client.view.html'
		}).
		state('viewCollege', {
			url: '/colleges/:collegeId',
			templateUrl: 'modules/colleges/views/view-college.client.view.html'
		}).
		state('editCollege', {
			url: '/colleges/:collegeId/edit',
			templateUrl: 'modules/colleges/views/edit-college.client.view.html'
		});
	}
]);