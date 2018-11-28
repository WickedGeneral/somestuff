contactBookApp.service('DataService', [
  'localStorageService', function(localStorageService) {
    let ds = this;
    let contacts;


    ds.updateStorageState = _ => {
      localStorageService.set('contacts', contacts)
    }

    ds.getContactsFromStorage = _ => {
      contacts = localStorageService.get('contacts');
    }

    ds.addContact = (contact) => {
      contact.id = contacts.length;
      contacts.push(contact);
      ds.updateStorageState();
    };

    ds.editContact = (contact) => {
      for (let i = 0; i < contacts.length; i++) {
        if(contacts[i].id == contact.id) {
          contacts[i] = contact;
          ds.updateStorageState();
          return;
        }
      }
    }

    ds.deleteContact = (contact) => {
      for (let i = 0; i < contacts.length; i++) {
        if(contacts[i].id == contact.id) {
          contacts.splice(i, 1);
          ds.updateStorageState();
          return;
        }
      }
    }
  }
]);
