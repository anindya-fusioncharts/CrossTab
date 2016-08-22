/*-----------Line Chart--------------*/
function LineChart(drawComponents, parsedJSON, index) {
    this.index = index;                                 /*no. of chart*/
    Chart.call(this, drawComponents, parsedJSON);       /*inherite chart class*/
    if (parsedJSON.chart.xAxisType == 'date')           /*check if the X axis type date or not*/
        this.xDiff = this.parsedJSON.TickList.xAxis[this.parsedJSON.TickList.xAxis.length - 1].getTime() - this.parsedJSON.TickList.xAxis[0].getTime();         /*
                                                                        calculate difference between max X axis time tick and min X axis time tick*/
    this.yDiff = this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[index].length - 1] - this.parsedJSON.TickList.yAxis[this.index][0];  /*
                                                                        calculate difference between max Y axis tick and min Y axis tick*/
}

LineChart.prototype = Object.create(Chart.prototype);
LineChart.prototype.constructor = LineChart;

LineChart.prototype.path = function() { /*Draw the graph*/
    var x, y,                           /*Raw value of (x,y) from parsed json to plot*/
        point = {},                     /*blank object for initializing converted (x,y)*/
        path,                           /*for storing draw Path return value*/
        pathPointString,                /*for storing path string*/
        pathPoints = [],                /*for actual points to draw path after animation of line graph*/
        xAxisTickList = this.parsedJSON.TickList.xAxis,     /*ticklists of X axis*/
        width = this.parsedJSON.chart.width,                /*width of each chart*/
        height = this.parsedJSON.chart.height,              /*height of each chart*/
        marginX = this.parsedJSON.chart.marginX,            /*store margin value of X axis*/ 
        marginY = this.parsedJSON.chart.marginY,            /*store margin value of Y axis*/
        topMarginY = this.parsedJSON.chart.topMarginY,      /*store top margin value of Y axis*/
        interval = (width) / (this.parsedJSON.TickList.xAxis.length - 1),   /*calculate interval for ordinal axis*/
        midY = 0;                                           /*calculate minimum Y coordinate when raw Y value is greater than equal to 0*/

    pathPointString = 'M';
    for (var i = 0; i < this.parsedJSON.data[this.index].length; i++) {
        x = this.parsedJSON.data[this.index][i][0];         /*Raw x value of (x,y) from parsed json to plot*/
        y = this.parsedJSON.data[this.index][i][1];         /*Raw y value of (x,y) from parsed json to plot*/
        if (this.parsedJSON.chart.xAxisType == 'date')      /*check date axis or not*/
            point.x = this.drawComponents.xShift(x, this.parsedJSON.TickList.xAxis[0], this.xDiff);     /*calculate X coordinate plotpoint based on date axis*/
        else
            point.x = xAxisTickList.indexOf(x) * interval;  /*calculate X coordinate plotpoint based on ordinal X axis*/
        point.y = this.drawComponents.yShift(y, this.parsedJSON.TickList.yAxis[this.index][0], this.yDiff);     /*calculate Y coordinate plotpoint*/
        point = this.drawComponents.coordinate(point.x, point.y);   /*convert (x,y) coordinate based on chart coordinate*/
        pathPointString = pathPointString + point.x + ' ' + point.y + ', ';     /*append (x,y) coordinate in the end of path string*/
        pathPoints[i] = {};
        pathPoints[i].x = point.x;      /*initialize x coordinate*/
        pathPoints[i].y = point.y;      /*initialize y coordinate*/
        if (y >= 0) {                   /*check raw y value greater than equal to zero or not*/
            if (midY < point.y)
                midY = point.y;         /*find min y coordiante value while raw y value greater than eqaul to zero*/
        }
    }
    if (this.parsedJSON.chart.animation == true) {      /*check animation attribute is true or not*/
        pathPointString = "M";
        pathPointString = pathPointString + pathPoints[0].x + ' ' + midY + ', ' + pathPoints[pathPoints.length - 1].x + ' ' + midY;     /*set path string between min and max x coordinate and min y coordinate value*/
    }
    path = this.drawComponents.drawPath(pathPointString, "path", pathPoints, midY);     /*draw path based on the path string*/

    return path;    /*return path*/
}

LineChart.prototype.animatePath = function(path, anchors) {
    var finalPoints,            /*for final points of path after animation*/
        step = 100,             /*initialize step value*/
        incrementY = [],        /*increment value of Y coordinate*/
        midY,                   /*mid value of Y coordinate from which y coordinate animation start*/
        immdiatePoints = [],    /*current (x,y) coordinates of path*/
        pathString,             /*path string*/
        flagIntervalStop;       /*flag for interval event stop*/

    midY = path.config.y;       /*initialize by y coordinate before animation*/
    finalPoints = path.config.finalPoints;  /*initialize final points*/

    for (var i = 0, len = finalPoints.length; i < len; i++) {   /*iterate on list of final points*/
        immdiatePoints[i] = {};
        immdiatePoints[i].x = finalPoints[i].x;             /*initialize by x coordinate of final points of index i*/
        immdiatePoints[i].y = midY;                         /*initialize by y coordinate of final points of index i*/
        incrementY[i] = (finalPoints[i].y - midY) / step;   /*calculate increment value for y coordinate of final points of index i*/
    }

    var refreshIntervalId = setInterval(function() {        /*set time interval to increment Y coordinate in a specific time interval*/
        pathString = "M";
        flagIntervalStop = 1;
        for (var i = 0, len = finalPoints.length; i < len; i++) {   /*iterate on list of final points for increment y coordinate in every interval*/
            if (midY < finalPoints[i].y && immdiatePoints[i].y <= finalPoints[i].y) {               /*check if midY less than equal to final point of index i && check if current y coordinate exits limit(y coordinate of final point of index i) or not*/
                immdiatePoints[i].y = immdiatePoints[i].y + incrementY[i];                          /*increment y coordinate by increment value with current points*/
                pathString = pathString + immdiatePoints[i].x + " " + immdiatePoints[i].y + ",";    /*append (x,y) coordinate in the end of path string*/
                flagIntervalStop = 0;                                                               /*set flag interval zero*/
            } else if (midY > finalPoints[i].y && immdiatePoints[i].y >= finalPoints[i].y) {        /*check if midY greater than equal to final point of index i && check if current y coordinate exits limit(y coordinate of final point of index i) or not*/     
                immdiatePoints[i].y = immdiatePoints[i].y + incrementY[i];                          /*increment y coordinate by increment value with current points*/
                pathString = pathString + immdiatePoints[i].x + " " + immdiatePoints[i].y + ",";    /*append (x,y) coordinate in the end of path string*/
                flagIntervalStop = 0;                                                               /*set flag interval zero*/
            } else
                pathString = pathString + immdiatePoints[i].x + " " + immdiatePoints[i].y + ",";    /*append (x,y) coordinate in the end of path string*/
        }
        if (flagIntervalStop == 1) {                                            /*check flag interval one or not; it will decide if the set interval is needed to stop or not*/
            clearInterval(refreshIntervalId);                                   /*stop set interval*/
            for (var i = 0, len = anchors.length; i < len; i++) {
                anchors[i].graphics.setAttribute("visibility", "visible");      /*set visibility visible to anchor of index i of current chart*/
            }
        } else {                                                                /*if flag interval is zero*/
            path.graphics.setAttribute("d", pathString);                        /*set attribute of path to new intermidiate path string of animation process*/
        }
    }, 15);                                                                     /*set interval time at 15 milli Sec*/
}

LineChart.prototype.anchor = function() {
    var x, y,                                               /*Raw value of (x,y) from parsed json to plot*/
        point = {},                                         /*blank object for initializing converted (x,y)*/
        svgLeft, svgTop,                                    /*left x coordinate and top y coordinate of svg canvas*/
        interval,                                           /*interval for ordinal axis*/
        marginX = this.parsedJSON.chart.marginX,            /*store margin value of X axis*/ 
        width = this.parsedJSON.chart.width,                /*width of each chart*/
        xAxisTickList = this.parsedJSON.TickList.xAxis;     /*ticklists of X axis*/

    interval = (width) / (this.parsedJSON.TickList.xAxis.length - 1);   /*calculate interval for ordinal axis*/
    this.anchor = [];                                                   /*initialize with blank array*/
    svgLeft = parseInt(this.drawComponents.svg.getBoundingClientRect().left);   /*left x coordinate of svg canvas*/
    svgTop = parseInt(this.drawComponents.svg.getBoundingClientRect().top);     /*top y coordinate of svg canvas*/
    for (var i = 0; i < this.parsedJSON.data[this.index].length; i++) {         /*iterate on parsed json data*/
        x = this.parsedJSON.data[this.index][i][0];                             /*initialized by raw x data*/
        if (this.parsedJSON.chart.xAxisType == 'date') {                        /*check X axis date or ordinal*/
            point.x = this.drawComponents.xShift(x, xAxisTickList[0], this.xDiff);  /*calculate X coordinate plotpoint based on date axis*/
        } else                                                                      /*if X axis is ordinal*/
            point.x = xAxisTickList.indexOf(x) * interval;                          /*calculate X coordinate plotpoint based on ordinal X axis*/
        y = this.parsedJSON.data[this.index][i][1];                                 /*initialized by raw y data*/
        point.y = this.drawComponents.yShift(y, this.parsedJSON.TickList.yAxis[this.index][0], this.yDiff);     /*calculate Y coordinate plotpoint*/
        point = this.drawComponents.coordinate(point.x, point.y);   /*convert (x,y) coordinate based on chart coordinate*/

        this.anchor[i] = this.drawComponents.drawCircle(point, 5, "plotPoint", x, y, (svgLeft + point.x), (svgTop + point.y));  /*anchors list of index i initialized by return value of drawCircle function*/
        if (this.parsedJSON.chart.animation == true) {      /*check animation attribute is true or not*/
            this.anchor[i].graphics.setAttribute("visibility", "hidden");   /*set anchor of index i visibility attribute visible*/
        }
    }
    return this.anchor;     /*return anchor list*/
}

LineChart.prototype.chartArea = function() {
    var point = {},     /*blank object for initializing converted (x,y)*/
        point1 = {},    /*blank object for initializing converted (x,y)*/
        x,y,            /*(x,y) coordinate*/
        h,              /*height*/
        w,              /*width*/
        left,           /*left coodinate*/
        _chartArea;     /*for storing return value of rect (chart area)*/
    x = 0;              
    y = this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[this.index].length - 1];  

    point.x = x;
    point.y = this.drawComponents.yShift(y, this.parsedJSON.TickList.yAxis[this.index][0], this.yDiff);
    point = this.drawComponents.coordinate(point.x, point.y + 3);

    w = Math.abs(this.parsedJSON.chart.width);
    h = Math.abs(this.parsedJSON.chart.height - this.parsedJSON.chart.topMarginY - this.parsedJSON.chart.marginY);

    _chartArea = this.drawComponents.drawRect(point.x, point.y, "chartArea", h, w, "stroke:#black; fill:transparent");

    left = _chartArea.graphics.getBoundingClientRect().left;

    _chartArea.graphics.addEventListener("mousemove", function() {
        CustomMouseRollOver.detail.x = Math.ceil(event.clientX - left);
        _chartArea.graphics.dispatchEvent(CustomMouseRollOver);
    });
    return _chartArea;
}
    LineChart.prototype.hairLine = function() {
    var point = {};
    var point1 = {};
    var x, y, h, w;
    var _hairLine;

    y = this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[this.index].length - 1];

    point.x = 0;
    point.y = this.drawComponents.yShift(y, this.parsedJSON.TickList.yAxis[this.index][0], this.yDiff);
    point = this.drawComponents.coordinate(point.x, point.y);

    point1.x = point.x;
    point1.y = point.y + Math.abs(this.parsedJSON.chart.height - this.parsedJSON.chart.topMarginY - this.parsedJSON.chart.marginY) - 6;
    _hairLine = this.drawComponents.drawLine(point, point1, "HairLine");
    return _hairLine;
}

LineChart.prototype.crossHair = function() {
    var _chartArea, _hairLine;
    _chartArea = this.chartArea();
    _hairLine = this.hairLine();
    _hairLine.graphics.setAttribute("visibility", "hidden");
    return {
        "_chartArea": _chartArea,
        "_hairLine": _hairLine
    };
}

LineChart.prototype.syncCrossHair = function(anchors, crossHairs, toolTips, adjustingValue, e) {
    var cx;
    var adjustingValue;
    var x;
    var fixedDecimal;
    var index1, index2, slop, xRatio, sX1, sX2, sY1, sY2, cValue, yValue;
    var top, topLimit, bottomLimit, left, leftLimit, rightLimit;
    var x;
    var keyIndex;
    var x1, y1, y2, rectX, rectWidth;
    var textLength;
    var padding;
    var tooltipHeight, tooltipWidth;
    var pointX, pointY;
    var parentOffset;
    var rect;
    var r;
    var limits = {};
    var posToolTips;
    var tooltipText;
    var toolTipSize = {};

    padding = 10;
    tooltipHeight = 25;

    x = e.detail.x + adjustingValue;

    for (var i = 0, len = crossHairs.length; i < len; i++) {
        crossHairs[i]._hairLine.graphics.setAttribute("visibility", "visible");
        crossHairs[i]._hairLine.graphics.setAttribute("x1", x);
        crossHairs[i]._hairLine.config.x1 = x;
        crossHairs[i]._hairLine.graphics.setAttribute("x2", x);
        crossHairs[i]._hairLine.config.x2 = x;

        toolTips[i].rect.graphics.setAttribute("visibility", "hidden");
        toolTips[i].text.graphics.setAttribute("visibility", "hidden");

        rectX = parseInt(crossHairs[i]._chartArea.config.x);
        rectWidth = parseInt(crossHairs[i]._chartArea.config.width);

        x1 = parseInt(crossHairs[i]._hairLine.config.x1);
        y1 = parseInt(crossHairs[i]._hairLine.config.y1);
        y2 = parseInt(crossHairs[i]._hairLine.config.y2);

        leftLimit = rectX;
        rightLimit = rectX + rectWidth;
        topLimit = y1;
        bottomLimit = y2;

        limits.bottomLimit = bottomLimit;
        limits.rightLimit = rightLimit;
        limits.topLimit = topLimit;

        toolTipSize.tooltipHeight = tooltipHeight;

        for (var j = 0; j < anchors[i].length; j++) {
            cx = anchors[i][j].config.cx;
            r = anchors[i][j].config.r;
            if ((x - r) <= cx && (x + r) >= cx) {
                anchors[i][j].graphics.setAttribute("r", 6);
                anchors[i][j].config.r = 6;
                anchors[i][j].graphics.setAttribute("style", "stroke:#f44336");
                toolTips[i].text.graphics.innerHTML = anchors[i][j].config.Ydata;
                textLength = anchors[i][j].config.Ydata.toString().length;

                tooltipWidth = textLength * padding + 2 * padding;
                toolTips[i].rect.graphics.setAttribute("width", tooltipWidth.toString());
                toolTips[i].rect.graphics.setAttribute("height", tooltipHeight);

                toolTipSize.tooltipWidth = tooltipWidth;
                left = anchors[i][j].config.cx;
                top = anchors[i][j].config.cy;
                posToolTips = placeTooltip(limits, left, top, toolTipSize);

                toolTips[i].rect.graphics.setAttribute("x", posToolTips.pointX);
                toolTips[i].rect.graphics.setAttribute("y", posToolTips.pointY - 10);

                toolTips[i].text.graphics.setAttribute("x", (posToolTips.pointX + tooltipWidth/2));
                toolTips[i].text.graphics.setAttribute("y", (posToolTips.pointY + tooltipHeight/2));

                toolTips[i].rect.graphics.setAttribute("visibility", "visible");
                toolTips[i].text.graphics.setAttribute("visibility", "visible");

            } else {
                anchors[i][j].graphics.setAttribute("r", 5);
                anchors[i][j].config.r = 5;
                anchors[i][j].graphics.setAttribute("style", "stroke:#7CB5EC");
                if (j > 0) {
                    if (anchors[i][j - 1].config.cx < x && anchors[i][j].config.cx > x) {
                        sX1 = anchors[i][j - 1].config.cx;
                        sY1 = anchors[i][j - 1].config.cy;
                        sX2 = anchors[i][j].config.cx;
                        sY2 = anchors[i][j].config.cy;
                        slop = ((sY2 - sY1) / (sX2 - sX1)).toFixed(3);
                        cValue = (sY2 - slop * sX2);
                        yValue = Math.abs((slop * x1) + cValue);
                        xRatio = (anchors[i][j].config.Ydata - anchors[i][j - 1].config.Ydata) / Math.abs(sX1 - sX2);

                        if (anchors[i][j].config.Ydata % 1 != 0)
                            fixedDecimal = (anchors[i][j].config.Ydata % 1).toString().length;
                        else
                            fixedDecimal = 0;
                        tooltipText = ((anchors[i][j - 1].config.Ydata + xRatio * Math.abs(sX1 - x1)).toFixed(fixedDecimal)).toString();
                        toolTips[i].text.graphics.innerHTML = tooltipText;
                        textLength = tooltipText.length;
                        tooltipWidth = textLength * padding + 2 * padding;

                        toolTipSize.tooltipWidth = tooltipWidth;

                        top = Math.floor(yValue);
                        left = x1;
                        posToolTips = placeTooltip(limits, left, top, toolTipSize);

                        toolTips[i].rect.graphics.setAttribute("width", tooltipWidth.toString());
                        toolTips[i].rect.config.width = tooltipWidth.toString();

                        toolTips[i].rect.graphics.setAttribute("height", tooltipHeight);
                        toolTips[i].rect.config.height = tooltipHeight;

                        toolTips[i].rect.graphics.setAttribute("x", posToolTips.pointX);
                        toolTips[i].rect.graphics.setAttribute("y", posToolTips.pointY - 10);

                        toolTips[i].rect.config.x = posToolTips.pointX;
                        toolTips[i].rect.config.y = posToolTips.pointY;

                        toolTips[i].text.graphics.setAttribute("x", (posToolTips.pointX + tooltipWidth/2));
                        toolTips[i].text.graphics.setAttribute("y", (posToolTips.pointY + tooltipHeight/2));

                        toolTips[i].text.config.x = (posToolTips.pointX + Math.floor((tooltipWidth - (textLength * padding)) / 2));
                        toolTips[i].text.config.y = (posToolTips.pointY + tooltipHeight/2);

                        toolTips[i].rect.graphics.setAttribute("visibility", "visible");
                        toolTips[i].text.graphics.setAttribute("visibility", "visible");
                    }
                }
            }
        }
    }
}

LineChart.prototype.hideCrossHair = function(anchors, crossHairs, toolTips, e) {
    for (var i = 0, len = anchors.length; i < len; i++) {
        crossHairs[i]._hairLine.graphics.setAttribute("visibility", "hidden");
        crossHairs[i]._hairLine.graphics.setAttribute("x1", "1");
        crossHairs[i]._hairLine.graphics.setAttribute("x2", "1");

        toolTips[i].rect.graphics.setAttribute("visibility", "hidden");
        toolTips[i].text.graphics.setAttribute("visibility", "hidden");
        for (var j = 0, len1 = anchors[i].length; j < len1; j++) {
            anchors[i][j].graphics.setAttribute("style", "fill:#ffffff");
            anchors[i][j].graphics.setAttribute("r", 5);
            anchors[i][j].config.r = 5;
        }
    }
}

LineChart.prototype.reset = function(plotPoints) {
    for (var i = 0, len = plotPoints.length; i < len; i++) {
        for (var j = 0, len1 = plotPoints[i].length; j < len1; j++) {
            plotPoints[i][j].graphics.setAttribute("style", "stroke:#f44336");
            plotPoints[i][j].graphics.setAttribute("r", 5);
        }
    }
}

LineChart.prototype.select = function(plotPoints) {
    var x1 = parseInt(selectSpace.style.left);
    var y1 = parseInt(selectSpace.style.top);
    var x2 = x1 + parseInt(selectSpace.style.width);
    var y2 = y1 + parseInt(selectSpace.style.height);
    var maxX = -1,
        minX = 99999;
    var x, y;

    for (var i = 0, len = plotPoints.length; i < len; i++) {
        for (var j = 0, len1 = plotPoints[i].length; j < len1; j++) {
            x = Number(plotPoints[i][j].config.absoluteX);
            y = Number(plotPoints[i][j].config.absoluteY);

            if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
                plotPoints[i][j].graphics.setAttribute("style", "stroke:#f44336");
                plotPoints[i][j].graphics.setAttribute("r", 6);
                if (minX > Number(plotPoints[i][j].config.cx))
                    minX = Number(plotPoints[i][j].config.cx);

                if (maxX < Number(plotPoints[i][j].config.cx))
                    maxX = Number(plotPoints[i][j].config.cx);
            }
        }
    }

    for (var i = 0, len = plotPoints.length; i < len; i++) {
        for (var j = 0, len1 = plotPoints[i].length; j < len1; j++) {
            if (minX <= Number(plotPoints[i][j].config.cx) && Number(plotPoints[i][j].config.cx) <= maxX) {
                plotPoints[i][j].graphics.setAttribute("style", "stroke:#f44336");
                plotPoints[i][j].graphics.setAttribute("r", 6);

            }
        }
    }
}
