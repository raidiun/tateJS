var tateJS = {
    
    galleries: {},//Key-value pairs containing the gallery objects
    
    GalleryObj: function(array,width,position) {
                        this.array = array;			//Array of image objects
                        this.width = width;			//Number of images
                        this.position = position;	//Index of currently displayed first image
						this.hasIndicator = false;	//Default indicator status
						this.skip = width;			//Default skipSize
                        },
    
    ImageObj: function(elem,caption,galleryKey,idx) {
                        this.elem = elem;				//Reference to the image element
                        this.idx = idx;					//Index of the image within the
                        this.galleryKey = galleryKey;	//Key of the gallery within tateJS.galleries
                        this.caption = caption;			//Caption text for the image
                        this.visible = true;			//Whether the element is visible (May not be needed given we have [gallery].position)
                        },
    
    expanded: undefined,	//Reference to the currently expanded image object
    
    expander: undefined,	//Reference to the expander div and its children
    
    setupGallery: function(galleryKey,nodeList) {	//Setup a new gallery with key=galleryKey from the supplied nodeList
                        var imgArr = [];
                        
                        for(var idx=0,l=nodeList.length;idx<l;idx++) {
                            var image = nodeList[idx];
                            image.className += " tateJSthumb";
                            var caption = image.getAttribute("data-tatejs-caption");
                            if(caption == "" || caption == undefined) {
                                caption = image.alt;
                                }
                            imgArr.push(new tateJS.ImageObj(image,caption,galleryKey,idx));
                            }
                        tateJS.galleries[galleryKey] = new tateJS.GalleryObj(imgArr,0,0);
                        return(tateJS.galleries[galleryKey]);
                        },
    
    defaultOpts: {      canExpand: true,	//Default options for a gallery
                        cycles: false,
                        hasControls: true,
						hasIndicator: true,
                        width: 4,
						skipSize: "width"
                        },
    
    createViewerFor: function(divId,opts) {		//Create a viewer for the images in the div with divId
                        for(option in tateJS.defaultOpts) {
                            if(opts[option] === undefined) {
                                opts[option] = tateJS.defaultOpts[option];
                                }
                            }
        
                        var viewerDiv = document.getElementById(divId);
                        viewerDiv.className += " tateJSviewer";
        
                        var gallery = tateJS.setupGallery(divId,viewerDiv.getElementsByTagName("img"));//Setup gallery in tateJS.galleries
        
                        if(opts.canExpand === true) {
                            for(var idx=0,l=gallery.array.length;idx<l;idx++) {
                                (function(idx){//Strange closure syntax to freeze the idx variable (See http://www.mikeplate.com/2011/11/24/creating-a-closure-in-javascript/ )
                                    (gallery.array[idx]).elem.addEventListener("click",function(){tateJS.expand((tateJS.galleries[divId]).array[idx])});
                                    })(idx);
                                }
                            }
        
                        gallery.width = opts.width;
                        gallery.position = 0;
						gallery.skip = opts.width;
						
						if(opts.skipSize != "width") {
							gallery.skip = Number(opts.skipSize);
							}
        
                        if(opts.hasControls === true) {		//If opts specifies controls, setup the controls
                            var viewerControls = document.createElement("div");
                            viewerControls.className = "tateJSviewerControls";
                            
                            var prevButton = document.createElement("button");
							prevButton.className += " tateJSprev";
                            prevButton.addEventListener("click",function(){tateJS.viewerPrev(divId)});
                            prevButton.innerHTML = "Previous";
							
							if(opts.hasIndicator == true) {
								var indicator = document.createElement("div");
								indicator.id = (divId + "Indicator");
								}
                            
                            var nextButton = document.createElement("button");
							nextButton.className += " tateJSnext";
                            nextButton.addEventListener("click",function(){tateJS.viewerNext(divId)});
                            nextButton.innerHTML = "Next";
                            
                            viewerControls.appendChild(prevButton);
                            viewerControls.appendChild(nextButton);
                            
                            if(gallery.array.length<=opts.width) {
                                nextButton.disabled = true;
                                }
                            
                            prevButton.disabled = true;
                            viewerDiv.appendChild(viewerControls);
                            }
		
						if(opts.hasIndicator == true) {
							var indicator = document.createElement("span");
							indicator.id = divId + "Indicator";
							indicator.className = "tateJSIndicator";
							viewerControls.appendChild(indicator);
							gallery.hasIndicator = true;
							}
        
                        if(gallery.array.length>opts.width) {//Set the visible images
                            tateJS.setVisible(divId,0,(opts.width-1));
                            }
                        else {
                            tateJS.setVisible(divId,0,(gallery.array.length-1));
                            }
        
                        if(opts.cycles != undefined) {
                            //Setup animation loop **DOES NOTHING AOY**
                            }
                        },
    
    setVisible: function(galleryKey,startNum,endNum) {	//Make images in gallery visible if index is between startNum and endNum
                        var gallery = tateJS.galleries[galleryKey];
                        for(var idx=0,l=gallery.array.length;idx<l;idx++) {
							if(startNum == idx) {
								(gallery.array[idx]).elem.className += " tateJSkeyImg";
								}
							else {
								//Ref: http://stackoverflow.com/questions/9959781/remove-classname-from-element-with-javascript
								(gallery.array[idx]).elem.className = (gallery.array[idx]).elem.className.replace(/(?:^|\s)tateJSkeyImg(?!\S)/,"");
								}
                            if((startNum<=idx) && (idx<=endNum)) {
                                (gallery.array[idx]).elem.style.display = "inline";
                                }
                            else {
                                (gallery.array[idx]).elem.style.display = "none";
                                }
                            }
						tateJS.updateIndicator(galleryKey);
                        },
	
	updateIndicator: function(galleryKey) {
						var gallery = tateJS.galleries[galleryKey];
						if(gallery.hasIndicator) {
							var indicator = document.getElementById(galleryKey + "Indicator");
							var skipSize = gallery.skip;
							
							var pages;
							if(gallery.array.length % skipSize) {
								pages = Math.floor(gallery.array.length/skipSize) + 1;
								}
							else {
								pages = gallery.array.length/skipSize;
								}
							
							var cPage;
							if(gallery.position % skipSize) {
								cPage = Math.ceil(gallery.position/skipSize) + 1;
								}
							else {
								cPage = gallery.position/skipSize + 1;
								}
			
							indicator.innerHTML = String(cPage) + " of " + String(pages);
							}
						},
    
    viewerNext: function(galleryKey) {		//Next button for viewer with galleryKey
                        var gallery = tateJS.galleries[galleryKey];
                        var newStart = gallery.position + gallery.skip;
                        var newEnd = newStart + gallery.width - 1;
						var length = gallery.array.length;
                        var overflow = false;
                        
                        if(newEnd>(length-2)) {
                            newEnd = length - 1;
                            newStart = length - gallery.width;
                            overflow = true;
                            }
                        var controls = document.getElementById(galleryKey).getElementsByClassName("tateJSviewerControls")[0].childNodes;
                        for(var idx=0;idx<2;idx++) {
                            switch(controls[idx].innerHTML) {
                                case "Next":
                                    if(overflow == true) {
                                        controls[idx].disabled = true;
                                        }
                                    break;
                                case "Previous":
                                    controls[idx].disabled = false;
                                    break;
                                }
                            }
                        gallery.position = newStart;
						tateJS.setVisible(galleryKey,newStart,newEnd);
                        },
    
    viewerPrev: function(galleryKey) {		//Prev button for viewer with galleryKey
                        var gallery = tateJS.galleries[galleryKey];
                        var newStart = gallery.position - gallery.skip;
                        var newEnd = newStart + gallery.width - 1;
						var length = gallery.array.length;
                        var overflow = false;
                        
                        if(newStart<=0) {
                            newStart = 0;
                            newEnd = gallery.width - 1;
                            overflow = true;
                            }
                        
                        var controls = document.getElementById(galleryKey).getElementsByClassName("tateJSviewerControls")[0].childNodes;
                        for(var idx=0;idx<2;idx++) {
                            switch(controls[idx].innerHTML) {
                                case "Next":
                                    controls[idx].disabled = false;
                                    break;
                                case "Previous":
                                    if(overflow == true) {
                                        controls[idx].disabled = true;
                                        }
                                    break;
                                }
                            }
                        gallery.position = newStart;
                        tateJS.setVisible(galleryKey,newStart,newEnd);
                        },
    
    expand: function(imageObj) {	//Set specified image as expanded image
                        var expander = tateJS.expander;
                        if(expander === undefined) {
                            expander = tateJS.setupExpander();
                            }
                        tateJS.expanded = imageObj;
						var expSrc = imageObj.elem.getAttribute("data-tatejs-exp");
						if(expSrc == undefined || expSrc == "") {
							expSrc = imageObj.elem.src;
							}
						expander.imgElem.src = expSrc;
                        expander.captionElem.innerHTML = imageObj.caption;
                        
                        expander.divElem.style.visibility = "visible";
                        },
    
    expanderNext: function() {		//Next button in expander
                        var galleryKey = tateJS.expanded.galleryKey;
                        var idx = tateJS.expanded.idx;
                        idx++;
                        if(idx>((tateJS.galleries[galleryKey]).array.length - 1)) {
                            tateJS.expand((tateJS.galleries[galleryKey]).array[0]);
                            }
                        else {
                            tateJS.expand((tateJS.galleries[galleryKey]).array[idx])
                            }
                        },
        
    expanderPrev: function() {		//Prev button in expander
                        var galleryKey = tateJS.expanded.galleryKey;
                        var idx = tateJS.expanded.idx;
                        idx--;
                        if(idx<0) {
                            tateJS.expand(((tateJS.galleries[galleryKey]).array)[(tateJS.galleries[galleryKey]).array.length - 1]);
                            }
                        else {
                            tateJS.expand((tateJS.galleries[galleryKey]).array[idx])
                            }
                        },
    
    shrink: function() {		//Close button in expander
                        tateJS.expander.divElem.style.visibility = "hidden";
                        },

    setupExpander: function() {		//One-shot creation / initialisation of expander div and tateJS.expander
                        var expandWrapper = document.createElement("div");
                        expandWrapper.id = "tateJSexpander";
                        
                        var expandImg = document.createElement("img");
                        expandImg.id = "tateJSexpanderImage";
                        
                        var expandCaption = document.createElement("div");
                        expandCaption.id = "tateJSexpanderCaption";
                        
                        var expandControls = document.createElement("div");
                        expandControls.id = "tateJSexpanderControls"
                        
                        var prevButton = document.createElement("button");
                        prevButton.innerHTML = "Previous";
                        prevButton.addEventListener("click",function(){tateJS.expanderPrev()});
                        var closeButton = document.createElement("button");
                        closeButton.innerHTML = "Close";
                        closeButton.addEventListener("click",function(){tateJS.shrink()});
                        var nextButton = document.createElement("button");
                        nextButton.innerHTML = "Next";
                        nextButton.addEventListener("click",function(){tateJS.expanderNext()});
                        
                        expandControls.appendChild(prevButton);
                        expandControls.appendChild(closeButton);
                        expandControls.appendChild(nextButton);
                        
                        expandWrapper.appendChild(expandImg);
                        expandWrapper.appendChild(expandCaption);
                        expandWrapper.appendChild(expandControls);
                        
                        document.body.appendChild(expandWrapper);
                        
                        tateJS.expander = {
                            divElem: expandWrapper,
                            imgElem: expandImg,
                            captionElem: expandCaption
                            };
        
                        tateJS.expander.divElem.style.visibility = "hidden";
        
                        return(tateJS.expander);
                        }
    }