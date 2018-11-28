contactBookApp.controller('contactBookCtrl', [
  '$scope','DataService','HttpService','localStorageService', function($scope,dataService,HttpService,localStorageService) {

    $scope.currContact = {
      id: null,
      firstName: '',
      secondName: '',
      email: '',
      phone: ''
    };

    $scope.emptySearchRes = false;


    HttpService.httpGetProcess().then(function (content) {
      localStorageService.set('contacts', content)
      $scope.contactList = content;
      $scope.$apply();
      dataService.getContactsFromStorage();
    }).catch(function(value) {
      console.log(value);
    });



    $scope.initNewContact = _ => {
      $scope.resetCurrContact();
    }

    $scope.editContact = (contact) => {
      contact.phone = parseInt(contact.phone);
      angular.copy(contact, $scope.currContact);
    }

    $scope.saveContact = (contact) => {
      if (contact.id != null) {
        dataService.editContact(contact);
        $scope.updateContactList();
        $('.close').click();
      } else {
        dataService.addContact(contact);
        $scope.updateContactList();
        $('.close').click();
      }
      $scope.resetCurrContact();
    }

    $scope.deleteContact = (contact) => {
      dataService.deleteContact(contact);
      $scope.updateContactList();
    }

    $scope.resetCurrContact = _ => {
      $scope.currContact = {
        id: null,
        firstName: '',
        secondName: '',
        email: '',
        phone: ''
      };
    }

    function validateForm() {
      
    }

    $scope.updateContactList = () => {
      $scope.contactList = localStorageService.get('contacts');
      $scope.searchSubstr = '';
      $scope.showAllRes = true;
      $scope.emptySearchRes = false;
    }

    $scope.viewSearchResults = (substr) => {
      if(substr.length == 0) {
        $scope.showAllRes = true;
        $scope.emptySearchRes = false;
        return;
      }
      for (let contact of $scope.contactList) {
        if(contact.firstName.includes(substr)) {  // it's sensitive to register
        contact.showAsFilterRes = true;
      } else {
        contact.showAsFilterRes = false;
        $scope.showAllRes = false;
      }

    }
    for (let contact of $scope.contactList) {
      if(!contact.showAsFilterRes) {
        $scope.emptySearchRes = true;
      } else {
        $scope.emptySearchRes = false;
        return
      }
    }

  }

}]);
