'use strict'

const privateVars = new WeakMap()

function blobUploader (apiUrl) {
  if (!apiUrl) {
    throw new TypeError('blobUploader expects a api URL during instansiation')
  }
  privateVars.set(this, {
    uri: apiUrl
  })
}

blobUploader.prototype.uploadBlob = function (blob) {
  if (!blob) {
    return Promise.reject(new Error('blob argument not passed in'))
  }

  const request = new Request(privateVars.get(this).uri, {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    headers: new Headers({
      'Content-Type': 'text/plain'
    })
  })

  return fetch(request)
    .then((response) => {
      return response.json()
    }).then((apiResponse) => {
      this._uploadToS3(blob, apiResponse.putUrl)
      return apiResponse.id
    })
}

blobUploader.prototype._uploadToS3 = function (blob, url) {
  var request = new Request(url, {
    method: 'PUT',
    mode: 'cors',
    redirect: 'follow',
    body: blob,
    headers: new Headers({
      'Content-Type': ' '
    })
  })

  return fetch(request)
}

module.exports = blobUploader
