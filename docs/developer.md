# blob-uploader.js

This library wraps the blob uploader service [Blob uploader](https://github.com/blinkmobile/blob-uploader) and AWS S3 to allow uploading and retrieval of blobs from S3 without having to work with AWS credentials and the AWS SDK directly.
## Usage
1.  Initialise the BlobUploader with the URL of the blob uploader service, e.g. 
```
new BlobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
```
2.  For simple upload via a single HTTP PUT, blobUploader.uploadBlob with the blob to be uploaded. This will return a Promise that will resolve with the id that can be used later to retrieve the blob.
```
blobUploader.uploadBlob(blob)
```
OR

2.  For a managed upload which supports a progress event, cancellation and will adjust to network conditions, call blobUploader.ManagedUpload. This function takes as parameters the blob to be uploaded and a function that will be called with a progress event(OPTIONAL). This will return a Promise that will resolve with an object that includes the id that can be used later to retrieve the blob, a function upload()which returns a promise that will resolve when the upload succeeds or rejects if the upload fails or is stopped, and a function cancel() that will abort the upload. The progress event call will include a progress parameter with properties loaded and total (see [AWS SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#httpUploadProgress-event))
```
blobUploader.managedUpload(blob, progressFn)
```

3.  To retrieve a URL to the blob in S3, call blobUploader.retrieveBlobUrl. This will return a Promise that will resolve to a URL that can be used with HTTP GET to retrieve the blob.
```
blobUploader.retrieveBlobUrl(id)
```
