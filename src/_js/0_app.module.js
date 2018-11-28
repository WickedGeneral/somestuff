var contactBookApp = angular.module('contactBookApp', [
  'LocalStorageModule'
]).
  config(['localStorageServiceProvider', function ( localStorageServiceProvider) {
      localStorageServiceProvider.setPrefix('ls');
  }]);
