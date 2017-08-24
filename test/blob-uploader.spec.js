'use strict'

/* eslint-disable */
describe('Blobuploader', () => {

  var originalTimeout;
  beforeEach(() => {
    fetchMock
      .post(/https:\/\/bm-blob-uploader-dev.api.blinkm.io\/v1\/signedURL/, { putUrl: 'www.putUrl.com', id: 'abc123' })
      .put(/https:\/\/bm-blob-uploader-dev.api.blinkm.io\/v1\/signedURL/, { getUrl: 'www.getUrl.com' })
      .put(/www.putUrl.com/, 200)
      .spy()
  })

  afterEach(() => {
    fetchMock.restore()
  })
    
  describe('Constructor', () => {
    it('should throw a type error if no url is supplied', () => {
      expect(() => { BlobUploader() }).toThrow()
    })

    it('should succeed if url is supplied', () => {
      expect(() => { BlobUploader('https://bm-blob-uploader-dev.api.blinkm.io/') }).toBeDefined()
    })
  })

  describe('retrieveBlobUrl', () => {
    it('should reject if uuid not passed in', (done) => {
      const uploader = new BlobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
      uploader.retrieveBlobUrl()
        .then((blob) => { done.fail() })
        .catch((err) => { done() })
    })

    it('should succeed when given a id', (done) => {
      const uploader = new BlobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
      try {
        uploader.retrieveBlobUrl('1234')
          .then((url) => {
            expect(url).toBeDefined()
            expect(url.length).toBeGreaterThan(0)
            done()
          })
          .catch((err) => { done.fail(err) })
      }
      catch(e) {
        done.fail(e)
      }
    })
  })

  describe('uploadBlob', () => {
    it('should reject if blob not passed in', (done) => {
      const uploader = new BlobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
      uploader.uploadBlob()
        .then((id) => { done.fail() })
        .catch((err) => { done() })
    })

    it('should succeed when given a blob', (done) => {
      const uploader = new BlobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
      try {
      uploader.uploadBlob(new Blob(['111']))
        .then((uploader) => {
          expect(uploader.id.length).toBeGreaterThan(0)
          done()
        })
        .catch((err) => { done.fail(err) })
      }
      catch(e) {
        done.fail(e)
      }
    }, 150000)
  })

  describe('uploadImage', () => {
    it('should reject if image not passed in', (done) => {
      const uploader = new BlobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
      uploader.uploadImage()
        .then((id) => { done.fail() })
        .catch((err) => { done() })
    })

    it('should succeed when given a Image', (done) => {
      const uploader = new BlobUploader('https://bm-blob-uploader-dev.api.blinkm.io/')
      try {
      uploader.uploadImage(new Image(100, 200))
        .then((uploader) => {
          expect(uploader.id.length).toBeGreaterThan(0)
          done()
        })
        .catch((err) => { done.fail(err) })
      }
      catch(e) {
        done.fail(e)
      }
    }, 150000)
  })
})
/* eslint-disable */
