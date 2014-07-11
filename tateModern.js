var tateJS = {
    
    galleries: {},//Key-value pairs containing the galleries as arrays of image objects
    
    GalleryObj: function(array,width,position) {
                        this.array = array;
                        this.width = width;
                        this.position = position;
                        },
    
    ImageObj: function(elem,caption,galleryKey,idx) {
                        this.elem = elem;
                        this.idx = idx;
                        this.galleryKey = galleryKey;
                        this.caption = caption;
                        this.visible = true;
                        },
    
    expanded: undefined,
    
    expander: undefined,
    
    setupGallery: function(galleryKey,nodeList) {
                        var imgArr = [];
                        
                        for(var idx=0,l=nodeList.length;idx<l;idx++) {
                            var image = nodeList[idx];
                            image.className += " tateJSthumb";
                            var caption = image.getAttribute("data-tatejs-caption");
                            if(caption === "") {
                                caption = image.alt;
                                }
                            imgArr.push(new tateJS.ImageObj(image,caption,galleryKey,idx));
                            }
                        tateJS.galleries[galleryKey] = new tateJS.GalleryObj(imgArr,0,0);
                        return(tateJS.galleries[galleryKey]);
                        },
    
    defaultOpts: {      canExpand: true,
                        cycles: false,
                        hasControls: true,
                        width: 4
                        },
    
    createViewerFor: function(divId,opts) {
                        for(option in tateJS.defaultOpts) {
                            if(opts[option] === undefined) {
                                opts[option] = tateJS.defaultOpts[option];
                                }
                            }
        
                        var viewerDiv = document.getElementById(divId);
                        viewerDiv.className += " tateJSviewer";
        
                        var gallery = tateJS.setupGallery(divId,viewerDiv.getElementsByTagName("img"));
        
                        if(opts.canExpand === true) {
                            for(var idx=0,l=gallery.array.length;idx<l;idx++) {
                                (function(idx){//Strange closure syntax to freeze the divId and idx variables (See http://www.mikeplate.com/2011/11/24/creating-a-closure-in-javascript/ )
                                    (gallery.array[idx]).elem.addEventListener("click",function(){tateJS.expand((tateJS.galleries[divId]).array[idx])});
                                    })(idx);
                                }
                            }
        
                        gallery.width = opts.width;
                        gallery.position = 0;
        
                        if(opts.hasControls === true) {
                            var viewerControls = document.createElement("div");
                            viewerControls.className = "tateJSviewerControls";
                            
                            var prevButton = document.createElement("button");
                            prevButton.addEventListener("click",function(){tateJS.viewerPrev(divId)});
                            prevButton.innerHTML = "Previous";
                            
                            var nextButton = document.createElement("button");
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
        
                        if(gallery.array.length>opts.width) {
                            tateJS.setVisible(divId,0,(opts.width-1));
                            }
                        else {
                            tateJS.setVisible(divId,0,(gallery.array.length-1));
                            }
        
                        if(opts.cycles != undefined) {
                            //Setup animation loop
                            }
                        },
    
    setVisible: function(galleryKey,startNum,endNum) {
                        var gallery = tateJS.galleries[galleryKey];
                        for(var idx=0,l=gallery.array.length;idx<l;idx++) {
                            if((startNum<=idx) && (idx<=endNum)) {
                                (gallery.array[idx]).elem.style.display = "inline";
                                }
                            else {
                                (gallery.array[idx]).elem.style.display = "none";
                                }
                            }
                        },
    
    viewerNext: function(galleryKey) {
                        var gallery = tateJS.galleries[galleryKey];
                        var newStart = gallery.position + gallery.width;
                        var newEnd = newStart + gallery.width - 1;
                        var length = gallery.array.length;
                        var overflow = false;
                        
                        if(newEnd>(length-1)) {
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
    
    viewerPrev: function(galleryKey) {
                        var gallery = tateJS.galleries[galleryKey];
                        var newStart = gallery.position - gallery.width;
                        var newEnd = newStart + gallery.width - 1;
                        var length = gallery.array.length;
                        var overflow = false;
                        
                        if(newStart<=0) {
                            newStart = 0;
                            newEnd = gallery.width - 1;
                            overflowFlag = true;
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
    
    expand: function(imageObj) {
                        var expander = tateJS.expander;
                        if(expander === undefined) {
                            expander = tateJS.setupExpander();
                            }
                        tateJS.expanded = imageObj;
                        expander.imgElem.src = imageObj.elem.src;
                        expander.captionElem.innerHTML = imageObj.caption;
                        
                        expander.divElem.style.visibility = "visible";
                        },
    
    expanderNext: function() {
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
        
    expanderPrev: function() {
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
    
    shrink: function() {
                        tateJS.expander.divElem.style.visibility = "hidden";
                        },

    setupExpander: function() {
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
