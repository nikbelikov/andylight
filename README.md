# Andylight

Frontend template for quick start of your work.

## How to start?

You need to install these things first:

- [nodejs и npm](https://nodejs.org/)
- [gulp](http://gulpjs.com/)

Next execute following comands in your terminal:

```
sudo npm i
gulp copy-bootstrap
gulp build
```

After downloading all dependencies of the project and successful first build execute `gulp` or `gulp-serve` task and you can do your work further.

## What's in the box?

- [BrowserSync](http://www.browsersync.io/)
- jade and sass compilation
- styles, scripts ([ES2015](https://github.com/lukehoban/es6features)) and images minification

### BrowserSync

`gulp serve` task will open tab in the browser,  and you will see local and external paths to your project in the console. So you can debug sources in different browsers and devices at the same time.

### Jade

There are templates for generation in src/jade folder. After `gulp jade` task execution html-files will appear in the root folder.

By default there is one index.jade in whome includes/head.jade, includes/header.jade and includes/footer.jade are including. It will be right to use them in other new templates.

The files in src/jade/includes folder will not be compiled.

### Styles

All the styles are locatad in src/sass folder. Gulp combines them into the one main.min.css and puts it into the dist/css folder.

All files are presents logical blocks. If you want to add onother one, create the new sass-file and include it into the main.sass.

If you want to connect some other styles, add them into the csslibs variable in gulpfile.js and execute `gulp csslibs` task. Also uncomment link string in src/jade/includes/head.jade.

You can use [gulp-uncss](https://www.npmjs.com/package/gulp-uncss) to clear unused styles (gulpfile.js: `sass-build` task).

Try to follow codestyle in your files to ensure high speed of development and supporting your projects.

#### Postcss

[Postcss](https://github.com/postcss/postcss) [plugins](http://postcss.parts/) are used for changing compiled css.

- [autoprefixer](https://github.com/postcss/autoprefixer) (automatically inserts browser prefixes)
- [cssnano](https://github.com/ben-eb/cssnano) (compresses css-code)

### Images

`gulp images` taks is used for images compression (including `gulp webp`). You can execute it by youself or by starting `gulp` task. After that each picture, which is dropped into the src/img folder, will be compressed and copied into dist/img folder with the same name. Also there Webp-images are using. You can use them so:

**html:**

```
<picture>
	<source srcset="dist/img/image.webp" type="image/webp">
	<img src="dist/img/image.jpg">
</picture>
```

**css (with [modernizr](https://modernizr.com/)):**

```
body
    background-position: center center
    background-attachment: fixed

.no-webp body
    background-image: url(#{$img}/bg-main.jpg)

.webp body
    background-image: url(#{$img}/bg-main.webp)
```

You can use [SVG icon system](https://css-tricks.com/svg-symbol-good-choice-icons/). These symbols are described once in the beginning of the document (hidden svg tag), and then you can use these icons in any places of your project. You can change their fill color, size, apply css transformations (rotate, skew ect.), and animate them (fill, width ect.) with [transitions](http://www.w3schools.com/css/css3_transitions.asp) or [keyframes](http://www.w3schools.com/cssref/css3_pr_animation-keyframes.asp).

Example:

```
...
</head>
<body>
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
        <symbol id="icon-test" viewBox="0 0 100 100">
            <path d="..."></path>
        </symbol>
    </svg>
    
	...
	
	<svg class="icon-test">
		<use xlink:href="#icon-test"></use>
	</svg>
	...
```

You can use [gulp-svgstore](https://www.npmjs.com/package/gulp-svgstore) to automate this process.

#### Favicons

For generating favicons you can use [RealFaviconGenerator](http://realfavicongenerator.net/). Put all of the generated icons in `/src/favicons` folder.

[More about favicons](https://github.com/audreyr/favicon-cheat-sheet).

### Scripts

[Browserify](http://browserify.org/) is used to build your and other modules .

All needed packages are installing with [npm](https://www.npmjs.com/) (`sudo npm i packagename -SE`) and after that you can use them in the code. For example:

`import $ from 'jquery';`

An entry point of the application is `src/js/app.js`.

### Final build

After another finished part of your project make `gulp build` task to bring result files to the right way. Thus javascript will be minified, sourcemap will be cleared and will happen other useful things.

### Testing

Open browser's console and execute following command:

```
var a,w=document.createTreeWalker(document,NodeFilter.SHOW_TEXT);while(a=w.nextNode()){if(a.textContent.trim().length)a.textContent='Одиннадцатиклассница пошла посмотреть на достопримечательность, она шла долго, несколько строчек, пока не пришла'}
```

It will help you see, where sick places are locating.

This code was taken from [Habrahabr article](http://habrahabr.ru/company/2gis/blog/246831/) (2GIS).

Also you can use [Google Chrome extension](http://goo.gl/3xt6MV).

## Contacts

If you have some questions or wishes, feel free to contact me in [nikbelikov@me.com](mailto:nikbelikov@me.com) or [tweet me](https://twitter.com/_nikbelikov).

## License

Copyright (c) 2014-2016 [nikbelikov.ru](http://nikbelikov.ru/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
