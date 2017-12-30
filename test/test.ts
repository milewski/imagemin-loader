import * as expect from 'expect.js'
import * as fs from 'fs'
import * as path from 'path'
import { default as loader } from '../source/loader'

const sampleJPG = fs.readFileSync(path.resolve(__dirname, 'source.jpg'))
const samplePNG = fs.readFileSync(path.resolve(__dirname, 'source.png'))

describe('Loader', () => {
    it('should not proceed if it has been disabled', () => {
        let context = {
            loader,
            query: {
                enabled: false
            },
            async() {
                expect().fail('it should never ever come here')
            }
        }

        context.loader(sampleJPG)
    })

    it("should do nothing if options aren't specified", () => {
        expect(loader(sampleJPG)).to.eql(sampleJPG)
    })

    it('should accept any imagemin plugin', done => {
        let context = {
            loader,
            query: {
                plugins: [
                    {
                        use: require('imagemin-mozjpeg'),
                        options: {
                            quality: 50
                        }
                    }
                ]
            },
            async() {
                return (error, buffer) => {
                    if (error) return done(error)

                    expect(buffer).not.eql(sampleJPG)
                    expect(buffer.byteLength).to.be.below(sampleJPG.byteLength)

                    done()
                }
            }
        }

        context.loader(sampleJPG)
    })

    it('should also accept a string instead of function for plugins', done => {
        let context = {
            loader,
            query: {
                plugins: [
                    {
                        use: 'imagemin-pngquant',
                        options: {
                            quality: '50-60'
                        }
                    }
                ]
            },
            async() {
                return (error, buffer) => {
                    if (error) return done(error)

                    expect(buffer).not.eql(samplePNG)
                    expect(buffer.byteLength).to.be.below(samplePNG.byteLength)

                    done()
                }
            }
        }

        context.loader(samplePNG)
    })

    it('should accept any imagemin plugin', () => {
        let context = {
            loader,
            query: {
                plugins: [{ use: 'im-a-invalid-plugin' }]
            }
        }

        expect(() => {
            context.loader(sampleJPG)
        }).to.throwException(/npm install im-a-invalid-plugin --save/)
    })

    it('should not accept invalid options', () => {
        let context = {
            loader,
            query: {
                plugins: {
                    wrong: 'it should be an array'
                }
            }
        }

        expect(() => {
            context.loader(sampleJPG)
        }).to.throwException(/should be array/)
    })

    it('should allow to disable at plugin level', done => {
        let context = {
            loader,
            query: {
                plugins: [
                    {
                        use: 'imagemin-pngquant',
                        options: {
                            quality: '50-60'
                        }
                    },
                    {
                        use: 'imagemin-mozjpeg',
                        options: {
                            enabled: false,
                            quality: 20
                        }
                    }
                ]
            },
            async() {
                return (error, buffer) => {
                    if (error) return done(error)

                    expect(buffer).to.eql(sampleJPG)

                    done()
                }
            }
        }

        context.loader(sampleJPG)
    })
})
