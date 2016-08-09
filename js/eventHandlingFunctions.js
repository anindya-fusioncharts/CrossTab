/*----------Event Handling Functions start------------*/


function syncCrossHair(e){
	var cx;
	var adjustingValue;
	var x;
	var fixedDecimal;
	var index1,index2,slop,xRatio,sX1,sX2,sY1,sY2,cValue,yValue;
	var top,topLimit,bottomLimit,left,leftLimit,rightLimit;
	var x;	
	var keyIndex;
	var chartAreaRect=document.getElementsByClassName("chartArea");
	var crossHair=document.getElementsByClassName("HairLine");

	var tooltip=document.getElementsByClassName("tooltip");
	var tooltipText=document.getElementsByClassName("tooltipText");
	var x1,y1,y2,rectX,rectWidth;
	var textLength;
	var padding;
	var tooltipHeight, tooltipWidth;
	var pointX,pointY;
	var parentOffset;
	var rect;	
	padding=10;
	tooltipHeight=25;	
	adjustingValue=this.parsedJSON.chart.marginX;
	x=e.detail.x+adjustingValue;
	for(var i=0; i<this._crossHair.length; i++){
		this._crossHair[i]._hairLine.setAttribute("visibility","visible");
		this._crossHair[i]._hairLine.setAttribute("x1",x);
		this._crossHair[i]._hairLine.setAttribute("x2",x);	
		for(var j=0; j< this._anchors[i].length; j++){
			cx=this._anchors[i][j].getAttribute("cx");
			if((x-5)<=cx && (x+5)>=cx){
				this._anchors[i][j].setAttribute("r",7);
				this._anchors[i][j].setAttribute("style","fill:#f44336")
				this._tooltip[i].text.innerHTML=this._anchors[i][j].getAttribute("Ydata");
			}else{
				this._anchors[i][j].setAttribute("r",5);
				this._anchors[i][j].setAttribute("style","fill:#ffffff");
			}			
		}
		this._tooltip[i].rect.setAttribute("visibility","hidden");
		this._tooltip[i].text.setAttribute("visibility","hidden");
	}


	for (var i=0; i<crossHair.length; i++){	
		crossHair[i].setAttribute("visibility","visible");	
		tooltip[i].setAttribute("visibility","hidden");
		tooltipText[i].setAttribute("visibility","hidden");
		rectX=parseInt(chartAreaRect[i].getAttribute("x"));


		x1=parseInt(crossHair[i].getAttribute("x1"));
		y1=parseInt(crossHair[i].getAttribute("y1"));
		y2=parseInt(crossHair[i].getAttribute("y2"));
		
		rectWidth= parseInt(chartAreaRect[i].getAttribute("width"));
		leftLimit=rectX;
		rightLimit=rectX+rectWidth;
		topLimit=y1;
		bottomLimit=y2;

		keyIndex=bSearch(DataSet[i],x1);

		if(keyIndex>=0){
			left=DataSet[i][keyIndex][2];
			top=DataSet[i][keyIndex][3];
			
			textLength=tooltipText[i].innerHTML.toString().length;
			tooltipWidth=textLength*padding+2*padding;

			tooltip[i].setAttribute("width",tooltipWidth.toString());
			tooltip[i].setAttribute("height",tooltipHeight);

			tooltipText[i].innerHTML=DataSet[i][keyIndex][1].toString();

			pointX=left+5;
			pointY=top-5;					
			if((rightLimit -25) <(left+tooltipWidth)){

				pointX=left-tooltipWidth-10;
			}

			if((top+tooltipHeight+5)>(bottomLimit)){
				pointY=top+tooltipHeight;
				while((pointY+tooltipHeight+5)>=(bottomLimit)){
					pointY--;					
				}											
			}

			if((top)< (topLimit +5)){
				pointY=top;
				while(pointY<=topLimit+15){					
					pointY++;
				}
			}				

			tooltip[i].setAttribute("x",pointX);
			tooltipText[i].setAttribute("x",(pointX+Math.floor((tooltipWidth-(textLength*padding))/2)));

			tooltip[i].setAttribute("y",pointY-10);
			tooltipText[i].setAttribute("y",(pointY+7));

			tooltip[i].setAttribute("visibility","visible");
			tooltipText[i].setAttribute("visibility","visible");
			
		} else{				
			keyIndex= Math.abs(keyIndex) -1;

			if(x1 < DataSet[i][DataSet[i].length-1][2] && x1 > DataSet[i][0][2]) {
				if(x1 > DataSet[i][keyIndex][2]) {
					index1=keyIndex;
					index2=keyIndex+1;
				} else {
					index1=keyIndex-1;
					index2=keyIndex;
				}
				sX1=DataSet[i][index1][2];
				sY1=DataSet[i][index1][3];
				sX2=DataSet[i][index2][2];
				sY2=DataSet[i][index2][3];

				slop=((sY2-sY1)/(sX2-sX1)).toFixed(3);
				cValue=(sY2- slop*sX2);
				yValue=Math.abs((slop* x1) + cValue);					
				xRatio=(DataSet[i][index2][1]-DataSet[i][index1][1])/Math.abs(sX1-sX2);
				if(DataSet[i][index2][1]%1 !=0)
					fixedDecimal=(DataSet[i][index2][1]%1).toString().length;
				else
					fixedDecimal=0;
				tooltipText[i].innerHTML=((DataSet[i][index1][1] + xRatio* Math.abs(sX1-x1)).toFixed(fixedDecimal)).toString();

				top=Math.floor(yValue);
				left=x1;
				textLength=tooltipText[i].innerHTML.toString().length;

				tooltipWidth=textLength*padding+2*padding;

				tooltip[i].setAttribute("width",tooltipWidth.toString());
				tooltip[i].setAttribute("height",tooltipHeight);

				pointX=left+5;

				pointY=top-5;			

				if((rightLimit -25) <(left+tooltipWidth)){

					pointX=left-tooltipWidth-10;
				}

				if((top+tooltipHeight+5)>(bottomLimit)){
					pointY=top+tooltipHeight;
					while((pointY+tooltipHeight+5)>=(bottomLimit)){
						pointY--;					
					}											
				}

				if((top)< (topLimit +5)){
					pointY=top;
					while(pointY<=topLimit+15){					
						pointY++;
					}
				}				

				tooltip[i].setAttribute("x",pointX);
				tooltipText[i].setAttribute("x",(pointX+Math.floor((tooltipWidth-(textLength*padding))/2)));

				tooltip[i].setAttribute("y",(pointY-10));
				tooltipText[i].setAttribute("y",(pointY+7));

				tooltip[i].setAttribute("visibility","visible");
				tooltipText[i].setAttribute("visibility","visible");

			} else {
				tooltip[i].setAttribute("visibility","hidden");
				tooltipText[i].setAttribute("visibility","hidden");
			}
		}
	}
}
/*function reset(chartInstances,type){
	
	for(var i=0; i< chartInstances.length; i++){
		for(var j=0; j<chartInstances[i].length; j++){
			if(type== 'line'){
				chartInstances[i][j].setAttribute("fill","#ffffff");
				chartInstances[i][j].setAttribute("r",5);
			}
			if(type=='column')
				chartInstances[i][j].setAttribute("style","fill:#3E72CC");		
		}
	}		
}*/


function hideCrossHair(e){
	var element=document.getElementsByClassName("HairLine");
	var tooltip=document.getElementsByClassName("tooltip");
	var tooltipText=document.getElementsByClassName("tooltipText");		
	for (var i=0; i<element.length; i++){	
		element[i].setAttribute("visibility","hidden");
		element[i].setAttribute("x1","1");
		element[i].setAttribute("x2","1");
		tooltip[i].setAttribute("visibility","hidden");
		tooltipText[i].setAttribute("visibility","hidden");
	}

	var plotPoint=document.getElementsByClassName("plotPoint");
	for(var i=0; i<plotPoint.length; i++){
		plotPoint[i].setAttribute("style","fill:#ffffff");
		plotPoint[i].setAttribute("r",5);
	}
}
/*----------Event Handling Functions stop------------*/
