/*-----------Line Chart--------------*/
function LineChart(drawComponents,parsedJSON,index){
	this.index=index;		
	Chart.call(this,drawComponents,parsedJSON);
	this.xDiff=this.parsedJSON.TickList.xAxis[this.parsedJSON.TickList.xAxis.length-1].getTime()-this.parsedJSON.TickList.xAxis[0].getTime();
	this.yDiff=this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[index].length-1]-this.parsedJSON.TickList.yAxis[this.index][0];	
}

LineChart.prototype = Object.create(Chart.prototype);
LineChart.prototype.constructor = LineChart;

LineChart.prototype.path=function(){
	var x,y;
	var point={};
	var path;
	var paths;

	paths='M';
	for(var i=0; i< this.parsedJSON.data[this.index].length; i++){
		x=this.parsedJSON.data[this.index][i][0];
		y=this.parsedJSON.data[this.index][i][1];
		point.x=this.drawComponents.xShift(x,this.parsedJSON.TickList.xAxis[0],this.xDiff);
		point.y=this.drawComponents.yShift(y,this.parsedJSON.TickList.yAxis[this.index][0],this.yDiff);
		point=this.drawComponents.coordinate(point.x,point.y);
		paths=paths+point.x+' '+point.y+', ';
	}
	path=this.drawComponents.drawPath(paths,"path");
	return path;	
}

LineChart.prototype.anchor=function(){
	var x,y;
	var point={};
	var anchor=[];
	var svgLeft,svgTop;
	svgLeft=parseInt(this.drawComponents.svg.getBoundingClientRect().left);
	svgTop=parseInt(this.drawComponents.svg.getBoundingClientRect().top);
	DataSet[this.index]=[];
	for(var i=0; i< this.parsedJSON.data[this.index].length; i++){
		x=this.parsedJSON.data[this.index][i][0];
		y=this.parsedJSON.data[this.index][i][1];
		point.x=this.drawComponents.xShift(x,this.parsedJSON.TickList.xAxis[0],this.xDiff);
		point.y=this.drawComponents.yShift(y,this.parsedJSON.TickList.yAxis[this.index][0],this.yDiff);
		point=this.drawComponents.coordinate(point.x,point.y);

		anchor[i]=this.drawComponents.drawCircle(point,5,"plotPoint",x,y,(svgLeft+point.x),(svgTop+point.y));
		
		DataSet[this.index][i]=[];
		DataSet[this.index][i][0]=this.parsedJSON.data[this.index][i][0];
		DataSet[this.index][i][1]=this.parsedJSON.data[this.index][i][1];
		DataSet[this.index][i][2]=point.x;
		DataSet[this.index][i][3]=point.y;	
	}
	return anchor;	
}

LineChart.prototype.chartArea=function(){
	var point={};
	var point1={};
	var x,y,h,w;
	var _chartArea;
	var left;
	x=this.parsedJSON.TickList.xAxis[0].getTime();
	y=this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[this.index].length-1];	
	point.x=this.drawComponents.xShift(x,this.parsedJSON.TickList.xAxis[0],this.xDiff);
	point.y=this.drawComponents.yShift(y,this.parsedJSON.TickList.yAxis[this.index][0],this.yDiff);
	point=this.drawComponents.coordinate(point.x,point.y+3);

	w=Math.abs(this.parsedJSON.chart.width);
	h=Math.abs(this.parsedJSON.chart.height-this.parsedJSON.chart.topMarginY-this.parsedJSON.chart.marginY);
			
	_chartArea=this.drawComponents.drawRect(point.x,point.y,"chartArea",h,w,"stroke:#black; fill:transparent");
	
	left=_chartArea.graphics.getBoundingClientRect().left;

	_chartArea.graphics.addEventListener("mousemove",function(){
			CustomMouseRollOver.detail.x=Math.ceil(event.clientX-left);
			_chartArea.graphics.dispatchEvent(CustomMouseRollOver);
		});

	return _chartArea;
}

LineChart.prototype.hairLine=function(){
	var point={};
	var point1={};
	var x,y,h,w;
	var _hairLine;

	x=this.parsedJSON.TickList.xAxis[0].getTime();
	y=this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[this.index].length-1];	
	point.x=this.drawComponents.xShift(x,this.parsedJSON.TickList.xAxis[0],this.xDiff);
	point.y=this.drawComponents.yShift(y,this.parsedJSON.TickList.yAxis[this.index][0],this.yDiff);
	point=this.drawComponents.coordinate(point.x,point.y);

	point1.x=point.x;
	point1.y=point.y+Math.abs(this.parsedJSON.chart.height-this.parsedJSON.chart.topMarginY-this.parsedJSON.chart.marginY)-6;
	_hairLine=this.drawComponents.drawLine(point,point1,"HairLine");
	return _hairLine;
}

LineChart.prototype.crossHair=function(){
	var _chartArea,_hairLine;
	_chartArea=this.chartArea();	
	_hairLine=this.hairLine();
	_hairLine.graphics.setAttribute("visibility","hidden");
	return {
		"_chartArea":_chartArea,
		"_hairLine":_hairLine
	};
}
/*

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
		this._crossHair[i]._hairLine.graphics.setAttribute("visibility","visible");
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
*/
LineChart.prototype.reset=function(plotpoints){	
	for(var i=0,len=plotpoints.length; i< len; i++){
		for(var j=0, len1=plotpoints[i].length; j<len1; j++){
			plotpoints[i][j].graphics.setAttribute("fill","#ffffff");;				
			plotpoints[i][j].graphics.setAttribute("r",4);
		}
	}		
}

LineChart.prototype.select=function(plotPoints){
	var x1=parseInt(selectSpace.style.left);
	var y1=parseInt(selectSpace.style.top);
	var x2=x1+ parseInt(selectSpace.style.width);
	var y2=y1+parseInt(selectSpace.style.height);
	var maxX=-1,minX=99999;		
	var x,y;		
		
	for(var i=0,len=plotPoints.length; i< len; i++) {
		for(var j=0,len1=plotpoints[i].length; j<len1; j++) {
			x=Number(plotPoints[i][j].config.absoluteX);
			y=Number(plotPoints[i][j].config.absoluteY);

			if(x>=x1 && x<=x2 && y>=y1 && y<=y2) {

				plotPoints[i][j].graphics.setAttribute("fill","#f44336");
				plotPoints[i][j].graphics.setAttribute("r",6);	

				if(minX>Number(plotPoints[i][j].config.cx))
					minX=Number(plotPoints[i][j].config.cx);

				if(maxX<Number(plotPoints[i][j].config.cx))
					maxX=Number(plotPoints[i][j].config.cx);				
			}
		}
	}

	for(var i=0,len=plotPoints.length; i< len; i++) {
		for(var j=0,len1=plotpoints[i].length; j<len1; j++) {
			if(minX <= Number(plotPoints[i][j].config.cx) && Number(plotPoints[i][j].config.cx) <= maxX){
				plotPoints[i][j].graphics.setAttribute("style","fill:#f44336");
				plotPoints[i][j].graphics.setAttribute("r",6);	
			
			}
		}
	}
}

