# blob-uploader.js

This library wraps the blob uploader service [Blob uploader](https://github.com/blinkmobile/blob-uploader) and AWS S3 to allow uploading and retrieve of blobs from S3 without having to work with AWS credentials and the AWS SDK directly.
## Usage
1.  Initialise the blobUploader with the URL of the blob uploader service, e.g. 
```
new blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
```
2.  To upload a blob call blobUploader.UploadBlob which supports a progress event, cancellation and will adjust to network conditions. This function takes as parameters the blob to be uploaded, a function that will be called with a progress event(OPTIONAL) and an event name that will be used to a listen for event to signal cancelling the upload(OPTIONAL). This will return a Promise that will resolve with the id that can be used later to retrieve the blob. The progress event call will include a progress parameter with properties loaded and total (see [AWS SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#httpUploadProgress-event))
```
blobUploader.uploadBlob(blob, progressFn, cancelEventName)
```

3.  To retrieve a URL to the blob in S3, call blobUploader.retrieveBlobUrl. This will return a Promise that will resolve to URL that get by used with HTTP GET to retrieve the blob.
```
blobUploader.retrieveBlobUrl(id)
```
