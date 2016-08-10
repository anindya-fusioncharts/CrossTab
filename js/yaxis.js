
function YAxis(parsedJSON,drawComponents,iChart,tickPosDown){
	this.parsedJSON=parsedJSON;
	this.iChart=iChart;
	this.tickPosDown=tickPosDown;
	Axis.call(this,drawComponents);
}

YAxis.prototype.axisLine=function(tickList){
	var len,diff,plotFactor;
	var y1;
	var x1;
	var y2;
	var x2;	
	var points={},point1={},point2={};
	
	var ticktext;
	var min;
	
	len=tickList.length;

	diff=Math.abs(tickList[len-1]-tickList[0]);
	
	min=tickList[0];

	for(var i=0; i<tickList.length; i++){
		if(tickList[0]<0)
			y1=this.drawcomponents.yShift(tickList[i]-tickList[0],tickList[0]-tickList[0],diff);
		else
			y1=this.drawcomponents.yShift(tickList[i],tickList[0],diff);
		x1=-(this.drawcomponents.marginX-this.drawcomponents.paddingX2-4);
		y2=y1;
		x2=-(this.drawcomponents.marginX-this.drawcomponents.paddingX1-4);						
		point1=this.drawcomponents.coordinate(x1,y1);
		point2=this.drawcomponents.coordinate(x2,y2);		
		this.drawcomponents.drawLine(point1,point2,"yAxisTick");
	}			
}	

YAxis.prototype.yAxisTicksText=function(tickList,noDiv){
	var y1;
	var x1;
	var y2;
	var x2;	
	var point={},point0={},point1={},point2={},point3={};
	var points;
	var tickText;
	var count=0;
	var yPrev=0;
	var yAxisTicks=[];
	var diff;
	var fixedDecimal;

	diff=Math.abs(tickList[tickList.length-1]-tickList[0]);
	for(var i=0; i<tickList.length; i++){
		if(tickList[0]<0)
			y1=this.drawcomponents.yShift(tickList[i]-tickList[0],tickList[0]-tickList[0],diff);
		else
			y1=this.drawcomponents.yShift(tickList[i],tickList[0],diff);
		x1=-(this.drawcomponents.marginX-this.drawcomponents.paddingX2-4);
		y2=y1;
		x2=-(this.drawcomponents.marginX-this.drawcomponents.paddingX1-4);

		point1=this.drawcomponents.coordinate(x1,y1);
		point2=this.drawcomponents.coordinate(x2,y2);	
		
		if(typeof tickList[i] == 'number'){	
			if( Math.abs(tickList[i])<1000){
				point=this.drawcomponents.coordinate(-(this.drawcomponents.marginX-this.drawcomponents.paddingTextX-8),(y1-4));
				if(tickList[tickList.length-1]<1)
					fixedDecimal=tickList[tickList.length-1].toString().length-2;
				else
					fixedDecimal=2;
				if(tickList[i]==0)
					tickText='0';
				else{
					if(tickList[i]%1==0)
						tickText=tickList[i].toString();
					else
						tickText=tickList[i].toFixed(fixedDecimal).toString();
				}							
			}
			if(Math.abs(tickList[i])>=1000 && Math.abs(tickList[i])<1000000){			
				tickText=tickList[i]/1000 + "" +"K";			
			}
			if(Math.abs(tickList[i])>=1000000 && Math.abs(tickList[i])<1000000000){		
				tickText=tickList[i]/1000000 + "" +"M";			
			}
			if(Math.abs(tickList[i])>=1000000000 && Math.abs(tickList[i])<1000000000000){		
				tickText=tickList[i]/1000000000 + "" +"B";			
			}
			if(Math.abs(tickList[i])>=1000000000000){		
				tickText=tickList[i]/1000000000000 + "" +"T";		
			}	
		}
		if(noDiv== undefined){
			point0=this.drawcomponents.coordinate(-1,y1);
			point1=this.drawcomponents.coordinate(this.drawcomponents.width,y1);
			point2=this.drawcomponents.coordinate(this.drawcomponents.width,yPrev);
			point3=this.drawcomponents.coordinate(-1,yPrev);

			points= point0.x+ ','+point0.y+' '+point1.x+','+point1.y+' '+point2.x+','+point2.y+' '+point3.x+','+point3.y+' '+point0.x+ ','+point0.y;
			if(i!=0)
				if(count%2==0)
					this.drawcomponents.drawPolygon(points,"divDash1");		
				else
					this.drawcomponents.drawPolygon(points,"divDash2");				
			count++;
			yPrev=y1;
		}
		point=this.drawcomponents.coordinate(-(this.drawcomponents.marginX-this.drawcomponents.paddingTextX-8),(y1-5));
		yAxisTicks[i]=this.drawcomponents.drawText(point,".35em",tickText,"yAxisTickText");
	}
	return yAxisTicks;
}

YAxis.prototype.title=function(tickPosDown,title){
	var points,point;
	var point0;
	var point1;
	var point2;
	var point3;

	if(tickPosDown){
		point0=this.drawcomponents.coordinate((0),(-this.drawcomponents.marginY+2));
		point1=this.drawcomponents.coordinate((this.drawcomponents.width),(-this.drawcomponents.marginY+2));
		point2=this.drawcomponents.coordinate((this.drawcomponents.width),(-this.drawcomponents.marginY+37));
		point3=this.drawcomponents.coordinate((0),(-this.drawcomponents.marginY+37));

		points= point0.x+ ','+point0.y+' '+point1.x+','+point1.y +' '+point2.x+','+point2.y+' '+point3.x+','+point3.y+' '+point0.x+ ','+point0.y;
		this.drawcomponents.drawPolygon(points,"titles");
		point={
			x:point2.x/2,
			y:point2.y+27
		};
	}else{
		point0=this.drawcomponents.coordinate((0),(this.drawcomponents.height -this.drawcomponents.topMarginY-30));
		point1=this.drawcomponents.coordinate((this.drawcomponents.width),(this.drawcomponents.height-this.drawcomponents.topMarginY-30));
		point2=this.drawcomponents.coordinate((this.drawcomponents.width),(this.drawcomponents.height-this.drawcomponents.topMarginY-78));
		point3=this.drawcomponents.coordinate((0),(this.drawcomponents.height-this.drawcomponents.topMarginY-78));

		points= point0.x+ ','+point0.y+' '+point1.x+','+point1.y +' '+point2.x+','+point2.y+' '+point3.x+','+point3.y+' '+point0.x+ ','+point0.y;		
		this.drawcomponents.drawPolygon(points,"titles");		
		point={
			x:point2.x/2,
			y:point2.y-15
		};
	}	
	return this.drawcomponents.drawText(point,".5em",title,"yAxisTitle","0");		
}

YAxis.prototype.draw=function(){
	this.axisLine(this.parsedJSON.TickList.yAxis[this.iChart]);
	this.yAxisTicksText(this.parsedJSON.TickList.yAxis[this.iChart]);
	this.title(this.tickPosDown,this.parsedJSON.chart.yMap[this.iChart].toUpperCase())	
}
