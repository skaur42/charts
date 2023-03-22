//=======================================================================================================
// Functions to draw a Pie Chart - Allows 1 data point per 25px of canvas height (e.g. 12 per 300px)
// Must provide: dataPoints object, canvas id, legend id
// Each data point is a name and an array of numeric values (e.g. name:[123,234,345])
//=======================================================================================================
var avg2;
function drawPieChart(dataPoints,canvas,legend)
{
    var labels   = [];            //array to hold the labels
    var data     = [];            //array to hold the data values
    var averages = [];            //array that will contain the average value for each data point
    var radians  = [];            //array that will contain the cumulative radian (0 - PI*2) for each data point

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

    maxDataPoints = canvas.height/25                        //1 data point per 25px canvas height
    if (data.length > maxDataPoints)     
    { 
        alert("Data points number > "+ maxDataPoints +".  Ignored");
        data.length = maxDataPoints;
    }

    averages = computeAverages(data);                       //build the averages array
    radians  = computeRadians(averages);                    //build the radians  array

    context.clearRect(0,0,canvas.width,canvas.height);      //clear previous chart 

    for (var i=0; i < data.length; i++) 
        drawPieSlice(canvas,context,i,radians,colors);      //draw a single slice (arc)

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
// Convert the data values to radians 
// Pie angles are defined in radian.  Range is --> 0 thru PI*2 (6.28)  (1 radian = 57.3 degrees)
//=======================================================================================================
function computeRadians(averages) 
{
    var cume      = 0;                              //variable to hold total data values up to i (numerator)
    var total     = 0;                              //variable to hold total data values         (denominator)
    var radians   = [];                             //array that will contain the cumulative radians (0 - PI*2)
    
    for (var i=0; i < averages.length; i++)
        total += averages[i];                       //compute the total of all averages
    for (var i=0; i < averages.length; i++)
    {
        cume += averages[i];                        //compute total of all values up to i
        radians[i] = cume/total * Math.PI*2;        //radian = ratio cume/total * PI*2
    }
    return(radians)
}
//=======================================================================================================
// Drawing an arc (part of circle) requires a starting angle and an ending angle. 
// Angles are defined in radian.  Range is --> 0 thru PI*2 (6.28)  (1 radian = 57.3 degrees)
//=======================================================================================================
function drawPieSlice(canvas, context, i, radians, colors) 
{
    var centerX = Math.floor(canvas.width  / 2);                    //center of canvas
    var centerY = Math.floor(canvas.height / 2);                    //center of canvas
    var radius  = Math.floor(canvas.width  / 2);                    //radius is 1/2 diameter

    var angleStart = radians[i-1] || 0                              //from previous radian, or 0                    
    var angleEnd   = radians[i];                                    //to current radian                                                         

    context.beginPath();                                            //start drawing one slice
    context.moveTo(centerX, centerY);                               //set the center of circle
    context.arc(centerX, centerY, radius, angleStart, angleEnd);    //draw the arc (part of circle)
    context.closePath();                                            //end drawing one slice                                                 

    context.fillStyle = colors[i];                                  //set the fill color
    context.fill();                                                 //fill the slice
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
