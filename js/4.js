/*--------Engine start---------*/
function Engine(rawJSON,selector){

	
	
	this._drawComponents=[];
	this._crossHair=[],
	this._anchors=[];
	this._tooltip=[];
	this._columns=[];
	this.selector=selector;
	this.parsedJSON=parseJSON(rawJSON);
}
Engine.prototype.render=function(){
		if(this.parsedJSON.chart.type=='line'){
			this.lineChart();
		}
		
		if(this.parsedJSON.chart.type=='column'){
			this.columnChart();
		}
		if(this.parsedJSON.chart.type=='crosstab'){
			this.crossTab();
		}
		
}

Engine.prototype.lineChart=function(){
	var noChart;
	var tickPosDown;
	var _drawComponents;
	var _yAxis,_xAxis;
	var _lineChart,_columnChart;
	var point0={};
	var count=0;
	var _this=this;
	
	if(typeof this.customSort == "function"){
		this.customSort();
	}

	this.parsedJSON.TickList={};
	this.parsedJSON.TickList.xAxis=[];
	this.parsedJSON.TickList.xAxis=xRangeTicks(this.parsedJSON);

	this.parsedJSON.TickList.yAxis=[];
	this.parsedJSON.TickList.yAxis=yRangeTicks(this.parsedJSON);

	tickPosDown=tickspoistion(this.parsedJSON);
	
	if(tickPosDown){
		this.parsedJSON.chart.marginY=45;
		this.parsedJSON.chart.topMarginY=75;
	}else{
		this.parsedJSON.chart.marginY=75;
		this.parsedJSON.chart.topMarginY=45;										
	}
	selectDiv(this.selector);

	drawChartHeading(this.selector,this.parsedJSON);
	noChart=this.parsedJSON.chart.yMap.length;
	for(var i=0; i<noChart; i++){	
		this._anchors[i]=[];	
		this._drawComponents[i]= new DrawComponents(this.selector,this.parsedJSON.chart.width,this.parsedJSON.chart.height,this.parsedJSON.chart.marginX,this.parsedJSON.chart.marginY,this.parsedJSON.chart.topMarginY);
		
		_yAxis=new YAxis(this.parsedJSON,this._drawComponents[i],i,tickPosDown);
		_yAxis.draw();

		_xAxis=new XAxis(this.parsedJSON,this._drawComponents[i],i+1,tickPosDown);
		_xAxis.draw();	
	
		_lineChart=new LineChart(this._drawComponents[i],this.parsedJSON,i);
		_lineChart.path();
		this._anchors[i]=_lineChart.anchor();
		this._crossHair[i]=_lineChart.crossHair();
	
		point0.x=0;
		point0.y=0;
		this._tooltip[i]=new Tooltip(this._drawComponents[i],point0,"tooltip","tooltipText");
			
		this._drawComponents[i].svg.addEventListener("mousedown",drawSelectSpace.bind(null,this._drawComponents[i],this.selector,"line"));
		this._drawComponents[i].svg.addEventListener("mousemove",resizeSelectSpace.bind(null,this._drawComponents[i],this.selector,"line"));
		this._drawComponents[i].svg.addEventListener("mouseup",destroySelectSpace.bind(null,this._drawComponents[i],this.selector,"line"));	
		this._drawComponents[i].svg.addEventListener("mouseleave",destroySelectSpace.bind(null,this._drawComponents[i],this.selector,"line"));			
	}		
}

Engine.prototype.columnChart=function(){
	var noChart;
	var tickPosDown;
	var _drawComponents;
	var _yAxis,_xAxis;
	var _lineChart,_columnChart;
	var point0={};
	var count=0;
	var _this=this;


	
	if(typeof this.customSort == "function"){
		this.customSort();
	}

	this.parsedJSON.TickList={};
	this.parsedJSON.TickList.xAxis=[];
	this.parsedJSON.TickList.xAxis=xRangeTicks(this.parsedJSON);

	this.parsedJSON.TickList.yAxis=[];
	this.parsedJSON.TickList.yAxis=yRangeTicks(this.parsedJSON);

	tickPosDown=tickspoistion(this.parsedJSON);
	
	if(tickPosDown){
		this.parsedJSON.chart.marginY=45;
		this.parsedJSON.chart.topMarginY=75;
	}else{
		this.parsedJSON.chart.marginY=75;
		this.parsedJSON.chart.topMarginY=45;										
	}
	selectDiv(this.selector);

	drawChartHeading(this.selector,this.parsedJSON);
	noChart=this.parsedJSON.chart.yMap.length;
	for(var i=0; i<noChart; i++){	
		this._anchors[i]=[];	
		this._drawComponents[i]= new DrawComponents(this.selector,this.parsedJSON.chart.width,this.parsedJSON.chart.height,this.parsedJSON.chart.marginX,this.parsedJSON.chart.marginY,this.parsedJSON.chart.topMarginY);
		
		_yAxis=new YAxis(this.parsedJSON,this._drawComponents[i],i,tickPosDown);
		_yAxis.draw();

		_xAxis=new XAxis(this.parsedJSON,this._drawComponents[i],i+1,tickPosDown);
		_xAxis.draw();	
	
		_columnChart=new Column(this._drawComponents[i],this.parsedJSON,i);
		
		this._columns[i]=_columnChart.col(count);
		point0.x=0;
		point0.y=0;
		this._tooltip[i]=new Tooltip(this._drawComponents[i],point0,"tooltip","tooltipText");	

		this._drawComponents[i].svg.addEventListener("mousedown",drawSelectSpace.bind(null,this._drawComponents[i],this.selector,"column"));
		this._drawComponents[i].svg.addEventListener("mousemove",resizeSelectSpace.bind(null,this._drawComponents[i],this.selector,"column"));
		this._drawComponents[i].svg.addEventListener("mouseup",destroySelectSpace.bind(null,this._drawComponents[i],this.selector,"column"));	
		this._drawComponents[i].svg.addEventListener("mouseleave",destroySelectSpace.bind(null,this._drawComponents[i],this.selector,"column"));			
	}	
}

Engine.prototype.crossHairHandler=function(){
	var _this=this;
	var noChart=this.parsedJSON.chart.yMap.length;
	for(var i=0; i<noChart; i++){
		this._crossHair[i]._chartArea.addEventListener("mouserollover",syncCrossHair.bind(_this));		
		this._crossHair[i]._chartArea.addEventListener("mouseout",hideCrossHair);		
	}	
}

Engine.prototype.crossTab=function(){

	this.widthScreen=window.innerWidth-50;
	this.widthPerSubChart=Math.floor(this.widthScreen/(this.parsedJSON.chart.tab_titlesList.length));
	this._drawComponents[0]= new DrawComponents(this.selector,this.widthScreen,30,0,0,0);
	var crossTab=new CrossTab(this.parsedJSON);
	crossTab.header(this._drawComponents[0],this.widthPerSubChart);
}

/*--------Engine end-------------*/
