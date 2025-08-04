(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function() {
      console.log('ServiceWorker registration success')
    }).catch(function(err) {
      console.log('ServiceWorker registration failed: ', err)
    })
  }

  const utils = {
    $: function(selector) {
      return document.querySelector(selector)
    },
    getToken: function() {
      var tokenName = 'BOOTKIT_REQUEST_TOKEN'

      if (localStorage.getItem(tokenName)) {
        return localStorage.getItem(tokenName)
      }

      var tokenMatch = location.href.match(/[?&]token=([^&#]*)/i)

      if (tokenMatch && tokenMatch[1]) {
        var token = decodeURIComponent(tokenMatch[1])
        
        localStorage.setItem(tokenName, token)
        return token
      }

      var token = window.prompt('Please enter your token')

      if (token) {
        localStorage.setItem(tokenName, token)
        return token
      }

      return null
    },
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
