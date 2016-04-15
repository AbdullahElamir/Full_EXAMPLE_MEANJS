'use strict';

// Tables controller
angular.module('tables').controller('TablesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tables', 'TableSettings', 'TablesForm',
	function($scope, $stateParams, $location, Authentication, Tables, TableSettings, TablesForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Tables);
		$scope.table = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = TablesForm.getFormFields(disabled);
		};


		// Create new Table
		$scope.create = function() {
			var table = new Tables($scope.table);

			// Redirect after save
			table.$save(function(response) {
				$location.path('tables/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Table
		$scope.remove = function(table) {

			if ( table ) {
				table = Tables.get({tableId:table._id}, function() {
					table.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.table.$remove(function() {
					$location.path('tables');
				});
			}

		};

		// Update existing Table
		$scope.update = function() {
			var table = $scope.table;

			table.$update(function() {
				$location.path('tables/' + table._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewTable = function() {
			$scope.table = Tables.get( {tableId: $stateParams.tableId} );
			$scope.setFormFields(true);
		};

		$scope.toEditTable = function() {
			$scope.table = Tables.get( {tableId: $stateParams.tableId} );
			$scope.setFormFields(false);
		};

	}

]);
