function VarticalAxis(parsedJSON,drawComponents,iChart,tickPosDown){
	this.parsedJSON=parsedJSON;
	this.iChart=iChart;
	this.tickPosDown=tickPosDown;
	Axis.call(this,drawComponents);
}

VarticalAxis.prototype= Object.create(Axis.prototype);
VarticalAxis.prototype.constructor=VarticalAxis;

VarticalAxis.prototype.line=function(pos){
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
		point1.x= 0;
		point2.x=0;
	}
	if(pos == 'inverse'){
		point1.x= width;
		point2.x= width;
	}
	point1.y=marginY;
	point2.y= height - topMarginY;
	line=axis.drawcomponents.drawLine(point1,point2,"varticalaxis");
	return line;
}

VarticalAxis.prototype.ticks=function(pos,noTicks,length,padding){
	var axis=this,
		drawcomponents=axis && axis.drawcomponents,
		margin,
		marginY=axis.drawcomponents && axis.drawcomponents.marginY,
		topMarginY=axis.drawcomponents && axis.drawcomponents.topMarginY,
		marginX=axis.drawcomponents && axis.drawcomponents.marginX,
		height = axis.drawcomponents && axis.drawcomponents.height,
		width=axis.drawcomponents && axis.drawcomponents.width,
		padding=padding || 0,
		interval=(height - marginY - topMarginY - 2*padding)/noTicks,
		point1={},
		point2={},
		ticks=[],		
		i;
	if(pos=='normal'){
		point1.x= 0;
		point2.x=0 - length;
	}
	if(pos=='inverse'){
		point1.x= width;
		point2.x= width+ length;			
	}
	point1.y=marginY+padding;
	point2.y=marginY+padding;
	for(i=0; i< noTicks; i++) {
		ticks[i]=axis.drawcomponents.drawLine(point1,point2,"varticalticks");
		point1.y +=interval;
		point2.y +=interval;
	}
}

VarticalAxis.prototype.tickText=function(pos,tickTexts,length,angle,padding){
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
		interval=(height - marginY - topMarginY - 2*padding)/noTicks,
		point1={},
		tickTexts=[],		
		i;
	if(pos=='normal'){
		point1.x= 0;
	}
	if(pos=='inverse'){
		point1.x= width;		
	}
	point1.y=marginY+padding;	
	for(i=0; i< noTicks; i++) {
		tickTexts[i]=axis.drawcomponents.drawText(point1,".35em",tickTexts[i],"varticalticktext",angle);
		point1.y +=interval;
	}
}