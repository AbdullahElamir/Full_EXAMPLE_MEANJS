(function () {
  'use strict';

  describe('Books Route Tests', function () {
    // Initialize global variables
    var $scope,
      BooksService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BooksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BooksService = _BooksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('books');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/books');
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
          liststate = $state.get('books.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/books/client/views/list-books.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          BooksController,
          mockBook;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('books.view');
          $templateCache.put('modules/books/client/views/view-book.client.view.html', '');

          // create mock book
          mockBook = new BooksService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Book about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          BooksController = $controller('BooksController as vm', {
            $scope: $scope,
            bookResolve: mockBook
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:bookId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.bookResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            bookId: 1
          })).toEqual('/books/1');
        }));

        it('should attach an book to the controller scope', function () {
          expect($scope.vm.book._id).toBe(mockBook._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/books/client/views/view-book.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BooksController,
          mockBook;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('books.create');
          $templateCache.put('modules/books/client/views/form-book.client.view.html', '');

          // create mock book
          mockBook = new BooksService();

          // Initialize Controller
          BooksController = $controller('BooksController as vm', {
            $scope: $scope,
            bookResolve: mockBook
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.bookResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/books/create');
        }));

        it('should attach an book to the controller scope', function () {
          expect($scope.vm.book._id).toBe(mockBook._id);
          expect($scope.vm.book._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/books/client/views/form-book.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BooksController,
          mockBook;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('books.edit');
          $templateCache.put('modules/books/client/views/form-book.client.view.html', '');

          // create mock book
          mockBook = new BooksService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Book about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          BooksController = $controller('BooksController as vm', {
            $scope: $scope,
            bookResolve: mockBook
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:bookId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.bookResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            bookId: 1
          })).toEqual('/books/1/edit');
        }));

        it('should attach an book to the controller scope', function () {
          expect($scope.vm.book._id).toBe(mockBook._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/books/client/views/form-book.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('books.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('books/');
          $rootScope.$digest();

          expect($location.path()).toBe('/books');
          expect($state.current.templateUrl).toBe('modules/books/client/views/list-books.client.view.html');
        }));
      });

    });
  });
}());
