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

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', privateVars.get(this).uri, true)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) { // success response
          // now upload the file to S3 using the returned url
          const obj = JSON.parse(xhr.responseText)
          return this._uploadToS3(blob, obj.putUrl)
            .then(() => {
              resolve(obj.id)
            })
            .catch(reject)
        } else {
          return reject(new Error('Error calling blob upload service ' + xhr.status + ' message: ' + xhr.responseText))
        }
      }
    }
    xhr.send()
  })
}

blobUploader.prototype._uploadToS3 = function (blob, url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url, true)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve()
        } else {
          reject(new Error('Error uploading file: ' + xhr.status + ' message: ' + xhr.responseText))
        }
      }
    }
    xhr.setRequestHeader('Content-type', ' ') // suppress Content-type header
    xhr.send(blob)
  })
}

module.exports = blobUploader
