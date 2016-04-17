'use strict';

(function() {
	// Tables Controller Spec
	describe('Tables Controller Tests', function() {
		// Initialize global variables
		var TablesController,
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

			// Initialize the Tables controller.
			TablesController = $controller('TablesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Table object fetched from XHR', inject(function(Tables) {
			// Create sample Table using the Tables service
			var sampleTable = new Tables({
				name: 'New Table'
			});

			// Create a sample Tables array that includes the new Table
			var sampleTables = [sampleTable];

			// Set GET response
			$httpBackend.expectGET('tables').respond(sampleTables);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tables).toEqualData(sampleTables);
		}));

		it('$scope.findOne() should create an array with one Table object fetched from XHR using a tableId URL parameter', inject(function(Tables) {
			// Define a sample Table object
			var sampleTable = new Tables({
				name: 'New Table'
			});

			// Set the URL parameter
			$stateParams.tableId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tables\/([0-9a-fA-F]{24})$/).respond(sampleTable);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.table).toEqualData(sampleTable);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tables) {
			// Create a sample Table object
			var sampleTablePostData = new Tables({
				name: 'New Table'
			});

			// Create a sample Table response
			var sampleTableResponse = new Tables({
				_id: '525cf20451979dea2c000001',
				name: 'New Table'
			});

			// Fixture mock form input values
			scope.name = 'New Table';

			// Set POST response
			$httpBackend.expectPOST('tables', sampleTablePostData).respond(sampleTableResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Table was created
			expect($location.path()).toBe('/tables/' + sampleTableResponse._id);
		}));

		it('$scope.update() should update a valid Table', inject(function(Tables) {
			// Define a sample Table put data
			var sampleTablePutData = new Tables({
				_id: '525cf20451979dea2c000001',
				name: 'New Table'
			});

			// Mock Table in scope
			scope.table = sampleTablePutData;

			// Set PUT response
			$httpBackend.expectPUT(/tables\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tables/' + sampleTablePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tableId and remove the Table from the scope', inject(function(Tables) {
			// Create new Table object
			var sampleTable = new Tables({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tables array and include the Table
			scope.tables = [sampleTable];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tables\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTable);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tables.length).toBe(0);
		}));
	});
}());