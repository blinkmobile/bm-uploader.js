# blob-uploader.js

This library wraps the blob uploader service [Blob uploader](https://github.com/blinkmobile/blob-uploader) and AWS S3 to allow uploading and retrieval of content from S3 without having to work with AWS credentials and the AWS SDK directly.

## Usage
1.  Initialise the BlobUploader with the URL of the blob uploader service, e.g. 
```
new BlobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
```
2.  To upload content (where that content is either a buffer, blob or stream) call blobUploader.UploadContent which supports a progress event, cancellation and will adjust to network conditions. This function takes as parameters the content to be uploaded and a function that will be called with a progress event(OPTIONAL). This will return a Promise that will resolve with an object that includes the id that can be used later to retrieve the content, a function upload() which returns a promise that will resolve when the upload succeeds or rejects if the upload fails or is stopped, and a function cancel() that will abort the upload. The progress function will called with two parameters, uploaded (number of bytes uploaded) and total(number of bytes being uploaded) 
```
function progressFn (uploaded, total) {
  const percentage = parseInt((uploaded * 100) / total)
  // update progress indicator
}

function cancelOnClick() {
  if (cancelFn) {
    cancelFn()
  }
}

let cancelFn

blobUploader.uploadContent(content, progressFn)
  .then((uploader) => {
    cancelFn = uploader.cancel
    return uploader.upload()
      .then(() => {
        cancelFn = undefined
        //store uploader.id or use to retrieve a GET URL as per step 3 below
      })
  })
  .catch((err) => //error handling)
```
3.  To retrieve a URL to the content in S3, call blobUploader.retrieveContentUrl. This will return a Promise that will resolve to a URL that can be used with HTTP GET to retrieve the content.
```
blobUploader.retrieveContentUrl(id)
  .then((getUrl) => //use HTTP GET to retrieve content)
```

## Example
See [Example](../example/index.html) of using the library for uploading blobs(files in this example) and images
