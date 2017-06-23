'use strict'

/* eslint-disable */
describe('blobuploader', () => {
  describe('Constructor', () => {
    it('should throw a type error if no url is supplied', () => {
      expect(() => { blobUploader() }).toThrow()
    })

    it('should succeed if url is supplied', () => {
      expect(() => { blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/v1/signedURL/') }).toBeDefined()
      // expect(() => { var a = true }).toThrow()
    })
  })

  describe('#uploadBlob', () => {
    it('should reject if blob not passed in', (done) => {
      const uploader = new blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/v1/signedURL/')
      uploader.uploadBlob()
        .then((id) => { done.fail() })
        .catch((err) => { done() })
    })
    var originalTimeout;
    beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    })

    it('should succeed when given a blob', (done) => {
      const uploader = new blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/v1/signedURL/')
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

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    })
  })
})
/* eslint-disable */
