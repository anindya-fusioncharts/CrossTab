

function XAxis(parsedJSON,drawComponents,chartCount,tickPosDown){
	this.parsedJSON=parsedJSON;
	this.chartCount=chartCount;
	this.tickPosDown=tickPosDown;
	Axis.call(this,drawComponents);
}

XAxis.prototype.xAxisTicksText=function(chartCount,tickList,tickPosDown){
	var x1= -(this.drawcomponents.marginX-this.drawcomponents.paddingX1)-1;
	var y1=0;
	var x2=this.drawcomponents.width;
	var y2=0;
	var point,point1,point2;
	var xTickStr="";
	var dateMax=tickList[tickList.length-1];
	var dateMin=tickList[0];
	var xDiff=tickList[tickList.length-1].getTime()-tickList[0].getTime();

	if(tickPosDown){				

		if(noChartRow>0) {

			for(var i=0; i<tickList.length; i++){
				x1=this.drawcomponents.xShift(tickList[i].getTime(),tickList[0].getTime(),xDiff);
				y1=(this.drawcomponents.height-this.drawcomponents.marginY-this.drawcomponents.topMarginY-8);
				x2=x1;
				y2=(this.drawcomponents.height-this.drawcomponents.marginY-this.drawcomponents.topMarginY);				
				point=this.drawcomponents.coordinate((x1+2),(y1+this.drawcomponents.marginY+5));
				
				point1=this.drawcomponents.coordinate(x1,y1);
				point2=this.drawcomponents.coordinate(x2,y2);
				
				this.drawcomponents.drawLine(point1,point2,"xAxis");

				xTickStr=formatDate(dateMax,dateMin,tickList[i]);
				this.drawcomponents.drawText(point,".35em",xTickStr,"xAxisTickText1","270");					
			}
			noChartRow--;
		}
	}else{
		if((this.parsedJSON.chart.yMap.length - chartCount)<noChartRow && (this.parsedJSON.chart.yMap.length - chartCount)>= 0){
			for(var i=0; i<tickList.length; i++){
				x1=this.drawcomponents.xShift(tickList[i].getTime(),tickList[0].getTime(),xDiff);
				y1=-(this.drawcomponents.marginY-this.drawcomponents.marginY);
				x2=x1;
				y2=-(this.drawcomponents.marginY-this.drawcomponents.marginY+5);				
				
				point=this.drawcomponents.coordinate((x1+2),(y1-8));
				
				point1=this.drawcomponents.coordinate(x1,y1);
				point2=this.drawcomponents.coordinate(x2,y2);
				
				this.drawcomponents.drawLine(point1,point2,"xAxis");
				xTickStr=formatDate(dateMax,dateMin,tickList[i]);
				this.drawcomponents.drawText(point,".35em",xTickStr,"xAxisTickText1","270");				
			}					
		}
	}	
}

XAxis.prototype.draw=function(){
	this.xAxisTicksText(this.chartCount,this.parsedJSON.TickList.xAxis,this.tickPosDown);
}

function formatDate(dateMax,dateMin,date){
	var xDiff=dateMax.getTime() - dateMin.getTime();
	if(xDiff<(1000*3600*24) && dateMax.getDate()==dateMin.getDate() && dateMax.getMonth()==dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
		return date.toString().split(' ')[4];
	if(dateMax.getDate()!=dateMin.getDate() && dateMax.getMonth()==dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
		return (date.toString().split(' ')[0]);
	if(dateMax.getMonth()!=dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
		return (date.toString().split(' ')[1]+ "'"+date.toString().split(' ')[2]);
	if(dateMax.getFullYear()!=dateMin.getFullYear())
		return (date.toString().split(' ')[1]+ "'"+date.toString().split(' ')[2] + ","+date.toString().split(' ')[3][2]+''+date.toString().split(' ')[3][3]);
	return date;
}