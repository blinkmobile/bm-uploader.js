'use strict'

/* eslint-disable */
describe('blobuploader', () => {

  var originalTimeout;
    beforeEach(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000
      fetchMock
        .post(/https:\/\/bm-blob-uploader-dev.api.blinkm.io\/v1\/signedURL/, { putUrl: 'www.putUrl.com', id: 'abc123' })
        .put(/https:\/\/bm-blob-uploader-dev.api.blinkm.io\/v1\/signedURL/, { getUrl: 'www.getUrl.com' })
        .put(/www.putUrl.com/, 200)
        .spy()
    })

    afterEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      fetchMock.restore()
    })
    
  describe('Constructor', () => {
    it('should throw a type error if no url is supplied', () => {
      expect(() => { blobUploader() }).toThrow()
    })

    it('should succeed if url is supplied', () => {
      expect(() => { blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/') }).toBeDefined()
      // expect(() => { var a = true }).toThrow()
    })
  })

  describe('uploadBlob', () => {
    it('should reject if blob not passed in', (done) => {
      const uploader = new blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
      uploader.uploadBlob()
        .then((id) => { done.fail() })
        .catch((err) => { done() })
    })

    it('should succeed when given a blob', (done) => {
      const uploader = new blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
      try {
      uploader.uploadBlob(new Blob(['111']))
        .then((id) => {
          expect(id.length).toBeGreaterThan(0)
          done()
        })
        .catch((err) => { done.fail(err) })
      }
      catch(e) {
        done.fail(e)
      }
    })
  })

  describe('retrieveBlobUrl', () => {
    it('should reject if uuid not passed in', (done) => {
      const uploader = new blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
      uploader.retrieveBlobUrl()
        .then((blob) => { done.fail() })
        .catch((err) => { done() })
    })

    it('should succeed when given a valid uuid', (done) => {
      const uploader = new blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
      try {
      uploader.uploadBlob(new Blob(['111']))
        .then((id) => {
          expect(id.length).toBeGreaterThan(0)
          uploader.retrieveBlobUrl(id)
            .then((url) => {
              expect(url).toBeDefined()
              expect(url.length).toBeGreaterThan(0)
              done()
            })
            .catch((err) => { done.fail(err) })
        })
        .catch((err) => { done.fail(err) })
      }
      catch(e) {
        done.fail(e)
      }
    })
  })

  describe('managedUpload', () => {
    it('should reject if blob not passed in', (done) => {
      const uploader = new blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
      uploader.managedUpload()
        .then((blob) => { done.fail() })
        .catch((err) => { done() })
    })

    it('should succeed when given a blob', (done) => {
      const uploader = new blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
      try {
      uploader.managedUpload(new Blob(['111']))
        .then((id) => {
          expect(id.length).toBeGreaterThan(0)
          done()
        })
        .catch((err) => { done.fail(err) })
      }
      catch(e) {
        done.fail(e)
      }
    })
  })
})
/* eslint-disable */
