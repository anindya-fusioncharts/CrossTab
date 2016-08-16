/*------axis start----------*/

function Axis(drawComponents,parsedJSON){
	if(drawComponents)
		this.drawcomponents=drawComponents;	
	if(parsedJSON)
		this.parsedJSON=parsedJSON;
	this.axisType;
}

Axis.prototype.checkAxisType=function(values){
	var	dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/,
		date,
		dateFlag,
		numberFlag;
	if(Array.isArray(values)){
		dateFlag=0;
		for(var i=0, len=values.length; i<len; i++){
			if(values[i].match(dateReg) !=null){
				date=new Date(values[i]);
				if(date != 'Invalid Date'){
					dateFlag=1;
				}
			}
		}

		if(dateFlag==1)
			return "date";
		else {
			flagNumber=0;
			for(i=0, len=values.length; i<len; i++){
				if(isNaN(values[i]))
					return "ordinal";
				else
					numberFlag=1;
			}
			if(numberFlag==1)
				return "number";
		}
	}
}

Axis.prototype.dateTickTexts=function(limits,values){
	var	axis=this,
		parsedJSON=axis && axis.parsedJSON;
		k=values.length,		
		interval,
		tickValue,
		ticks=[],
		intermediateDate;
			
	this.diff=limits.max.getTime() - limits.min.getTime();

	if(parsedJSON.chart.height>=800)
		interval=10;
	if(k<=10 && parsedJSON.chart.height<800)
		interval=Math.floor(diff/(k-1));		
	else
		interval=Math.floor(diff/9);	

	if(parsedJSON.chart.height<300)
		interval=6;

	tickValue=limits.min;
	ticks[0]=limits.min;
	for(var i=1 ;tickValue<=limits.max; i++){		
		intermediateDate=new Date(parseInt(ticks[i-1].getTime()+ interval)) ;
		if(intermediateDate<=limits.max) {
			ticks[i]=intermediateDate;
		}	
		
		tickValue=intermediateDate;
	}
	return ticks;
}

Axis.prototype.ordinalTickTexts=function(values){
	return values;
}

Axis.prototype.numberTicktexts=function(limits,values){
	var index=2,
		diffDigit,
		interval,
		computedMin,
		computedMax,
		decimalFlag,
		ticks=[];

	computedMin=limits.min;
	computedMax=limits.max;
	decimalFlag=limits.decimalFlag;

	diffDigit=Math.floor(computedMax/Math.pow(10,(computedMax.toString().length-index)))-Math.floor(computedMin/Math.pow(10,(computedMax.toString().length-index)));
	
	if(parseInt(computedMax.toString()[1])==0)
		index=1;

	if(diffDigit>=0 && diffDigit<=1)
		interval=0.25;
	else if(diffDigit>=0 && diffDigit<=1)
		interval=0.25;
	else if(diffDigit>1 && diffDigit<=2)
		interval=0.5;
	else if(diffDigit>2 && diffDigit<=6)
		interval=1;
	else if(diffDigit>6 && diffDigit<=12)
		interval=2;
	else if(diffDigit>12 && diffDigit<=20)
		interval=4;
	else if(diffDigit>20 && diffDigit<=30)
		interval=5;
	else if(diffDigit>30 && diffDigit<40)
		interval=7;
	else if(diffDigit>=40)
		interval=10;	

	
	ticks[0]=computedMin + negatedmin;

	tickValue=ticks[0];
	for(var j=1; tickValue<=(computedMax+negatedmin);j++){
		ticks[j]=t[j-1]  + interval*Math.pow(10,decimalFlag*(computedMax.toString().length-index));		
		tickValue=ticks[j];			
	}

	this.diff=ticks[ticks.length-1]-ticks[0];									

	return ticks;
}
/*------axis end----------*/
