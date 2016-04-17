'use strict';

(function() {
	// Colleges Controller Spec
	describe('Colleges Controller Tests', function() {
		// Initialize global variables
		var CollegesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Colleges controller.
			CollegesController = $controller('CollegesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one College object fetched from XHR', inject(function(Colleges) {
			// Create sample College using the Colleges service
			var sampleCollege = new Colleges({
				name: 'New College'
			});

			// Create a sample Colleges array that includes the new College
			var sampleColleges = [sampleCollege];

			// Set GET response
			$httpBackend.expectGET('colleges').respond(sampleColleges);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.colleges).toEqualData(sampleColleges);
		}));

		it('$scope.findOne() should create an array with one College object fetched from XHR using a collegeId URL parameter', inject(function(Colleges) {
			// Define a sample College object
			var sampleCollege = new Colleges({
				name: 'New College'
			});

			// Set the URL parameter
			$stateParams.collegeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/colleges\/([0-9a-fA-F]{24})$/).respond(sampleCollege);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.college).toEqualData(sampleCollege);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Colleges) {
			// Create a sample College object
			var sampleCollegePostData = new Colleges({
				name: 'New College'
			});

			// Create a sample College response
			var sampleCollegeResponse = new Colleges({
				_id: '525cf20451979dea2c000001',
				name: 'New College'
			});

			// Fixture mock form input values
			scope.name = 'New College';

			// Set POST response
			$httpBackend.expectPOST('colleges', sampleCollegePostData).respond(sampleCollegeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the College was created
			expect($location.path()).toBe('/colleges/' + sampleCollegeResponse._id);
		}));

		it('$scope.update() should update a valid College', inject(function(Colleges) {
			// Define a sample College put data
			var sampleCollegePutData = new Colleges({
				_id: '525cf20451979dea2c000001',
				name: 'New College'
			});

			// Mock College in scope
			scope.college = sampleCollegePutData;

			// Set PUT response
			$httpBackend.expectPUT(/colleges\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/colleges/' + sampleCollegePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid collegeId and remove the College from the scope', inject(function(Colleges) {
			// Create new College object
			var sampleCollege = new Colleges({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Colleges array and include the College
			scope.colleges = [sampleCollege];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/colleges\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCollege);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.colleges.length).toBe(0);
		}));
	});
}());