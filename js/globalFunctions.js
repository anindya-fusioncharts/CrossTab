"use strict";
/*-------global functions and variables start-----------*/
var noChartRow;
var chartType;
var selectSpace;
var mousedown=false;
var mouseLeft, mouseTop;

function tickspoistion(parsedJSON){
	var percntWidth;
	percntWidth=Math.ceil((parsedJSON.chart.width)/window.innerWidth*100);
	percntWidth=percntWidth+0.32*percntWidth;
	noChartRow=Math.floor(100/percntWidth);	
	if((parsedJSON.chart.yMap.length % noChartRow)==0)
		return false;
	else
		return true;
}

function dragBox(){
	selectSpace=document.createElement("div");
	selectSpace.style.position="absolute";
	selectSpace.style.background ="#727272";
	selectSpace.style.color = "#727272";
	selectSpace.innerHTML = "";
	selectSpace.style.opacity="0.3";
	selectSpace.id="selectSpace";
	selectSpace.style.left=0+"px";
	selectSpace.style.top=0+"px";
	document.body.appendChild(selectSpace);
}

function placeTooltip(limits,left,top,toolTipSize){

	var rightLimit,
		bottomLimit,
		topLimit,
		tooltipHeight,
		tooltipWidth;

	var pointX,
		pointY;

	pointX=left+5;
	pointY=top-5;
	bottomLimit=limits.bottomLimit;
	rightLimit=limits.rightLimit;
	topLimit=limits.topLimit;
	tooltipWidth=toolTipSize.tooltipWidth;
	tooltipHeight=toolTipSize.tooltipHeight;

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

	return {
		pointX : pointX,
		pointY : pointY
	};
}

function numberShrink(num){
	var tickText;
	if(Math.abs(num)>=1000 && Math.abs(num)<1000000){			
		tickText=num/1000 + "" +"K";			
	}
	if(Math.abs(num)>=1000000 && Math.abs(num)<1000000000){		
		tickText=num/1000000 + "" +"M";			
	}
	if(Math.abs(num)>=1000000000 && Math.abs(num)<1000000000000){		
		tickText=num/1000000000 + "" +"B";			
	}
	if(Math.abs(num)>=1000000000000){		
		tickText=num/1000000000000 + "" +"T";		
	}	
	return tickText;
}

function countDecimals(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}

function convertIntoNumber(values){
	for(var i=0, len=values.length; i<len; i++){
		values[i]= +values[i];
	}
	return values;
}

function convertIntoDate(values){
	for(var i=0, len=values.length; i<len; i++){
		values[i]= new Date(values[i]);
	}
	return values;
}

function findMinMax(values){
	var max,
		min,
		maxDec=0,
		countDec=undefined;
	for(var i=0, len=values.length; i<len; i++){
		if(i==0){
			max=values[0];
			min=values[0];
		}
		if(min>values[i])
			min=values[i];
		if(max<values[i])
			max=values[i];
		if(!isNan(values[i])){
			countDec=countDecimals(values[i]);
			if(maxDec<countDec)
				maxDec=countDec;
		}		
	}
	if(countDec != undefined)
		return {
			min : min,
			max : max,
			maxDec : maxDec
		};
	else
		return {
			min : min,
			max : max
		};
}

function beautifyMinMax(limits){
	var	negatedmin=0,
	d,
	r,
	count,
	computedMax,
	computedMin,
	decimalFlag=1,
	index,
	max_countDecimals=limits.maxDec,
	min=limits.min,
	max=limits.max;

	if(min <0) {
		min*=-1;
		count=-1;
		d=min;
		while(d){
			r=Math.floor(d%10);
			d=Math.floor(d/10);
			count++;
		}			
		computedMin=(r+1) * Math.pow(10,count) *-1;
		negativeFlag=1;
	} else {
		count=-1;
		d=min;
		while(d){
			r=Math.floor(d%10);
			d=Math.floor(d/10);
			count++;
		}

		if(count)
			computedMin=r * Math.pow(10,count);
		else
			computedMin=0;
	}

	if(max<0){
		max*=-1;
		count=-1;
		d=max;
		while(d){
			r=Math.floor(d%10);
			d=Math.floor(d/10);
			count++;
		}

		if(count)
			computedMax=r * Math.pow(10,count);
		else
			computedMax=0;			
	
	}else{
		count=-1;
		d=max;
		while(d){
			r=Math.floor(d%10);
			d=Math.floor(d/10);
			count++;
		}			
		
		computedMax=(r+1) * Math.pow(10,count);	
	}

	if(computedMax%1!=0)
		computedMax=parseInt(computedMax.toString().split('.')[0]+''+computedMax.toString().split('.')[1].substring(0,max_countDecimals));

	if(computedMin%1!=0)
		computedMin=parseInt(computedMin.toString().split('.')[0]+''+computedMin.toString().split('.')[1].substring(0,max_countDecimals));


	if(negativeFlag==1){
		negatedmin=computedMin;
		computedMax-=computedMin;
		computedMin=0;
	}
	if(Math.abs(computedMax)<1){
		decimalFlag=-1;
	}
	
	if(parseInt(computedMax.toString()[1])==0)
		index=1;
	if (Math.floor(computedMin/Math.pow(10,(computedMax.toString().length-index)))==0)
		computedMin=0;

	return {
		min : computedMin,
		max : computedMax,
		decimalFlag : decimalFlag
	};
}

function sortByDate(data){
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < data.length-1; i++) {
            if (data[i][0] > data[i+1][0]) {
                var temp = data[i];
                data[i] = data[i+1];
                data[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
    return data;
}

function crosstabYticks(data){
	var max=-9999999999,
		min=0;
	var diff;
	var ticks=[];
	var count=-1;
	var d,r;
	for(var i=0; i<data.length; i++){
		for(var j =0; j<data[i].length; j++){
			for(var k=0; k<data[i][j].length; k++){
				if(max<data[i][j][k][1])
					max=data[i][j][k][1];
			}
		}
	}
	d=max;
	while(d){
		r=Math.floor(d%10);
		d=Math.floor(d/10);
		count++;
	}				
	max=(r+1) * Math.pow(10,count);	
	diff=(Math.abs(max-min)/4);
	ticks[0]=min;
	for(var i=1; i<=4; i++){
		ticks[i]=ticks[i-1]+diff;
	}
	return ticks;
}

function getGradient(color1,color2,ratio){
    color1 = color1.substring(1,color1.length);
    color2 = color2.substring(1,color2.length);
 
    var hex = function(x) {
        x = x.toString(16);
        return (x.length == 1) ? '0' + x : x;
    };

    var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
    var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
    var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

    var middle = hex(r) + hex(g) + hex(b);
    return middle;
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
/*-------global functions end----------------*/

/*---------custom event listener start--------------*/
var CustomMouseRollOver=new CustomEvent("mouserollover",{"detail":{x:"",y:"",left:""}});
/*-----------custom event listener stop----------------*/

/*---------on window resize-----------*/
window.onresize = function() {
    location.reload();
}
