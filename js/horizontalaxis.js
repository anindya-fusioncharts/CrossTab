function HorizontalAxis(parsedJSON,drawComponents,chartCount,tickPosDown){
	this.parsedJSON=parsedJSON;
	this.chartCount=chartCount;
	this.tickPosDown=tickPosDown;
	Axis.call(this,drawComponents);
}

HorizontalAxis.prototype= Object.create(Axis.prototype);
HorizontalAxis.prototype.constructor=HorizontalAxis;

HorizontalAxis.prototype.line=function(pos){
	var axis=this,
		drawcomponents=axis && axis.drawcomponents,
		margin,
		marginY=axis.drawcomponents && axis.drawcomponents.marginY,
		topMarginY=axis.drawcomponents && axis.drawcomponents.topMarginY,
		marginX=axis.drawcomponents && axis.drawcomponents.marginX,
		height = axis.drawcomponents && axis.drawcomponents.height,
		width=axis.drawcomponents && axis.drawcomponents.width,
		point1={},
		point2={},
		line;
	if(pos=='normal'){		
		point1.y= 0;
		point2.y=0;
	}
	if(pos == 'inverse'){
		margin = marginY + topMarginY;
		point1.y= height - margin;
		point2.y= height - margin;
	}
	point1.x=marginX;
	point2.x= width;
	line=axis.drawcomponents.drawLine(point1,point2,"horizontalaxis");
	return line;
}

HorizontalAxis.prototype.ticks=function(pos,noTicks,length,padding){
	var axis=this,
		drawcomponents=axis && axis.drawcomponents,
		margin,
		marginY=axis.drawcomponents && axis.drawcomponents.marginY,
		topMarginY=axis.drawcomponents && axis.drawcomponents.topMarginY,
		marginX=axis.drawcomponents && axis.drawcomponents.marginX,
		height = axis.drawcomponents && axis.drawcomponents.height,
		width=axis.drawcomponents && axis.drawcomponents.width,
		padding=padding || 0,
		interval=(width - marginX - 2*padding)/noTicks,
		point1={},
		point2={},
		ticks=[],		
		i;
	if(pos=='normal'){
		point1.y= 0;
		point2.y=0 - length;
	}
	if(pos=='inverse'){
		margin = marginY + topMarginY;
		point1.y= height - margin ;
		point2.y= height - margin + length;			
	}
	point1.x=marginX+padding;
	point2.x=marginX+padding;

	for(i=0; i< noTicks; i++) {
		ticks[i]=axis.drawcomponents.drawLine(point1,point2,"horizontalticks");
		point1.x +=interval;
		point2.x +=interval;
	}
}

HorizontalAxis.prototype.tickText=function(pos,tickTexts,length,angle,padding){
	var axis=this,
		drawcomponents=axis && axis.drawcomponents,
		noTicks=tickTexts.length,
		margin,
		marginY=axis.drawcomponents && axis.drawcomponents.marginY,
		topMarginY=axis.drawcomponents && axis.drawcomponents.topMarginY,
		marginX=axis.drawcomponents && axis.drawcomponents.marginX,
		height = axis.drawcomponents && axis.drawcomponents.height,
		width=axis.drawcomponents && axis.drawcomponents.width,
		padding=padding || 0,
		interval=(width - marginX - 2*padding)/noTicks,
		point1={},
		tickTexts=[],		
		i;
	if(pos=='normal'){
		point1.y = 0 - length - 5;
	}
	if(pos=='inverse'){
		margin = marginY + topMarginY;
		point1.y = height - margin + length + 5;			
	}
	point1.x=marginX+padding;	
	for(i=0; i< noTicks; i++) {
		tickTexts[i]=axis.drawcomponents.drawText(point1,".35em",tickTexts[i],"horizontalticktext",angle);
		point1.x += interval;
	}
}