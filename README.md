[postcss](https://github.com/postcss/postcss)-[pie](http://css3pie.com/)

# This is a forked version of [gucong3000](https://github.com/gucong3000)'s implementation

Original Version [Here](https://github.com/gucong3000/postcss-pie)  
*Differences*:

* Translation of comments/readme formatting of code for readability
* allow boxsizing .htc plugin to be used as an option

<br/>

[![NPM version](https://img.shields.io/npm/v/postcss-pie.svg?style=flat-square)](https://www.npmjs.com/package/postcss-pie)
[![Travis](https://img.shields.io/travis/gucong3000/postcss-pie.svg?&label=Linux)](https://travis-ci.org/gucong3000/postcss-pie)
[![AppVeyor](https://img.shields.io/appveyor/ci/gucong3000/postcss-pie.svg?&label=Windows)](https://ci.appveyor.com/project/gucong3000/postcss-pie)
[![Coverage Status](https://img.shields.io/coveralls/gucong3000/postcss-pie.svg)](https://coveralls.io/r/gucong3000/postcss-pie)

Extending CSS3 features into earlier IE

------

Allows the use of the CSS PIE library within a [PostCSS](https://github.com/postcss/postcss) process. This enables compatibility with IE6-IE9 via the simple inclusion of this file in your post css chain

Some enabled properties:

*   [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius)
*   [box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
*   [border-image](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image)
*   [CSS3 Backgrounds](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Background_and_Borders/Using_CSS_multiple_backgrounds)
*   [Gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Using_CSS_gradients)

## Usage

1.   [Download the PIE distribution](http://css3pie.com/download-latest) and extract to a local directory: `/path/to/pie_files/`
1.   config postcss within your build chain

    ```JavaScript
    var postcss = require('postcss');
    var css_pie = require('postcss-pie');

    postcss([
        css_pie({
            htcPath: '/path/to/pie_files/PIE.htc'
        })
    ]);
    ```

### _Edge Case_

If a background property is not a gradient, it does not need the behavior prefix in versions of IE less than IE9, 
thus we supply `behavior: none\9\0;` directly afterwards. Amusingly, if the `:root` pseudo-selector is used, 
once again the behaviour property is needed.

Please note due to this, the result is **invalid css**!!

### _From the original documentation_ - [Serving the correct Content-Type](http://css3pie.com/documentation/known-issues/#content-type)

> IE requires that HTC behaviours are served up with a content-type header of "text/x-component", otherwise it will simply ignore the behavior. Many web servers are preconfigured to serve the correct content-type, but others are not.
> If you have problems with the PIE behavior not being applied, check your server configuration and if possible update it to use the correct content-type. For Apache, you can do this in a `.htaccess` file:

> ```
> AddType text/x-component .htc
> ```

## Options

Invoking `css_pie` with an objections object will return a PostCSS plugin for the plugin chain.  
See [PostCSS API](https://github.com/postcss/postcss/blob/master/docs/api.md) for plugin usage documentation.

There are three options

*   `htcPath` (string): the path to the `PIE.htc` file. Subject to the same .htc restrictions, this file must be an absolute path from the server domain e.g. `/root/path/to/htc/resources/PIE.htc`. If you're unable to do this, consider the JavaScript loading behaviour of [pie-js](http://css3pie.com/documentation/pie-js/).
*   `pieLoadPath` (string): this path is only relevant if using JavaScript for `PIE_IE9.js` and `PIE_IE678.js`, and will be the absolute URL path to their parent folder. If not supplied, the path will default to the `htcPath`. If neither are supplied, this option is disabled.
*   `boxSizingPath` (string): this is an expansion to the original work, that adds an invalid prefix `*behavior` to any `box-sizing: border-box;` property, for the use case in [Schepp's box-sizing polyfill](https://github.com/Schepp/box-sizing-polyfill)

## [PIE documentation](http://css3pie.com/documentation/)

### Development

Install the required packages via `npm install`, and ensure you have `npm install --global mocha`;

**Running Tests**  
simply run `npm test` from the root directory.  
The first step is linting, then the tests will read in the fixture files and verify the correctness of output.