// @flow
'use strict'

const privateVars = new WeakMap()

function blobUploader (apiUrl /* :string */) {
  if (!apiUrl) {
    throw new TypeError('blobUploader expects a api URL during instansiation')
  }
  privateVars.set(this, {
    uri: apiUrl
  })
}

blobUploader.prototype.uploadBlob = function (
  blob /*: Blob */
) /* :Promise<number> */ {
  if (!blob) {
    return Promise.reject(new Error('blob argument not provided'))
  }

  if (!privateVars || !privateVars.get(this)) {
    return Promise.reject(new Error('blobUploader uri not configured'))
  }
  const vars = privateVars.get(this)
  if (!vars || !vars.hasOwnProperty('uri')) {
    return Promise.reject(new Error('blobUploader uri not configured'))
  }

  const request = new Request(vars.uri, {
    method: 'POST',
    mode: 'cors'
  })

  return fetch(request)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(new Error('Error calling blob api service: ' + response.status + ' ' + response.statusText))
      }
      return response.json()
    })
    .then((apiResponse) => {
      this._uploadToS3(blob, apiResponse.putUrl)
      return apiResponse.id
    })
    .catch((err) => Promise.reject(new Error('Error calling blob api service: ' + err)))
}

blobUploader.prototype._uploadToS3 = function (
  blob /* :Blob */,
  url /*: string */
) /* :Promise<void> */ {
  const request = new Request(url, {
    method: 'PUT',
    mode: 'cors',
    body: blob,
    headers: new Headers({
      'Content-Type': ' '
    })
  })

  return fetch(request)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(Error('Error uploading to S3: ' + response.status + ' ' + response.statusText))
      }
    })
    .catch((err) => Promise.reject(new Error('Error uploading to S3: ' + err)))
}

blobUploader.prototype.retrieveBlobUrl = function (
  uuid /* :string */
) /* :Promise<string> */ {
  if (!uuid) {
    return Promise.reject(new Error('uuid argument not provided'))
  }

  if (!privateVars || !privateVars.get(this)) {
    return Promise.reject(new Error('blobUploader uri not configured'))
  }
  const vars = privateVars.get(this)
  if (!vars || !vars.hasOwnProperty('uri')) {
    return Promise.reject(new Error('blobUploader uri not configured'))
  }

  const request = new Request(vars.uri + uuid, {
    method: 'PUT',
    mode: 'cors'
  })

  return fetch(request)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(new Error('Error calling blob api service: ' + response.status + ' ' + response.statusText))
      }
      return response.json()
    })
    .then((apiResponse) => {
      return apiResponse.getUrl
    })
    .catch((err) => Promise.reject(new Error('Error calling blob api service: ' + err)))
}

module.exports = blobUploader
