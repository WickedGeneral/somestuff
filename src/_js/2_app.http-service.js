contactBookApp.service('HttpService', ['$http','$q', function($http,$q) {

    let http = this;

    http.httpGetProcess = _ => {

      return new Promise ((resolve,reject) => {
        let url = 'static.json';
        let options = {
          url: url,
          method: 'GET',
          dataType: 'json',
          headers: {"Content-Type": "application/json"},
          data: ''
        }
        $http(options).then((response) => {
          let data = response.data.data;
          resolve(data);
        },(response) => {
            reject(response);
        });
      });
    }

    http.httpPostProcess = (data) => {
        // let url = 'some API url';
        let result = $http({
            url: url,
            method: 'POST',
            dataType: 'json',
            headers: {"Content-Type": "application/json"},
            data: newObj
        });
        result.success((data, status, headers, config) => {
          alert('posted!');
        });
        result.error((data, status, headers, config) => {
          alert('processHttpError');
        });
    }

}]);
