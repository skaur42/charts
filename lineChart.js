//=======================================================================================================
// Functions to draw a Line Chart - Allows 1 data point per 25px of canvas height (e.g. 12 per 300px)
// Must provide: dataPoints object, canvas id, legend id
// Each data point is a name and an array of numeric values (e.g. name:[123,234,345])
//=======================================================================================================

function drawLineChart(dataPoints,canvas,legend)
{
    var labels   = [];            //array to hold the labels
    var data     = [];            //array to hold the data values
    var averages = [];            //array that will contain the average value for each data point
    var range;                    //value that will have the range of maximum value - minimum value

    var colors = ["red","green","blue","yellow","brown","cyan","tan","purple","coral","black","teal","pink","maroon","olive","magenta","gray"];

    var i=0;
    for (prop in dataPoints)
    {
        labels[i] = prop;                           //the label
        data[i]   = dataPoints[prop];               //the data values
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
    range    = computeRange(data);                          //compute the range of all data values
    
    context.clearRect(0,0,canvas.width,canvas.height);      //clear previous chart 

    for (var i=0; i < data.length; i++) 
        drawLine(canvas,context,i,data,averages,range,colors);      //draw a single line

    drawLabels(data,averages,labels,colors,legend);                 //create the legends
    setTitle(data,averages,labels,colors,canvas);                   //create the hover over title
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
// Compute the range of all data values   (to determine height of data value) 
//=======================================================================================================
function computeRange(data) 
{
    var min = 0;
    var max = 0; 
    var range;     

    for(var i=0; i < data.length; i++)         //find the min and max values
        for(var j=0; j < data[i].length; j++)
        {         
            if (data[i][j] < min) 
                min = data[i][j];
            if (data[i][j] > max) 
                max = data[i][j];
        }    
    range = (max-min) / .95                     //.95 so the highest point does not hit the top of chart                    
    return(range);
}
//=======================================================================================================
// Drawing a single line in a line chart.
// Line heights data values as a ratio of the range
//=======================================================================================================
function drawLine(canvas, context, i, data, averages, range, colors) 
{
    if (data[i].length == 1)                                    //if data point has only 1 value
        data[i][1] = data[i][0];                                //create a 2nd one with same value

    var width = canvas.width/(data[i].length -1);
     
    context.lineWidth   = 3;                                    //line width
    context.strokeStyle = colors[i];                            //set the line color
//  context.lineCap     = 'round';                              //line end style

    for (var j=0; j < data[i].length-1; j++)                    //for as many values in a single data point
    {
        var Y  = canvas.height - (canvas.height*data[i][j]/range);      //starting Y position (from top)
        var X  = width * j;                                             //starting X position (from left)
        var Y2 = canvas.height - (canvas.height*data[i][j+1]/range);    //ending Y position (from top)
        var X2 = width * (j+1);                                         //starting X position (from left)

        context.beginPath();                                //start drawing one rectangle
        context.moveTo(X, Y)                                //from X and Y (left, top) positions
        context.lineTo(X2,Y2);                              // to  X and Y (left, top) positions
        context.stroke()                                    //draw line
    }
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
