(function () {
  'use strict';

  describe('Colleges Route Tests', function () {
    // Initialize global variables
    var $scope,
      CollegesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CollegesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CollegesService = _CollegesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('colleges');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/colleges');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('colleges.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/colleges/client/views/list-colleges.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CollegesController,
          mockCollege;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('colleges.view');
          $templateCache.put('modules/colleges/client/views/table-college.clinet.view.html', '');

          // create mock college
          mockCollege = new CollegesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An College about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CollegesController = $controller('CollegesController as vm', {
            $scope: $scope,
            collegeResolve: mockCollege
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:collegeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.collegeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            collegeId: 1
          })).toEqual('/colleges/1');
        }));

        it('should attach an college to the controller scope', function () {
          expect($scope.vm.college._id).toBe(mockCollege._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/colleges/client/views/table-college.clinet.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CollegesController,
          mockCollege;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('colleges.create');
          $templateCache.put('modules/colleges/client/views/form-college.client.view.html', '');

          // create mock college
          mockCollege = new CollegesService();

          // Initialize Controller
          CollegesController = $controller('CollegesController as vm', {
            $scope: $scope,
            collegeResolve: mockCollege
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.collegeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/colleges/create');
        }));

        it('should attach an college to the controller scope', function () {
          expect($scope.vm.college._id).toBe(mockCollege._id);
          expect($scope.vm.college._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/colleges/client/views/form-college.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CollegesController,
          mockCollege;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('colleges.edit');
          $templateCache.put('modules/colleges/client/views/form-college.client.view.html', '');

          // create mock college
          mockCollege = new CollegesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An College about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CollegesController = $controller('CollegesController as vm', {
            $scope: $scope,
            collegeResolve: mockCollege
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:collegeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.collegeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            collegeId: 1
          })).toEqual('/colleges/1/edit');
        }));

        it('should attach an college to the controller scope', function () {
          expect($scope.vm.college._id).toBe(mockCollege._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/colleges/client/views/form-college.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('colleges.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('colleges/');
          $rootScope.$digest();

          expect($location.path()).toBe('/colleges');
          expect($state.current.templateUrl).toBe('modules/colleges/client/views/list-colleges.client.view.html');
        }));
      });

    });
  });
}());
