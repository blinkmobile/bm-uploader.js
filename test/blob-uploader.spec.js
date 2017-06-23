'use strict'

/* eslint-disable no-undef */
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
  })
})
/* eslint-disable no-undef */
