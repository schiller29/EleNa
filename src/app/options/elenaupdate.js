//click on elena.html to run in browser
//Scroll to bottom of page to see the path constructed with optimized gain, and its comparison with the gain of both the shortest path as well as with the gain of a randomly generated path.

var CURRENT_BEST = 0;
var CURRENT_BEST_PL = 0;
var SHORTEST_PATH_EL = 0;
var LONGEST_PATH = 0;


function vertexObj(vid, lat, long, elev, label) {
    this.vid = vid;
    this.lat = lat;
    this.long = long;
    this.elev = elev;
    this.label = label;
}


//obtain the index of vertexObj with vid == Vvid within a list of vertexObj's called Vertexes
function indexOfVertex(Vvid, Vertexes) {
    for (var i = 0; i < Vertexes.length; i++) {
        if (Vertexes[i].vid == Vvid) {  //vid's are unique, so only need to check this property
            return i;
        }
    }
    return -1;
}


//returns an integer between min and max, both inclusive
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}


function Graph() {
  //vid will serve as the identifier of a vertex object, so functions will all work as they did before
  this.vertices = [];  //list of vertex objects where ith vertex has vid == i
  this.edges = [];  //list of lists of {vid:X, d:Y} objects (an adjacency list, basically), where if we consider an edge to be from a startVertex to one of its neighboring vertices, then the index of outer list corresponds to startvertex.vid, and each element of the inner list is one of its neighbors along with the distance between them
    //ex) [[{vid:1,d:88},{vid:2,d:72}],[{vid:3,d:64}],...] -> vertex0 has an edge connecting it to vertex1 with cost 88
  //and an edge connecting it to vertex2 with cost 72
  //vertex1 has an edge connecting it to vertex3 with cost 64
    
}


Graph.prototype.pathLength = function(path) { //path is an array of vertexObj's
    var length = 0;
    var V;
    var edgesOfV;
    //get the edge corresponding to next vertexObj of path and add its weight to the length
    var i = 0;
    var j;
    while (i < path.length - 1) { //dont check last node so that avoid out of bounds error
        V = path[i];
        edgesOfV = this.edges[V.vid];
        j = 0;
        while (j < edgesOfV.length) {
            if (edgesOfV[j].vid == path[i+1].vid) {
                length += edgesOfV[j].d;
                break;
            }
            j++;
        }
        i++;
    }
    return length;
}


Graph.prototype.addVertexObj = function(vertexObj) {
  this.vertices[vertexObj.vid] = vertexObj;
  this.edges[vertexObj.vid] = [];
};


//add undirected edge containing v1 and v2 with a distance of dist
//(add directed edge from v1 to v2, and directed edge from v2 to v1)
Graph.prototype.addEdge = function(vertexObj1, vertexObj2, dist) {
    this.edges[vertexObj1.vid].push({vid:vertexObj2.vid, d:dist});
    this.edges[vertexObj2.vid].push({vid:vertexObj1.vid, d:dist});
}


/*
Graph.prototype.removeEdge = function(V1, V2) {
    var edgesOfV1,edgesOfV2;
    //document.writeln("a");
    //document.writeln("V1 is " + V1.label + ", V2 is " + V2.label);

    if (this.edges[V1.vid])  { //if edgelist of vertexObj1 exists
        //document.writeln("e");

        edgesOfV1 = this.edges[V1.vid];
        //document.writeln("f");

        for (var i = 0; i < edgesOfV1.length; i++) {
            //document.writeln("g");

            if (edgesOfV1[i].vid == V2.vid) {
                //document.writeln("h");

                edgesOfV1.splice(i,1);
                //document.writeln("i");

                break;
            }
            //document.writeln("j");

        }
    }
    //document.writeln("b");

    if (this.edges[V2.vid]) {  //if edgelist of vertexObj2 exists
        edgesOfV2 = this.edges[V2.vid];
        for (var i = 0; i < edgesOfV2.length; i++) {
            if (edgesOfV2[i].vid == V1.vid) {
                edgesOfV2.splice(i,1);
                break;
            }
        }
    }
    //document.writeln("c");

}
*/

/*
Graph.prototype.removeNodes = function(nodeList) { //remove the edges of every vertexObj within nodeList, and store them in the form of (vertexObj, vertexObj, <distance between them>) triples within returned list, so they can be put back later
    //document.writeln("hey");
    var tempRemovedEdges = [];
    var Vs, Ve, edgesOfVs;
    for (var k = 0; k < nodeList.length; k++) {
        //document.writeln("yeah");

        Vs = nodeList[k];
        //document.writeln("Vs is " + Vs.label);

        edgesOfVs = this.edges[Vs.vid];
        //document.writeln("edges of " + Vs.label + ": " + JSON.stringify(edgesOfVs));
        //document.writeln("length initial " + edgesOfVs.length);
        
        while (edgesOfVs.length > 0) {
            //document.writeln("length before " + edgesOfVs.length);

            //document.writeln("no");
            //document.writeln("j is " + j);

            Ve = this.vertices[edgesOfVs[0].vid];
            //document.writeln("Ve is " + Ve.label);

            //document.writeln("x");

            tempRemovedEdges.push({v1:Vs, v2:Ve, weight:edgesOfVs.d});
            //document.writeln("y");

            this.removeEdge(Vs,Ve);
            //document.writeln("z");
            //document.writeln("length after " + edgesOfVs.length);


        }
    }

    return tempRemovedEdges;
    
}
*/


/*
Graph.prototype.restoreEdges = function(tempRemovedEdges) {//tempRemovedEdges is a list of (vertexObj, vertexObj, <distance between them>) triples
    var V1, V2, weight;
    for (var i = 0; i < tempRemovedEdges.length; i++) {
        V1 = tempRemovedEdges[i].v1;
        V2 = tempRemovedEdges[i].v2;
        weight = tempRemovedEdges[i].weight;
        this.addEdge(V1, V2, weight);
        
        
        document.writeln("added edge with V1 of " + V1.label + ", V2 of " + V2.label + ", and weight of " + weight);

    }
}
*/


Graph.prototype.nodeInCommon = function(path1, path2) {
    for (var i = 0; i < path1.length; i++) {
        for (var j = 0; j < path2.length; j++) {
            if (path1[i].vid == path2[j].vid) {
                //document.writeln(this.pathToString(path1) + " and " + this.pathToString(path2) + " have " + path1[i].label  + " in common, at least.");
                return true;
            }
        }
    }
    //document.writeln(this.pathToString(path1) + " and " + this.pathToString(path2) + " have no nodes in common");
    return false;
}



Graph.prototype.print = function() {
    var  V1, V2, edgesOfV, edge, edges;
    for (var i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i]) {  //if vertexObj exists
            V1 = this.vertices[i];

            //iterate thru the edges emanating from a vertex
            edgesOfV1 = this.edges[V1.vid];
            edges = "";
            for (j = 0; j < edgesOfV1.length; j++) {
                edge = edgesOfV1[j];
                //get vertex label of endpoint of edge
                V2 = this.vertices[edge.vid];
                edges = edges + V2.label + ",";
            }
            edges = edges.slice(0,edges.length -1); //remove trailing ","
            document.writeln(V1.label + " -> " + edges);
        }
    }
}


Graph.prototype.pathToString = function(path) {
    var s = "";
    for (var i = 0; i < path.length; i++) {
        s = s + " -> " + path[i].label;
    }
    s = s.slice(4);
    return s;
}


Graph.prototype.astar = function(start, end) {
    if(!this.vertices[start.vid]) {
        return document.writeln('Vertex not found');
    }
    
    //edge case, A == B
    if (start.vid == end.vid) {
        document.writeln("start == end. dist is 0");
        return {"path":[start], "d":0};
    }

    var open = [];
    open.push(start);
    var openF = [];  //distances of elements in open. contains (the known distance from start to that node, plus the estimated distance from that node to end node) of vertex with position i within open at position i within openF
    var closed = [];  //"visited"
    var shortestDistsFromA = [];  //ith entry contains shortest distance from vertexStart to the vertex with vid == i
    var distsToB = [];  //ith entry holds the as-the-crow-flies distance from the ith vertex of this.vertices to B
    var estDistAtoB = []; //ith entry holds the f value for vertex with index i within this.vertices
    
    //initialize the shortest distance and the estDistAtoB to every vertex to Infinity
    for (var i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i])  {//if the vertex exists
            shortestDistsFromA[i] = Infinity;
            estDistAtoB[i] = Infinity;
        }
    }
    //but assign 0 as the shortest distance to startVertex
    shortestDistsFromA[start.vid] = 0;
    
    var V;
    //populate distsToB with the h values for each vertex
    for (var i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i])  {//if the vertex exists
            V = this.vertices[i];
            distsToB[i] = Math.sqrt(Math.pow(V.lat - end.lat, 2) + Math.pow(V.long - end.long, 2));
        }
    }

    estDistAtoB[start.vid] = distsToB[start.vid];
    var parents = [];  //ith entry contains vid of parent of vertex whose vid == i
    var gx;  //"g(x)" = distance from startVertex to a given vertex
    var hx; //"h(x)" = estimated distance from given vertex to B
    
    var fx;  //"f(x)" = g(x) + h(x) = estimated distance from A to B (the heuristic of a* search)
    var vertexObj;
    var minDistOfOpenF;
    var Vid;
    var neighborVid;
    var distToNeighbor;
    var visitCounter = 0; //to compare performance with Dijkstra
    //open and openF are designed to always maintain the same indices. index i of vertex V in open has its shortest distance recorded at index i of openF
    while (open.length) {
        //set vertexObj to the vertex in open with shortest known distance from A
        openF = [];
        for(var i = 0; i < open.length; i++) {
            openF[i] = estDistAtoB[open[i].vid];  //populate shortest distances of open list
        }
        
        //assign vertexObj to the vertex in open with shortest distance From A
        minDistOfOpenF = Math.min.apply(null, openF);  //smallest distance in openD
        Vid = estDistAtoB.indexOf(minDistOfOpenF);  //vertex that has this minDist has position Vid in shortestDistsFromA...
        //BUT have to make sure the vertex with this min distance hasnt yet been visited, bc it could could be tied for the min distance with a vertex that has already been visited, and which also occurs earlier in the list, thus always being chosen even though it should never have been chosen again
        while (~indexOfVertex(Vid, closed)) {  //keep calculating a new Vid until arrive at one that has not yet been visited (while its in closed)
            Vid = estDistAtoB.indexOf(minDistOfOpenF, Vid + 1);  //check Vid's starting at position after the current position
        }
        visitCounter++;
        //...and therefore the same position within this.vertices
        vertexObj = this.vertices[Vid];
        closed.push(vertexObj);
        open.splice(indexOfVertex(vertexObj.vid, open), 1); //remove from open
        //remove it from openF as well
        openF.splice(indexOfVertex(vertexObj.vid, open), 1);

        for(var i = 0; i < this.edges[vertexObj.vid].length; i++) {
            //if neighbor is unvisited
            neighborVid = this.edges[vertexObj.vid][i].vid;
            neighborV = this.vertices[neighborVid];

            distToNeighbor = this.edges[vertexObj.vid][i].d;
            if (!~indexOfVertex(neighborVid,closed)) {  //if neighbor has not yet been visited

                //make sure its not already in open before adding it
                if (!~indexOfVertex(neighborVid,open)) {
                    open.push(neighborV);
                }
                

                gx = shortestDistsFromA[vertexObj.vid] + distToNeighbor;
                //if gx is less than current shortest dist, then update gx and parent
                if (gx < shortestDistsFromA[neighborVid]) {
                    //update shortest distance from A to that neighbor
                    shortestDistsFromA[neighborVid] = gx;
                    //and update the neighbor's parent
                    parents[neighborVid] = vertexObj.vid;
                    hx = distsToB[neighborVid];
                    fx = gx + hx;
                    estDistAtoB[neighborVid] = fx;
                }
                
                if (neighborVid == end.vid) {
                    //have found B, so can stop searching and return this path (its length is given by gx
                    //obtain shortest path from A to B
                    vertexObj = end;
                    path = [vertexObj];
                    while (parents[vertexObj.vid] != start.vid) {
                        parent = this.vertices[parents[vertexObj.vid]];
                        path.unshift(parent); //add parent vertexObj to head of path
                        vertexObj = this.vertices[parents[vertexObj.vid]];
                    }
                    //dont forget to add A at the end
                    parent = this.vertices[parents[vertexObj.vid]];
                    path.unshift(parent);
                    //actually, need to return both the path itself as well as its length, so return an object
                    return {"path":path, "d":gx};
                }
            }
        }
    }
}


//generate a midline thru the point X/Yth of the way to B from A
Graph.prototype.plotRandomPoint = function(A, B) {
    var rise = B.lat - A.lat;  //sign doesnt matter, because will take its absolute value later
    var run = B.long - A.long;
    //remember to handle edge case where A and B have same longitude (avoid divide by 0)
    var origPos = rise/run > 0; //has value of true if slope is positive
    var Y = getRandomInteger(2,7); //denominator of midpoint can be from 2 to 7
    var X = getRandomInteger(1,Y-1); //numerator of midpoint can be from 1 to Y-1
    //plot midPoint X/Yth of the way to B from A
    var midPoint = {"lat":A.lat + (rise * X / Y), "long":A.long + (run * X / Y)};
    var invRise = Math.abs(run);  //origPos will handle whether to add or subtract it
    var invRun = Math.abs(rise);
    var Z = getRandomInteger(0,1); //which direction along midline from midpoint that the node will be fitted. if 0, then plot to the right. if 1, then plot to the left.
    var W = getRandomInteger(2,5); //cut the left or right half (based on Z) into 2 to 5 pieces
    var U = getRandomInteger(1,W-1); //which of those pieces to plot the random point at
    if (origPos) {
        if (Z == 0) { //then plot point to right of midpoint
            return {"lat":midPoint.lat - ((invRise / 2) * (U / W)), "long":midPoint.long + ((invRun / 2) * (U / W))};
        }
        else { //plot it to left
            return {"lat":midPoint.lat + ((invRise/ 2)  * (U / W)), "long":midPoint.long - ((invRun / 2) * (U / W))};
        }
        
    } else {
        if (Z == 0) { //then plot point to right of midpoint
            return {"lat":midPoint.lat + ((invRise/ 2)  * (U / W)), "long":midPoint.long + ((invRun / 2) * (U / W))};
        }
        
        else { //plot it to left
            return {"lat":midPoint.lat - ((invRise/ 2)  * (U / W)), "long":midPoint.long - ((invRun / 2) * (U / W))};
        }
    }
}

//generate random path from start to end thru node. keeps generating random point until can draw a short enough path thru it
Graph.prototype.generateRandomPath = function(start, end, lap) {
    var point, points, node, path;
    path = [];
    var i = 0;
    while (path.length == 0 && i < 100) { //until short enough, keep trying to plot a point and form shortest path thru it
        //document.writeln("wasnt short enough. trying again");
        point = this.plotRandomPoint(start, end); //point is {lat, long} object
        points = [point];
        document.writeln(JSON.stringify(points));
        nodes = this.fitNodesToMidline(points);
        path = this.pathThruNode(start, end, nodes[0], lap); //nodes will always contain a single element
        i++;
    }
    if (i==100) {
        document.writeln("failed to form short enough path");
        return [];
    }
    return path;
    
}


//populate the midline between A and B with
Graph.prototype.populateMidline = function(A, B) {
    var rise = B.lat - A.lat;  //sign doesnt matter, because will take its absolute value later
    var run = B.long - A.long;
    //remember to handle edge case where A and B have same longitude (avoid divide by 0)
    var origPos = rise/run > 0; //has value of true if slope is positive
    //get midpoint by traveling half of the slope from A
    var midPoint = {"lat":A.lat + (rise/2), "long":A.long + (run/2)};
    var invRise = Math.abs(run);  //the algorithm is handling whether to add or subtract it
    var invRun = Math.abs(rise);
    var i;
    var points = [];
    //left and right are taken from the perspective of A facing B
    //each initialized as midpoint and incremented X times each in opposite directions
    var mpR = {"lat":midPoint.lat, "long":midPoint.long};  //point within right half of solution space
    var mpL = {"lat":midPoint.lat, "long":midPoint.long};  //point within left half of solution space
    //initialize points with the midpoint itself
    points.push(midPoint);
    var X = 5; //the number of points to gather on each side of the midpoint. results in a midline of 2X + 1 vertices
    
    if (origPos) { //line from A to B had positive slope, so midline has negative slope
        i = 0;
        while (i < X) { //plot points to the right of midline
            mpR.long = mpR.long + ((invRun / 2) / X);
            mpR.lat = mpR.lat - ((invRise / 2) / X);
            var p = {"lat":mpR.lat, "long":mpR.long};
            points.push(p);
            i++;
        }
        i = 0;
        while (i < X) { //plot points to the left of midline
            mpL.long = mpL.long - ((invRun / 2) / X);
            mpL.lat = mpL.lat + ((invRise/ 2) / X);
            var p = {"lat":mpL.lat, "long":mpL.long};
            points.unshift(p);
            i++;
        }
    } else { //line from A to B had negative slope, so midline has positive slope
        i = 0;
        while (i < X) { //plot points to the right of midline
            mpR.long = mpR.long + ((invRun / 2) / X);
            mpR.lat = mpR.lat + ((invRise/ 2) / X);
            var p = {"lat":mpR.lat, "long":mpR.long};
            points.push(p);
            i++;
        }
        i = 0;
        while (i < X) { //plot points to the left of midline
            mpL.long = mpL.long - ((invRun / 2) / X);
            mpL.lat = mpL.lat - ((invRise/ 2) / X);
            var p = {"lat":mpL.lat, "long":mpL.long};
            points.unshift(p);
            i++;
        }
    }
    
    return points;
}


Graph.prototype.fitNodesToMidline = function(points) { //fits every point in points to a vertexObj
    //bc every vertex in vertices calculates a diff with every single point, resulting in ((2X + 1) * vertices.length * numOfInstructionsPerDiff) instructions, where X is the number of points plotted on each side of the midpoint
    smallestDiffs = [];  //consists of 11 diffObj's (if X == 5) at positions 0 thru 10, corresponding to points 0 thru 10 (points 0 thru 4 are Left half, 5 is midPoint, and 6-10 are righthalf)
    //these objects are of the form {vid:X,diff:Y} to denote which vertex so far has the smallest difference, and what that difference is.
    //jth entry corresponds to jth point within points
    //initialize smallestDiff
    for (var i = 0; i < points.length; i++) {
        var value = {"vid":0, "diff": -1};
        smallestDiffs[i] = value;
    }
    
    var V;
    var diff;  //sum of differences in latitude and longitude between V and a point in points
    var diffObj;
    for (var i = 0; i < this.vertices.length; i++) {
        for (var j = 0; j < points.length; j++) {
            V = this.vertices[i];
            if (V) {
                // should be sum of absolute values of differences
                diff = Math.abs(V.lat - points[j].lat) + Math.abs(V.long - points[j].long);
                diffObj = smallestDiffs[j];
                if (diffObj.diff == -1) {  //if hasn't been assigned anything yet
                    //then update its diff unconditionally
                    diffObj.vid = V.vid;
                    diffObj.diff = diff;
                    smallestDiffs[j] = diffObj;
                }
                else if (diff < diffObj.diff) {
                    //update entry of smallestDiffs
                    diffObj.vid = V.vid;
                    diffObj.diff = diff;
                    smallestDiffs[j] = diffObj;
                }
            }
        }
    }
    
    //once you fit a vertex to a point, you must remove that vertex from future consideration
    //at this point, smallestDiffs has diffObj with vid of the vertex best fit to that point
    bestFitNodes = [];  //ith entry contains the vertex best fit to point i of points
    for (var i = 0; i < points.length; i++) {
        V = this.vertices[smallestDiffs[i].vid];
        if (!(~indexOfVertex(V.vid, bestFitNodes)))     //in case same vertex best-fits to same point
            bestFitNodes.push(V);
    }
    
    return bestFitNodes;
}


//lap is longestAllowedPath
Graph.prototype.generateInitialPopulation = function(A, B, bestFitNodes, lap) {

    var pathPopulation = [] //holds the paths thru each of the midNodes (it is a list of lists)
    for(var i = 0; i < bestFitNodes.length; i++) {
        var midNode = bestFitNodes[i];
        var pathD1 = this.astar(A, midNode);
        var pathD2 = this.astar(midNode, B);

        //check if path has repeated nodes (not including midNode, of course)
        //and
        //check if this individual is short enough to be member of initial population
        if (pathD1.d + pathD2.d < lap && !this.nodeInCommon(pathD1.path,pathD2.path.slice(1))) {
            //remove midNode (element 0) from pathD2 so that upcoming list concatenation does not contain it twice
            pathD2.path.shift();
            var pathThruMidNode = (pathD1.path).concat(pathD2.path); //shortest path from A to B that crosses through midNode
            pathPopulation.push(pathThruMidNode);
        }
    }
    /*
    document.writeln("path population is:");
    for(var i = 0; i < pathPopulation.length; i++) {
        document.writeln(this.pathToString(pathPopulation[i]));
    }
     */

    return pathPopulation;
}


Graph.prototype.pathThruNode = function(A, B, node, lap) {
    var pathD1 = this.astar(A, node);
    var pathD2 = this.astar(node, B);
    var path = [];
    //check if this individual is short enough to be member of initial population
    if (pathD1.d + pathD2.d < lap) {
        //remove midNode (element 0) from pathD2 so that upcoming list concatenation does not contain it twice
        pathD2.path.shift();
        var path = (pathD1.path).concat(pathD2.path); //shortest path from A to B that crosses through midNode
        return path;
    }
    else {
        return path; //will return empty list. check if its empty in calling function to determine if was able to construct short enough path thru it without backtracking
    }
}


Graph.prototype.elevGainOf = function(path) {  //path is of vertexObj’s
    var gain = 0;
    for (var i = 0; i < path.length - 1; i++) {
        elevDiff = path[i+1].elev - path[i].elev;
        if (elevDiff > 0) {
            gain = gain + elevDiff;
        }
    }
    return gain;
}


Graph.prototype.getElevGains = function(population) {
    var elevationGains = []; //each entry is a (path, gain) ordered pair
    var gain;
    for (var i = 0; i < population.length; i++) {
        gain = this.elevGainOf(population[i]);  //get gain of ith path
        elevationGains.push({path:population[i], g:gain});
    }

    return elevationGains; //each entry is a (path, gain) ordered pair
}


Graph.prototype.replicate = function(sortedElevationGains) {
    var rankSpace = [];        //roulette wheel
    //construct the roulette wheel
    for (var i = 1; i <= sortedElevationGains.length; i++) {
        for (var r = 1; r <= i; r++) {
            rankSpace.push(i);
        }
    }
    // rankSpace is now [1, 2, 2, 3, 3, 3, …]
    

    var parentList = []; //the parents to undergo crossover, who are more likely to get added the higher their rank is
    //spin roulette wheel a number of times equal to the number of paths in the population
    for (var i = 0; i < sortedElevationGains.length; i++) {
        rank = rankSpace[getRandomInteger(0, rankSpace.length - 1)];
        //add that path to parentList
        parentList.push(sortedElevationGains[rank - 1]); //(path of rank i is located at index (i-1)
    }
    
    for (var i = 0; i < parentList.length; i++) {
        document.writeln(this.pathToString(parentList[i].path));
    }
     
    return parentList; //list of (path, gain) ordered pairs not in sorted order
}



//list of (path, gain) pairs -> list of (path, path) pairs
Graph.prototype.formPairs = function(parentList) {
    var pairs = [];  //list of (parent1, parent2) “tuples”    //because of odd numbers, these objects will not be entirely unique; at least one of them will have a field in common with another of them
    var index;
    var parent1;
    var parent2;
    
    while (parentList.length >= 2) {
        //generate random number from 0 to parentList.length -1
        index = getRandomInteger(0, parentList.length-1);
        parent1 = parentList[index].path;
        parentList.splice(index, 1); //remove this (parent,gain) pair from the list. they’re “taken”

        index = getRandomInteger(0, parentList.length-1);
        parent2 = parentList[index].path;
        parentList.splice(index, 1); //remove this (parent,gain) pair from the list. they’re “taken”
    
        //pair them together
        pairs.push({p1:parent1, p2:parent2});
    
        if (parentList.length == 1) {
            var otherIndex = getRandomInteger(0, pairs.length-1);
            var other = pairs[otherIndex].p1;   //arbitrarily choose parent 1 of random pair
            pairs.push({p1:parentList[0].path, p2:other});    //make pair containing last remaining path in parentList
        }
     }
    
     /*
     document.writeln("in formPairs: pairs is:");
    
     for (var i = 0; i < pairs.length; i++) {
         document.writeln(this.pathToString(pairs[i].p1));
         document.writeln(this.pathToString(pairs[i].p2));
         document.writeln("");
     }
     */
                       
     return pairs;
}


Graph.prototype.firstDiff = function(p,q) {
    var i = 0;
    
    while (i < p.length && i < q.length) {
        if (p[i].vid == q[i].vid) {
            i++;
        }
        else
            break;
    }

    return i;
}


//there will be two separate indices in this case bc of diff path lengths. return an ordered pair
Graph.prototype.lastDiffs = function(p,q) {
    var i = p.length - 1; //tracks end of p
    var j = q.length -1; //tracks end of q
    while (i >= 0 && j >= 0) {
        if (p[i].vid == q[j].vid) {
            i--;
            j--;
        }
        else
            break;
    }
    var pointsOfld = {ldP:i,ldQ:j};

    return pointsOfld;
}


//within the bounds at which the paths differ (their "infixes", as opposed to common prefixes or suffixes), obtain positions on p and q that we will later connect together to form a new child path
Graph.prototype.getCrossoverPoints = function(path1, path2, A, B) {
    var fd = this.firstDiff(path1,path2);
    var lds = this.lastDiffs(path1,path2);

    //if the paths are identical or if we fail to a form crossover point between them (either due to t being too far away from B, or s_to_t containing nodes in common with either A_to_s or t_to_B), the outcome is the same (just generate themselves as children). here, we know its due to being identical
    if (fd == path1.length && (lds.ldP == -1 || lds.ldQ == -1)) { //if paths are identical
        //document.writeln("paths are identical. wont try to perform crossover");
        return {"sPos":-1, "tPos":-1};
    }

    //choose s on infix of path1
    document.writeln("infix of path1 is " + this.pathToString(path1.slice(fd, lds.ldP + 1)));
    document.writeln("infix of path2 is " + this.pathToString(path2.slice(fd, lds.ldQ + 1)));
    
    var sPos = getRandomInteger(fd, lds.ldP);   //crossover point on path1
    var s = path1[sPos];    //crossover node on p
    //choose t on infix of path2
    var tPos = getRandomInteger(fd, lds.ldQ);   //crossover point on path2
    var t = path2[tPos];    //crossover node on path2
    var k = 1;

    //ensure distance from t to B is less than distance from s to B
    var x = Math.sqrt(Math.abs(B.lat - t.lat) + Math.abs(B.long - t.long));
    var y = Math.sqrt(Math.abs(B.lat - s.lat) + Math.abs(B.long - s.long));
    
    //arbitrarily decide to try up to 7 times to form valid crossover points
    while (x > y && k < 7) {    //while t is further from B than s is from B
        //try again with new crossover points
        k++;
        //document.writeln("t is in wrong direction; generating crossover points for the " + k + "th time");
        //recalculate s and t
        sPos = getRandomInteger(fd, lds.ldP);
        s = path1[sPos];
        tPos = getRandomInteger(fd, lds.ldQ);
        t = path2[tPos];
        x = Math.sqrt(Math.abs(B.lat - t.lat) + Math.abs(B.long - t.long));
        y = Math.sqrt(Math.abs(B.lat - s.lat) + Math.abs(B.long - s.long));
    }
    
    if (x > y && k == 7) {   //if we fail to form crossover points between path1 and path2
        return {"sPos":-1, "tPos":-1};
    }

    return {"sPos":sPos, "tPos":tPos};
}


Graph.prototype.generateChild = function(path1, path2, lap, A, B) {
    var i, crosspoints, s_to_t, path_s_to_t, dist_s_to_t, path_A_to_s, dist_A_to_s, path_t_to_B, dist_t_to_B, totalDist, cond;

    for(i = 0; i < 7; i++) { //arbitrarily try up to 7 times to generate a short enough child
        crosspoints = this.getCrossoverPoints(path1, path2, A, B);
        
        if (crosspoints.sPos == -1 && crosspoints.tPos == -1) {
            //document.writeln("t was never close enough to B, or they were identical. failed to cross over");
            return path1;  //could not form crossover at all, so return path1 as child
        }
        

        //form new path, child = (portion of path 1 from A to s) + (s to t) + (portion of path 2 from t to B)
        path_A_to_s = path1.slice(0,crosspoints.sPos+1);  //list of nodes from A up to and including s
        dist_A_to_s = this.pathLength(path_A_to_s);

        path_t_to_B = path2.slice(crosspoints.tPos); //list of nodes from t to B
        dist_t_to_B = this.pathLength(path_t_to_B);

        //calculate shortest path from s to t.
        var s = path_A_to_s[path_A_to_s.length-1];
        var t = path_t_to_B[0];

        s_to_t = this.astar(path1[crosspoints.sPos], path2[crosspoints.tPos]);
        path_s_to_t = s_to_t.path;
        dist_s_to_t = s_to_t.d;
        
        //don't include s and t, of course (and do include the edge case where they are equal)
        if (s.vid == t.vid || this.nodeInCommon(path_s_to_t.slice(1), path_A_to_s) || this.nodeInCommon(path_s_to_t, path_t_to_B.slice(1))) {
            document.writeln("had nodes in common, so trying again");
            continue; //try new crosspoints
        }
        
        totalDist = dist_A_to_s + dist_s_to_t + dist_t_to_B;
        CURRENT_BEST_PL = totalDist;
        if (totalDist <= lap) { //if the child is shorter than the longest allowed path
            //remove s duplicate
            path_A_to_s = path_A_to_s.slice(0,path_A_to_s.length - 1);
            //remove t duplicate
            path_t_to_B = path_t_to_B.slice(1);
            document.writeln("crossed over at s = " + path1[crosspoints.sPos].label + " and t = " + path2[crosspoints.tPos].label);
    

            return path_A_to_s.concat(path_s_to_t, path_t_to_B);
        }
        document.writeln("total dist is " + totalDist + ", so trying again");
    }
    document.writeln("child not short enough. failed to cross over");
    document.writeln("");
    document.writeln("");
    document.writeln("");

    return path1;     //could not form short enough child after 3 tries, so return path1 as child
}


//handle the case where they are the same path, due to ranking algorithm generating repeats
//returns an array of 2 paths (child 1 and child 2)
//dont actually need to pass it A and B because each path starts with A and ends with B
Graph.prototype.crossover = function(p, q, lap, start, end) {
    var children = [];
    document.writeln("");
    document.writeln("generating first child");
    var child1 = this.generateChild(p,q,lap,start,end);
    children.push(child1);
    document.writeln("");
    document.writeln("");
    document.writeln("generating second child");
    var child2 = this.generateChild(q,p,lap,start,end);
    children.push(child2);
    document.writeln("");
    document.writeln("parent 1: " + this.pathToString(p));
    document.writeln("parent 2: " + this.pathToString(q));
    document.writeln("");
    document.writeln("child  1: " + this.pathToString(child1));
    document.writeln("child  2: " + this.pathToString(child2));
    
    return children;
}

//maxOrMin == true, then maximize elevation gain. maxOrMin == false, then minimize elevation gain
Graph.prototype.evolvePopulation = function(population, longestAllowedPath, start, end, maxOrMin) {
    var parentList, pairs, parentPop, childPop, parentGains,childGains, parentAndChildGains, localOptimum, bestG;
    parentPop = population;     //parentPop is list of paths
    //get gains of each path in parentPop
    parentGains = this.getElevGains(parentPop);   //parentGains is list of (path, gain) ordered pairs
    if (maxOrMin) { //maximize elevation gain
        parentGains = parentGains.sort(function(P, Q) { return P.g - Q.g;
                                                   }); //index i holds path with rank (i+1) (ranks are 1-based, index is 0-based)
    }
    else { //minimize elevation gain
        parentGains = parentGains.sort(function(P, Q) { return Q.g - P.g;
                                       }); //index i holds path with rank (i+1) (ranks are 1-based, index is 0-based)
    }
    
    //from this point on, parentGains is always sorted by elevation gain
    //arbitrarily decide to do 20 rounds
    for (var i = 0; i < 20; i++) {
        //replicate each parent proportional to its rank
        parentList = this.replicate(parentGains);    //list of paths that will generate next set of children
        pairs = this.formPairs(parentList);     //list of (parent1, parent2) “ordered pairs”
        childPop = [];  //(re)initialize childPop
        //perform a crossover on each pair of parents
        for (var j = 0; j < pairs.length; j++) {
            document.writeln("");
            document.writeln("");
            document.writeln("crossover of round i=" + i + ", iter j=" + j);
            
            children = this.crossover(pairs[j].p1, pairs[j].p2, longestAllowedPath, start, end);   //each parent will have 2 children
            childPop = childPop.concat(children);  //which each get added to the child population
        }
        
        childGains = this.getElevGains(childPop);
        //create list of gains of parents and children combined
        parentAndChildGains = parentGains.concat(childGains);
        //no longer sorted by gain, so sort it again
        if (maxOrMin) {
            parentAndChildGains = parentAndChildGains.sort(function(P, Q) {
                                               return P.g - Q.g;
                                               });
        }
        else { //minimize elevation gain
            parentAndChildGains = parentAndChildGains.sort(function(P, Q) {
                                               return Q.g - P.g;
                                               });
        }
        
        //“kill off the bottom 50th percentile” -> keep the top half of the list only and assign it as the new parentPop (length of total is always even because doubled parentPop to create it. so don’t need to cover the odd length case.
        //assign this upper half as the new parentGains for the new parentPop (what will serve as parentPop in the next round)
        parentGains = []; //clear parentGains
        //next generation of parents
        parentGains = parentAndChildGains.slice(parentAndChildGains.length / 2);  //new parentGains contains paths derived from both previous parentGains and new childGains
        var optimum = parentGains[parentGains.length - 1];
        localOptimum = parentGains[parentGains.length - 1].path;
        bestG = parentGains[parentGains.length - 1].g;

        document.writeln("round " + i + " produced a local of optimum of " + bestG);
        //move to next round
        CURRENT_BEST = bestG;
    }
    
    return optimum;
    
}


function evolver(vertices, edges, start, end, maxOrMin, xPercent) {
    var graphx = new Graph();
    graphx.edges = edges;
    graphx.vertices = vertices;
    
    var points = graphx.populateMidline(start,end);
    var bfn = graphx.fitNodesToMidline(points);
    var shortestPathDist = graphx.astar(start,end);
    var shortestDist = shortestPathDist.d;
    var longestAllowedPath = shortestDist * (xPercent / 100);
    LONGEST_PATH = longestAllowedPath;
    var pop = graphx.generateInitialPopulation(start,end,bfn, longestAllowedPath);

    var o = graphx.evolvePopulation(pop, longestAllowedPath, start, end, maxOrMin);
    SHORTEST_PATH_EL = graphx.elevGainOf(shortestPathDist.path);
    document.writeln("compared to gain of shortest path, which is " + graphx.elevGainOf(shortestPathDist.path));
    document.writeln("and has a path of " + graphx.pathToString(graphx.astar(start,end).path));
    document.writeln("and ");
    var rpath = graphx.generateRandomPath(start,end,longestAllowedPath);
    document.writeln("compared to gain of random path, which is " + graphx.elevGainOf(rpath));
    document.writeln("and has a path of " + graphx.pathToString(rpath));
    
    
}














Graph.prototype.traverseBFS = function(startVertex) {
    if(!this.vertices[startVertex.vid]) {
        return document.writeln('Vertex not found');
    }
    var queue = [];
    var visitSequence = "";
    var visitList = [];
    queue.push(startVertex);
    visitList.push(startVertex);
    visitSequence = visitSequence + startVertex.label + "->";
    var visNum = 1;
    var visited = [];  //a vertex with vid == X occupies the Xth position of visited if it has been visited (the Xth position is undefined otherwise)
    visited[startVertex.vid] = true;  //initialize with startVertex
    //visited DOES NOT hold the vertex itself
    
    while(queue.length) {
        var vertexObj = queue.shift(); //get head of queue
        //fn(vertexObj);
        var edgesOfV = this.edges[vertexObj.vid];
        
        for(var i = 0; i < edgesOfV.length; i++) {  //for each neighbor of <vertex>
            //if(!visited[this.edges[vertexObj.vid][i].vid]) {  //if the neighbor hasn't been visited
            if(!visited[edgesOfV[i].vid]) {  //if the neighbor hasn't been visited

                //check if vid (of the ith object in vertexObj's list of edges) is in visited
                visited[edgesOfV[i].vid] = true;
                var neighbor = this.vertices[edgesOfV[i].vid];
                //visited[this.edges[vertexObj.vid][i].vid] = true;  //then visit it
                visitSequence = visitSequence + neighbor.label + "->";
                visNum++;
                queue.push(neighbor);  //and put it in line of vertices waiting to do their own bfs
                visitList.push(neighbor);
            }
        }
    }
    var v = visitSequence.slice(0,visitSequence.length-2);
    document.writeln(v);
    document.writeln("num visited is " +  visNum);
    return visitList;
    
}


//can reach endVertex from startVertex
Graph.prototype.canReach = function(startVertex, endVertex) {
    var vl = this.traverseBFS(startVertex); //visited list
    if (!~indexOfVertex(endVertex.vid, vl)) //if returns -1 (if endVertex not in visited list)
        return false;
    return true;
}
