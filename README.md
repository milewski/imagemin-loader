# imagemin-loader

[![Build Status](https://travis-ci.org/Milewski/imagemin-loader.svg?branch=master)](https://travis-ci.org/Milewski/imagemin-loader)
[![npm version](https://badge.fury.io/js/imagemin-loader.svg)](https://badge.fury.io/js/imagemin-loader)
[![npm downloads](https://img.shields.io/npm/dm/imagemin-loader.svg)](https://www.npmjs.com/package/imagemin-loader)

Imagemin hook for webpack 2

> Minify all images seamlessly with [imagemin](https://github.com/kevva/imagemin)

## Oh. but Why?

Because none of the other loaders out there would allow me to use my own imagemin plugin.

## Install

```bash
$ npm install imagemin-loader -D
```
## Usage

In your `webpack.config.js` add the imagemin-loader, chained with the [file-loader](https://github.com/webpack/file-loader), [url-loader](https://github.com/webpack/url-loader) or [raw-loader](https://github.com/webpack/raw-loader):

```js
module: {
    rules: [
        {
            test: /\.(png|jpe?g|gif|svg)$/,
            use: [
                
                /** file-loader | url-loader | raw-loader **/
                { loader: 'file-loader' },
                
                {
                    loader: 'imagemin-loader',
                    options: {
                        // enabled: process.env.NODE_ENV === 'production',
                        plugins: [
                            {
                                use: 'imagemin-guetzli',
                                options: {
                                    quality: 95
                                }
                            },
                            {
                                /** Alternative syntax **/
                                use: require('imagemin-guetzli'),
                                options: {
                                    enabled: process.env.NODE_ENV === 'production',
                                    quality: 50
                                }
                            }
                        ]
                    }
                }
            ]
        }
    ]
}
```
You can use any [imagemin plugin](https://www.npmjs.com/browse/keyword/imageminplugin), simple include it on the plugin array and you will be good to go.

### Options

```typescript
{
    enabled: boolean, // Enable or disable the loader globally
    plugins: [
        {
            use: string|function, // Package name like: 'imagemin-gifsicle', require('imagemin-gifsicle') or a Function
            options: {
                enabled: boolean, // Enable or disable at the plugin level
                ...ImageMinPluginOptions // Specific plugin options
            }
        }
    ]
}
```
## License

[MIT](LICENSE)
