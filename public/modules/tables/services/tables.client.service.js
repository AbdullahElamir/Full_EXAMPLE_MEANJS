'use strict';

//Tables service used to communicate Tables REST endpoints
angular.module('tables').factory('Tables', ['$resource',
	function($resource) {
		return $resource('tables/:tableId', { tableId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);