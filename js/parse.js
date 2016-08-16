function parseJSON(rawJSON,selector){
	var noData,
		keys,
		flag,
		flagC,
		flagS,
		tab_titles=[],
		categoryList=[],
		subCategoryList=[],
		uniqueKeys=[],
		DataSet=[],
		internalDataStructure={},
		maxProfitPrcnt,
		maxLossPrcnt,
		minProfitPrcnt,
		minLossPrcnt,
		percent,
		xAxisValue=[],
		flagXvalue;

	maxProfitPrcnt=maxLossPrcnt=minProfitPrcnt=minLossPrcnt=undefined;

	try{
		internalDataStructure.chart={};
		internalDataStructure.chart.type=chartType=rawJSON.chart.type;	
		if(internalDataStructure.chart.type=='line' || internalDataStructure.chart.type=='column'){
			internalDataStructure.chart.caption=rawJSON.chart.caption || "";
			internalDataStructure.chart.subCaption=rawJSON.chart.subCaption || "";
			internalDataStructure.chart.height=rawJSON.chart.height || 300;		
			internalDataStructure.chart.height=(internalDataStructure.chart.height>500 || internalDataStructure.chart.height<200) ? 300 : internalDataStructure.chart.height;
			internalDataStructure.chart.width= rawJSON.chart.width || 500;						
			internalDataStructure.chart.width=(internalDataStructure.chart.width>1000 || internalDataStructure.chart.width<200)?500: internalDataStructure.chart.width;
			internalDataStructure.chart.type=rawJSON.chart.type||"line";
			internalDataStructure.chart.marginX=80;
			internalDataStructure.chart.marginY=20;
			internalDataStructure.chart.topMarginY=60;
			internalDataStructure.chart.xMap=rawJSON.chart.xAxisMap;
			
			for(var i=0,k=0; i<rawJSON.data.length; i++){
				keys=Object.keys(rawJSON.data[i]);
				
				if(k==0 && i==0)
					uniqueKeys[k]=keys[0];

				for(var j=0; j<keys.length; j++){
					flag=0;
					for(var l=0;l<uniqueKeys.length; l++){
						if(uniqueKeys[l]==keys[j]){
							flag=1;												
						}
					}
					if(flag==0 && keys[j]!=internalDataStructure.chart.xMap){
						k++;
						uniqueKeys[k]=keys[j];							
					}				
				}				
			}

			internalDataStructure.chart.yMap=uniqueKeys;
			internalDataStructure.data=[];
			
			for(var i=0,l=0; i<internalDataStructure.chart.yMap.length; i++){
				DataSet[i]=[];
				for(var j=0,k=0;j<rawJSON.data.length;j++){				
					if (rawJSON.data[j][internalDataStructure.chart.yMap[i]]!= undefined && rawJSON.data[j][internalDataStructure.chart.xMap] != undefined){
						DataSet[i][k]=[];
						DataSet[i][k][0]=rawJSON.data[j][internalDataStructure.chart.xMap];
						DataSet[i][k][1]=rawJSON.data[j][internalDataStructure.chart.yMap[i]];
						k++;
						flagXvalue=0;
						for(var ii=0,len=xAxisValue.length; ii<len; ii++){
							if(xAxisValue[ii] == DataSet[i][k][0])
								flagXvalue=1;
						}

						if(flagXvalue == 0){
							xAxisValue[l]=DataSet[i][k][0];
							l++;
						}
										
					}											
				}
				DataSet[i]=sortByDate(DataSet[i]);
			}	
			internalDataStructure.chart.xAxisValue=xAxisValue;
				
		} else if(internalDataStructure.chart.type=='crosstab'){
			if(!rawJSON.chart.category_name){						
				throw new Error("Chart can not be rendered");
			}
			internalDataStructure.chart.titles=rawJSON.chart.titles;
			internalDataStructure.chart.tab_titles=rawJSON.chart.tab_titles;
			internalDataStructure.chart.category_name=rawJSON.chart.category_name;
			internalDataStructure.chart.sub_category_name=rawJSON.chart.sub_category_name;
			internalDataStructure.chart.numberprefix=rawJSON.chart.numberprefix;
			internalDataStructure.chart.maxProfitColor=rawJSON.chart.maxProfitColor;
			internalDataStructure.chart.minProfitColor=rawJSON.chart.minProfitColor;
			internalDataStructure.chart.maxLossColor=rawJSON.chart.maxLossColor;
			internalDataStructure.chart.minLossColor=rawJSON.chart.minLossColor;
			internalDataStructure.data=[];
			for(var i=0,k=0; i<rawJSON.data.length; i++){
				flag=0;
				if(tab_titles[0]== undefined)
					tab_titles[0]= rawJSON.data[0][internalDataStructure.chart.tab_titles];			
				for(var j=0; j< tab_titles.length; j++){
					if(tab_titles[j]==rawJSON.data[i][internalDataStructure.chart.tab_titles])
						flag =1;
				}			
				if(flag==0){
					tab_titles[j]=rawJSON.data[i][internalDataStructure.chart.tab_titles];
				}
				flagC=0;
				if(categoryList[0]== undefined)
					categoryList[0]= rawJSON.data[0].category;
				for(var j=0; j<categoryList.length; j++){
					if(categoryList[j]==rawJSON.data[i].category)
						flagC=1;
				}
				if(flagC==0)
					categoryList[j]=rawJSON.data[i].category;
			}
			tab_titles.sort();
			internalDataStructure.chart.tab_titlesList=[];
			internalDataStructure.chart.tab_titlesList=tab_titles;


			internalDataStructure.chart.categoryList=[];
			internalDataStructure.chart.categoryList=categoryList;

			for(var i=0; i<categoryList.length; i++){
				subCategoryList[i]=[];		
				for(var j=0,k=0; j<rawJSON.data.length; j++){
					if(k==0&& rawJSON.data[j].category==categoryList[i]){
						subCategoryList[i][0]=rawJSON.data[j].sub_category;
						k++;
					}
					flagS=0;
					for(var m=0; m<subCategoryList[i].length; m++){
						if(subCategoryList[i][m]==rawJSON.data[j].sub_category && rawJSON.data[j].category==categoryList[i])
							flagS=1;
					}
					if(flagS==0 && rawJSON.data[j].category==categoryList[i]){
						subCategoryList[i][k]=rawJSON.data[j].sub_category;
						k++;					
					}
				}
			}

			internalDataStructure.chart.subCategoryList=[];
			internalDataStructure.chart.subCategoryList=subCategoryList;

			for(var i=0;i<categoryList.length; i++){
				DataSet[i]=[];
				for(var j=0; j<tab_titles.length; j++){
					DataSet[i][j]=[];
					for(var k=0; k<subCategoryList[i].length; k++){
						for(var l=0; l<rawJSON.data.length; l++){
							if(rawJSON.data[l].category==categoryList[i] && rawJSON.data[l].sub_category==subCategoryList[i][k] && rawJSON.data[l][internalDataStructure.chart.tab_titles]== tab_titles[j]){									
								DataSet[i][j][k]=[];
								DataSet[i][j][k][0]=rawJSON.data[l]["Sum of Profit"];
								DataSet[i][j][k][1]=rawJSON.data[l]["Sum of Sales"];
								break;
							}
						}
						if(l==rawJSON.data.length){						
							DataSet[i][j][k]=[];
							DataSet[i][j][k][0]=undefined;
							DataSet[i][j][k][1]=undefined;		
						}
					}					
					DataSet[i][j][subCategoryList[i].length]=[];
					DataSet[i][j][subCategoryList[i].length][0]=0;
					DataSet[i][j][subCategoryList[i].length][1]=0;
					for(var k=0; k<subCategoryList[i].length; k++){
						if(DataSet[i][j][k][0]!= undefined || DataSet[i][j][k][1]!=undefined){
							DataSet[i][j][subCategoryList[i].length][0]+=DataSet[i][j][k][0];
							DataSet[i][j][subCategoryList[i].length][1]+=DataSet[i][j][k][1];
						}
					}	
					if(DataSet[i][j][subCategoryList[i].length][1]==0){
						DataSet[i][j][subCategoryList[i].length][1]=undefined;
						DataSet[i][j][subCategoryList[i].length][0]=undefined;
					}		
				}
			}
			for(var i=0; i<categoryList.length; i++){
				subCategoryList[i][subCategoryList[i].length]="Total";
			}
			
			for(var i=0; i<DataSet.length; i++){
				for(var j=0; j<DataSet[i].length; j++){
					for(var k=0; k<DataSet[i][j].length; k++){
							if(DataSet[i][j][k][1]!= undefined){
								if(DataSet[i][j][k][0]>=0){
									if(maxProfitPrcnt == undefined && minProfitPrcnt== undefined){
										maxProfitPrcnt=minProfitPrcnt=100*DataSet[i][j][k][0]/DataSet[i][j][k][1];
									}
									percent=(100*Math.abs(DataSet[i][j][k][0])/DataSet[i][j][k][1]).toFixed(2);
									if(maxProfitPrcnt<percent){
										maxProfitPrcnt=percent;
									}
									if(minProfitPrcnt>percent){
										minProfitPrcnt=percent;
									}					
								} else {
									if(maxLossPrcnt == undefined && minLossPrcnt== undefined){
										maxLossPrcnt=minLossPrcnt=(100*Math.abs(DataSet[i][j][k][0])/DataSet[i][j][k][1]).toFixed(2);
									}
									percent=(100*Math.abs(DataSet[i][j][k][0])/DataSet[i][j][k][1]).toFixed(2);
									if(maxLossPrcnt<percent){
										maxLossPrcnt=percent;
									}
									if(minLossPrcnt>percent){
										minLossPrcnt=percent;
									}				
								}
							}
					}
				}
			}
			internalDataStructure.maxProfitPrcnt=maxProfitPrcnt;
			internalDataStructure.minProfitPrcnt=minProfitPrcnt;
			internalDataStructure.maxLossPrcnt=maxLossPrcnt;
			internalDataStructure.minLossPrcnt=minLossPrcnt;
		} else{
			throw new Error("Chart type not supported.");
		}
		internalDataStructure.data=DataSet;	
	}catch (err){
		document.getElementById(selector).innerHTML=err.message;
	}

	return internalDataStructure;
}