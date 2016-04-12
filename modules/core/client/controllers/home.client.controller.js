(function () {
  'use strict';

  angular
    .module('core')
      .controller('HomeController', HomeController);

  function HomeController($scope) {
    var vm = this;
    $scope.alerts = [{
      total: 1800,
      description: 'TOTAL CUSTOMERS',
      ngClass: 'plan-name-bronze'
    },
    {
      total: 8300,
      description: 'UPCOMING EVENTS',
      ngClass: 'plan-name-gold'
    },
    {
      total: 500,
      description: 'REFFARLS TO MODERAT',
      ngClass: 'plan-name-silver'
    },
    {
      total: 1800,
      description: 'Half Coustomers',
      ngClass: 'plan-name-gold'
    },
    {
      total: 23232,
      description: 'Emails Sent',
      ngClass: 'plan-name-silver'
    },
    {
      total: 8989,
      description: 'Follow Up',
      ngClass: 'plan-name-bronze'
    }
    ];
  }


}());
