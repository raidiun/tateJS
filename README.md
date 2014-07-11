tateJS
======

A javascript gallery creator/controller

Two versions are present. **tateModern.js** uses a ```<div>``` filled with ```<img>``` elements to create the gallery
whilst **tate.js** uses a ```<script>``` tag that contains the setup instructions after which the gallery viewer is
placed. I like to think that **tateModern.js** has better code but it is bigger (Though has a minified version). It also
has a nicer degrade if the user doesn't support JS.

##tateModern.js
tateModern only really has one interface: 
```js
tateJS.createViewerFor(divId,opts)
```
Here ```divId``` is the id of the ```<div>``` containing the ```<img>``` elements that make up the gallery. The images
in the gallery will be in the order that the ```<img>``` elements are in the div.
```opts``` is detailed below.

##tate.js
tate (classic) has three interfaces:
```js
tateJS.newGallery(galleryName)
tateJS.addImageTo(galleryName,imageSrc,imageAltText)
tateJS.viewer.createViewerFor(galleryName,opts)
```
 - ```newGallery()``` is required to add the gallery's name to the dictionary in case of multiple galleries on a page.
 This must be called before any function requiring a gallery name.
 - ```addImageTo()``` is called to add a new image to a gallery. Images will appear in the order that they are added.
 - ```createViewerFor()``` is much the same as for tateModern but the viewer ```<div>``` will appear after the
 ```<script>``` element in which this function is called.

##The ```opts```
```json
  defaultOpts: {  canExpand: true,    //Do images expand when clicked
                  cycles: false,      //Does the gallery automatically cycle
                  hasControls: true,  //Does the viewer have controls
                  width: 4            //How many images in the viewer 
                  }
```
The ```opts``` argument is a JSO as outlined above. Any option left undefined will take the default values shown above.

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
