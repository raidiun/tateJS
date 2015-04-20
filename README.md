tateJS
======

A javascript gallery creator/controller

Two versions are present. **tateModern.js** uses a ```<div>``` filled with ```<img>``` elements to create the gallery
whilst **tate.js** uses a ```<script>``` tag that contains the setup instructions after which the gallery viewer is
placed. I like to think that **tateModern.js** has better code but it is bigger (Though has a minified version). It also
has a nicer degrade if the user doesn't support JS.

Each ```<img>``` element used has two optional attributes: ```data-tatejs-caption``` and ```data-tatejs-exp```. The
```-caption``` attribute specifies an alternative caption for the image when "expanded". By default this caption takes the
alt text as its value. The ```-exp``` attribute specifies an alternative source for the expanded image allowing a higher res
image to be used for the expanded state.

##tateModern.js
tateModern only really has one interface: 
```js
tateJS.createViewerFor(divId,opts)
```
Here ```divId``` is the id of the ```<div>``` containing the ```<img>``` elements that make up the gallery. The images
in the gallery will be in the order that the ```<img>``` elements are in the div.
```opts``` is detailed below.

Additionally the image that is in first place in the viewer has the class ```tateJSkeyImage``` applied to enable it to have a
custom styling from the rest of the images.

As for the different versions: **NB: ALL MIN VERS OUT OF DATE (commit:9da1cb1b53fb70d8d633641e2dfe70ed550477aa)**
 - .js is the human readable source with all interfaces with HR-names
 - .mach.js is a machine-minified version of the .js version (http://closure-compiler.appspot.com/ )(With HR-interfaces)
 - .min.js is the hand-minified version. All interfaces except tateJS.createViewerFor() have single letter names
 - .machmin.js is the machine-minified version of the hand-minified version (No HR-interfaces)

##The ```opts```
```js
defaultOpts: {	
		canExpand: true,	//Do images expand when clicked
		cycles: false,		//Does the gallery automatically cycle
		hasControls: true,	//Does the viewer have controls
		hasIndicator: true,	//Does the viewer have a n of x indicator
		width: 4,			//How many images in the viewer 
		skipSize: "width"	//How far does the next button take you
		}
```
The ```opts``` argument is a JSO as outlined above. Any option left undefined will take the default values shown above. 
The ```skipSize``` option has a default value equal to the width. It can be changed to an integer value

**NB: the cycles option currently does nothing** 

##Styling

For both tate and tateModern, the expander (the box that contains the expanded image) has the structure below:
```html
<div id="tateJSexpander">
	<img id="tateJSexpanderImage" />
	<div id="tateJSexpanderCaption"> ... </div>
			
	<div id="tateJSexpanderControls">
		<button>Previous</button>
		<button>Close</button>
		<button>Next</button>
  </div>
</div>
```
Styling can be applied using the CSS id selectors
 
 The viewer (the box containing the full set of images) has the structure:
 ```html
 <div class="tateJSviewer">
  <img class="tateJSthumb" />
  <img class="tateJSthumb" />
  <img class="tateJSthumb" />
  ...
  <img class="tateJSthumb" />
  <div class="tateJSviewerControls">
  	<button>Previous</button>
		<button>Next</button>
  </div>
</div>
 ```
In addition, with tate (classic) each image will have ```id="[galleryName][index]"``` and the main viewer ```<div>```
will have ```id="[galleryName]viewer"```. With tateModern this ```id``` structure is not present. However, the main
viewer ```<div>``` will have ```id="[galleryName]"``` as this is set during creation of the viewer.

###Standard style
```css
.tateJSthumb {
                width:25%;
                float:left;
                }
.tateJSviewer {
                display:block;
                }
#tateJSExpander {
                display:block;
                background-color:#cccccc;
                box-shadow: 5px 5px 5px rgba(0,0,0,0.5);
                position:fixed;
                top:25%;
                left:25%;
                height:50%;
                width:50%;
                padding:1%;
                border-radius:2%;
                }
#tateJSExpanderImage {
                width:100%
                }
#tateJSExpanderCaption {
                float:left;
                }
#tateJSExpanderControls {
                float:right;
                }
```
