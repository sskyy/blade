Blade  V0.0.1
==============

Blade is a Sketch 3 plugin for automatically HTML generating. It will generate tag `<div>` for group, tag `<p>` for text , etc. 

##Notice##

 - This plugin now work for **latest Sketch beta or version above 3.0.3(7882)** !!!.
 - This version is more stable now, but may still have problem with mega size sketch file.
 - Please group all you layer in one group as the demo shows, for I have not test it with artboard.


##Quick start##

I'm strongly suggest you watch this video. [blade demo](http://vimeo.com/97899465)

or you can simply:

 - Clone or download the repo.
 - Place everything in `dist` folder into your sketch plugin folder.[See where are plugin located?](http://bohemiancoding.com/sketch/support/developer/01-introduction/01.html)
 - Group all your layer in one group( artboard are not supported)and run blade.
 - Blade will generate a new folder just in the same folder which you put your sketch file in.
 
 

##Amazing features##

I uploaded a demo sketch file and the generated HTML files which shows some magic. Have a quick look here:

###1. My sketch file:

<img width= "100%" src = "https://raw.githubusercontent.com/sskyy/blade/master/demo/1.png"/>

You may notice the special layer names such as `[btn]` or `input[text]`. The `[***]` is what I called `directive`, similar to AngularJS's directive. The directive will tell blade what kind to dom element should be generate or this layer. And some powerful directives may generate scripts to make element interactive.


###2. The Generated HTML:

<img  width= "100%" src = "https://raw.githubusercontent.com/sskyy/blade/master/demo/2.png"/>

As it shows, blade generate a input element for the layer which name is `input[text]` and a button for `[btn]`.

###3. What does `[case]` do?:

<img  width= "100%" src = "https://raw.githubusercontent.com/sskyy/blade/master/demo/3.png"/>

Press `shift` down on the web page, then you will see the green border and two tabs, each one was generated for the layer which has directive `[case]`. Click the tab(don't release the `shift` before click) then you can change which should show as below:

<img  width= "100%" src = "https://raw.githubusercontent.com/sskyy/blade/master/demo/4.png"/>

##What's next?##

build-in directives:

 - [x] case
 - [x] btn
 - [x] center
 - [x] width
 - [x] height
 - [x] ignore
 - [x] a
 - [ ] checkbox
 - [ ] hover
 - [ ] alert
 - [ ] password
 - [ ] select
 - [ ] textarea
 - [ ] closeable

I will continue write magic tags for blade, and trying to integrate AngularJS to help build better prototype。

##How to contribute?##

- Install nodejs and [gulp](http://gulpjs.com/).
- Enter into the repo folder and run `gulp`, then gulp will watch all the files in `src` and automatically build it into `dist` folder.
- please feel free to contact me at any time if you have problem.


