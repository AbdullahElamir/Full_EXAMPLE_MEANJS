'use strict';

//Colleges service used to communicate Colleges REST endpoints
angular.module('colleges').factory('Colleges', ['$resource',
	function($resource) {
		return $resource('colleges/:collegeId', { collegeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);