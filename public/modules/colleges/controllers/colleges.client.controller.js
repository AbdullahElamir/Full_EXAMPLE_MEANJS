'use strict';

// Colleges controller
angular.module('colleges').controller('CollegesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Colleges', 'TableSettings', 'CollegesForm',
	function($scope, $stateParams, $location, Authentication, Colleges, TableSettings, CollegesForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Colleges);
		$scope.college = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = CollegesForm.getFormFields(disabled);
		};


		// Create new College
		$scope.create = function() {
			var college = new Colleges($scope.college);

			// Redirect after save
			college.$save(function(response) {
				$location.path('colleges/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing College
		$scope.remove = function(college) {

			if ( college ) {
				college = Colleges.get({collegeId:college._id}, function() {
					college.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.college.$remove(function() {
					$location.path('colleges');
				});
			}

		};

		// Update existing College
		$scope.update = function() {
			var college = $scope.college;

			college.$update(function() {
				$location.path('colleges/' + college._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewCollege = function() {
			$scope.college = Colleges.get( {collegeId: $stateParams.collegeId} );
			$scope.setFormFields(true);
		};

		$scope.toEditCollege = function() {
			$scope.college = Colleges.get( {collegeId: $stateParams.collegeId} );
			$scope.setFormFields(false);
		};

	}

]);
