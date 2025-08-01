(function () {
  const utils = {
    request: function(method, url, data) {
      let cancel = function() {}

      return [new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest()
  
        xhr.open(method, url, true)
        xhr.setRequestHeader('Content-Type', 'application/json')
  
        xhr.onload = function() {
          if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response ? JSON.parse(xhr.response) : '')
          } else {
            reject(new Error(xhr.statusText || xhr.responseText))
          }
        }
  
        xhr.onerror = function() {
          reject(new Error(xhr.statusText))
        }

        cancel = function() {
          xhr.abort()
          reject(new Error('Request canceled'))
        }

        xhr.send(data ?JSON.stringify(data) : null)
      }), cancel]
    }
  }

  window.utils = utils
})();
