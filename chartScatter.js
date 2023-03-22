//=======================================================================================================
// Functions to draw a Scatter Chart - Allows 1 data point per 25px of canvas height (e.g. 12 per 300px)
// Must provide: dataPoints object, canvas id, legend id
// Each data point is a name and an array of numeric values (e.g. name:[123,234,345])
//=======================================================================================================
function drawScatterChart(dataPoints,canvas,legend)
{
    var labels   = [];            //array to hold the labels
    var data     = [];            //array to hold the data values
    var averages = [];            //array that will contain the average value for each data point
    var ratios   = [];            //array that will contain the ratio (against max) for each data point

    var colors = ["red","green","blue","yellow","brown","cyan","tan","purple","coral","black","teal","pink","maroon","olive","magenta","gray"];

    var i=0;
    for (prop in dataPoints)
    {
        labels[i] = prop;                           //the label
        data[i]   = dataPoints[prop];               //the data value
        i++;
    }   

    var canvas  = document.getElementById(canvas);
    var legend  = document.getElementById(legend);
    var context = canvas.getContext("2d");

    maxDataPoints = canvas.height/25                //1 data point per 25px canvas height
    if (data.length > maxDataPoints)     
    { 
        alert("Data points number > "+ maxDataPoints +".  Ignored");
        data.length = maxDataPoints;
    }

    averages = computeAverages(data);                       //build the averages array
    ratios   = computeRatios(averages);                     //build the ratio array
    
    context.clearRect(0,0,canvas.width,canvas.height);      //clear previous chart 

    for (var i=0; i < data.length; i++) 
        drawScatter(canvas,context,i,ratios,colors);   		//draw a single scatter line

    drawLabels(data,averages,labels,colors,legend);         //create the legends
    setTitle(data,averages,labels,colors,canvas);           //create the hover over title
}
//=======================================================================================================
// Compute the average value for each data point 
// Each data point might have multiple values.  Compute the average of those values
//=======================================================================================================
function computeAverages(data) 
{
    var total    = 0;                            
    var averages = [];                                      //array of averages for each data point

    for (var i=0; i < data.length; i++)                     //loop thru all data points
    {
        total = 0;
        for (var j=0; j < data[i].length; j++)              //loop thru all values for a single data point      
            total  += data[i][j];

        averages[i] = Math.round(total/data[i].length,0);   //compute the average of all values for a single data point          
    }   
    return(averages)
}
//=======================================================================================================
// Convert the data values to ratios 
// Ratio of each data value against the largest data value
//=======================================================================================================
function computeRatios(data) 
{
    var max    = 0;                             //variable to hold maximum data value
    var ratios = [];                            //array that will contain the ratio of each value against max value

    for(var i=0; i < data.length; i++)          //find the max value
        if (data[i] > max)
            max = data[i];

    for(var i=0; i < data.length; i++)
        ratios[i] = data[i]/max *.95;           //ratio = data value / max value (*.95 so it is not to the top)

    return(ratios)
}
//=======================================================================================================
// Drawing a single Bar in a Bar chart.
// Bar heights are ratios to the highest bar 
//=======================================================================================================
function drawScatter(canvas, context, i, ratios, colors) 
{
    var scatterSpace = Math.floor(canvas.width /ratios.length);    //how much space should each scatter take
    var scatterWidth   = scatterSpace * .75;                       //the scatter width
    var scatterSpacing = scatterSpace * .25;                       //the spacing in between

    var X = scatterSpace * i + 5;                                 //starting X position (left)     
    var Y = canvas.height - (ratios[i]*canvas.height) -1;         //starting Y position (top)
    var scatterHeight = 10;                                       //the scatter height                                                        //center of canvas

    context.beginPath();                                          //start drawing one rectangle
    context.rect(X, Y, scatterWidth, scatterHeight);              //specify the rectangle location & dimenension
    context.lineWidth   = 2;                                      //border width
    context.strokeStyle = 'gray';                                 //border line color
    context.stroke()                                              //draw rectangle
    context.closePath();                                          //end drawing one rectangle                                                 

    context.fillStyle = colors[i];                                //set the fill color
    context.fill();                                               //fill the rectangle
}
//=======================================================================================================
// create the labels 
//=======================================================================================================
function drawLabels(data,averages,labels,colors,legend) 
{
    var str = "<table>";
    for (var i=0; i < averages.length; i++)
    {
        var avg = (data[i].length > 1) ? 'avg' : '';
        str += "<tr><td width=10 bgcolor="+ colors[i] +"><td>"+ labels[i].substr(0,30) +' '+ avg +'='+ averages[i] +"</tr>";
    }
    str += "</table>";

    legend.innerHTML = str;
}
//=======================================================================================================
// create the hover over title
//=======================================================================================================
function setTitle(data,averages,labels,colors,canvas)
{
    var str="";
    for (var i=0; i < averages.length; i++) 
    {
        var avg = (data[i].length > 1) ? 'avg' : '';
        str += " "+ colors[i] +"\t"+ labels[i] +' '+ avg +'='+ averages[i] +"\n";
    }
    canvas.title = str;
}
//=======================================================================================================
