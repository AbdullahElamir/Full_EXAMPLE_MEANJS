(function () {
  'use strict';

  angular
    .module('core')
      .controller('HomeController', HomeController);

  function HomeController($scope) {
    var vm = this;
    $scope.alerts = [{
      total: 1800,
      description: 'الطلبة المسجلين',
      ngClass: 'plan-name-bronze'
    },
    {
      total: 2,
      description: 'الأحداث القــادمة ',
      ngClass: 'plan-name-gold'
    },
    {
      total: 500,
      description: 'الكليات والمناهج',
      ngClass: 'plan-name-silver'
    },
    {
      total: 1800,
      description: 'البرامج التعليمية',
      ngClass: 'plan-name-gold'
    },
    {
      total: 23232,
      description: 'تنزيلات للمواد',
      ngClass: 'plan-name-silver'
    },
    {
      total: 898999,
      description: 'المتابعين',
      ngClass: 'plan-name-bronze'
    }
    ];
  }


}());
