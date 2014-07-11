var tateJS = {
	
	galleries: {},//Object as dictionary containing all galleries
	
	expanded: {	galleryName: "",
				imageNum: undefined
				},//id of currently expanded image can be found
	
	expanderDiv: undefined,//Holds the expander elements
	
	newGallery: function(galleryName) {
		if(tateJS.galleries[galleryName] === undefined) {
			tateJS.galleries[galleryName] = [];
			}
		else {
			console.log("tateJS Error: Gallery with name:" + galleryName + " already exists")
			}
		},
	
	addImageTo: function(galleryName,imageSrc,imageAltText) {
		(tateJS.galleries[galleryName]).push({src:imageSrc, alt:imageAltText});
		},
	
	viewer: {
		
		createViewerFor: function(galleryName,viewerOptions) {
			var viewerWrapper = document.createElement("div");
			viewerWrapper.id = (galleryName + "viewer");
			for(option in tateJS.viewer.defaultOptions) {
				if(viewerOptions[option] === undefined) {
					viewerOptions[option] = tateJS.viewer.defaultOptions[option];
					}
				}
			
			var viewer = document.createElement("div");
			viewer.id = galleryName + "viewer";
			viewer.className += " tateJSviewer";
			
			var gallery = tateJS.galleries[galleryName];
			
			for(var idx=0, l=gallery.length;idx<l;idx++) {
				var imageElement = document.createElement("img");
				imageElement.src = (gallery[idx]).src;
				imageElement.alt = (gallery[idx]).alt;
				imageElement.className += " tateJSthumb";
				imageElement.id = galleryName + (idx.toString());
				if(viewerOptions.canExpand == true) {
					imageElement.addEventListener("click",function(){tateJS.expand(this)})
					}
				viewer.appendChild(imageElement);
				}
			
			if(viewerOptions.hasControls == true) {
				var viewerControls = document.createElement("div");
                viewerControls.className = "tateJSviewerControls";
				
				var prevButton = document.createElement("button");
				prevButton.addEventListener("click",function(){tateJS.viewer.viewerPrev(this.parentNode.parentNode)});
				prevButton.innerHTML = "Previous";
				
				var nextButton = document.createElement("button");
				nextButton.addEventListener("click",function(){tateJS.viewer.viewerNext(this.parentNode.parentNode)});
				nextButton.innerHTML = "Next";
				
				viewerControls.appendChild(prevButton);
				viewerControls.appendChild(nextButton);
				
				if(gallery.length<=viewerOptions.width) {
					nextButton.disabled = true;
					}
				
                prevButton.disabled = true;
				viewer.appendChild(viewerControls);
				}
			
			if(gallery.length>viewerOptions.width) {
				tateJS.viewer.setVisible(viewer,0,(viewerOptions.width-1));
				}
			else {
				tateJS.viewer.setVisible(viewer,0,(gallery.length-1));
				}
			
			viewer.setAttribute("data-tatejs",viewerOptions.width);
			
			var execScript = document.getElementsByTagName("script");
            var execScript = execScript[execScript.length -1];
            
            execScript.parentNode.appendChild(viewer);
			
			if(viewerOptions.cycles === true) {
				//Setup animation loop
				}
			},
		
		viewerNext: function(viewer) {
			var startIdx = tateJS.viewer.getStart(viewer);
			var viewerWidth = viewer.getAttribute("data-tatejs");
            var galleryLength = viewer.getElementsByClassName("tateJSthumb").length;
            var overflowFlag = false;
            
            var newStart = startIdx + viewerWidth;
            var newEnd = newStart + galleryLength;
			
            if(newEnd>(galleryLength - 1)) {
                newEnd = galleryLength - 1;
                newStart = galleryLength - viewerWidth;
                overflowFlag = true;
                }
            
            var controls = viewer.getElementsByClassName("tateJSviewerControls")[0].childNodes;
            for(var idx=0;idx<2;idx++) {
                switch(controls[idx].innerHTML) {
                    case "Next":
                        if(overflowFlag == true) {
                            controls[idx].disabled = true;
                            }
                        break;
                    case "Previous":
                        controls[idx].disabled = false;
                        break;
                    }
                }
            
            tateJS.viewer.setVisible(viewer,newStart,newEnd);
            
			},
		
		viewerPrev: function(viewer) {
			var startIdx = tateJS.viewer.getStart(viewer);
			var viewerWidth = viewer.getAttribute("data-tatejs");
            var galleryLength = viewer.getElementsByClassName("tateJSthumb").length;
			var overflowFlag = false;
            
            var newStart = startIdx - viewerWidth;
            var newEnd = newStart + galleryLength;
            
            if(newStart<0) {
                newStart = 0;
                newEnd = viewerWidth - 1;
                overflowFlag = true;
                }
            
            var controls = viewer.getElementsByClassName("tateJSviewerControls")[0].childNodes;
            for(var idx=0;idx<2;idx++) {
                switch(controls[idx].innerHTML) {
                    case "Next":
                        controls[idx].disabled = false;
                        break;
                    case "Previous":
                        if(overflowFlag == true) {
                            controls[idx].disabled = true;
                            }
                        break;
                    }
                }
            
            tateJS.viewer.setVisible(viewer,newStart,newEnd);
            
			},
		
		getStart: function(viewer) {
			var images = viewer.getElementsByClassName("tateJSthumb");
			var galleryName = (viewer.id).replace("viewer","");
			var hitVisible = false;
			var galleryLength = images.length;
			var idx=0;
			var testImg;
			
			while((hitVisible == false) && (idx<galleryLength)) {
				testImg = document.getElementById(galleryName + idx.toString());
				if(testImg.style.display == "inline") {
					hitVisible = true;
					}
				idx++;
				}
			if(hitVisible == true) {
				return(idx-1);
				}
			else {
				return(0);
				}
			},
		
		setVisible: function(viewer,startNum,endNum) {
			var images = viewer.getElementsByClassName("tateJSthumb");
			var galleryName = (viewer.id).replace("viewer","");
			for(var idx=0,l=images.length;idx<l;idx++) {
				var image = images[idx];
				imageNum = Number(image.id.replace(galleryName,""));
				if((startNum<=imageNum) && (imageNum<=endNum)) {
					image.style.display = "inline";
					}
				else {
					image.style.display = "none";
					}
				}
			},
		
		defaultOptions: {
			canExpand: true,
			cycles: false,
			hasControls: true,
			width: 4
			}
		
		},
	
	expand: function(element) {
		var galleryName = (element.id).replace(/[0-9]+/,"");
		var imageNum = (element.id).replace(galleryName,"");
		tateJS.expander.setExpanded(galleryName,imageNum)
		},
	
	expander: {
		
		next: function() {
			var galleryName = tateJS.expanded.galleryName;
			var galleryLength = (tateJS.galleries[galleryName]).length;
			var imageNum = Number(tateJS.expanded.imageNum) + 1;
			
			if(imageNum >= galleryLength) {
				imageNum = 0;
				}
			tateJS.expander.setExpanded(galleryName,imageNum);
			},
		
		prev: function() {
			var galleryName = tateJS.expanded.galleryName;
			var imageNum = Number(tateJS.expanded.imageNum) - 1;
			
			if(imageNum<0) {
				imageNum = ((tateJS.galleries[galleryName]).length - 1);
				}
			tateJS.expander.setExpanded(galleryName,imageNum);
			},
		
		shrink: function() {
			tateJS.expanderDiv.divElem.style.visibility = "hidden";
			},
		
		setExpanded: function(galleryName,imageNum) {
			var imageObj = (tateJS.galleries[galleryName])[imageNum]
			var expander = tateJS.expanderDiv;
			if(expander === undefined) {
				expander = tateJS.expander.setupExpander();
				}
			if(expander.divElem.style.visibility == "hidden") {
				expander.divElem.style.visibility = "visible";
				}
			
			tateJS.expanded.galleryName = galleryName;
			tateJS.expanded.imageNum = imageNum;
			
			expander.imgElem.src = imageObj.src;
			expander.captionElem.innerHTML = imageObj.alt;
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
			prevButton.addEventListener("click",function(){tateJS.expander.prev()});
			var closeButton = document.createElement("button");
			closeButton.innerHTML = "Close";
			closeButton.addEventListener("click",function(){tateJS.expander.shrink()});
			var nextButton = document.createElement("button");
			nextButton.innerHTML = "Next";
			nextButton.addEventListener("click",function(){tateJS.expander.next()});
			
			expandControls.appendChild(prevButton);
			expandControls.appendChild(closeButton);
			expandControls.appendChild(nextButton);
				
			expandWrapper.appendChild(expandImg);
			expandWrapper.appendChild(expandCaption);
			expandWrapper.appendChild(expandControls);
			
			document.body.appendChild(expandWrapper);
			
			tateJS.expanderDiv = {
				divElem: expandWrapper,
				imgElem: expandImg,
				captionElem: expandCaption
				};
			
			return(tateJS.expanderDiv);
			}
		}
	
	};