//removed vertex labels

function vertexObj(vid, lat, long, elev/*, label*/) {
    this.vid = vid;
    this.lat = lat;
    this.long = long;
    this.elev = elev;
    //this.label = label;
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
    //document.writeln("path length of " + this.pathToString(path) + " is:");
    //document.writeln("->" + length);
    return length;
}




Graph.prototype.addVertexObj = function(vertexObj) {
  this.vertices[vertexObj.vid] = vertexObj;
  this.edges[vertexObj.vid] = [];
};





//add undirected edge containing v1 and v2 with a distance of dist
//(add directed edge from v1 to v2, and directed edge from v2 to v1)
Graph.prototype.addEdge = function(vertexObj1, vertexObj2, dist) {
  //this.edges[vertexObj1.vid].push({vid:vertexObj2.vid, d:dist});
    //var v1 = new vertexObj(1, 0, 0, 0);
    this.edges[vertexObj1.vid].push({vid:vertexObj2.vid, d:dist});
    this.edges[vertexObj2.vid].push({vid:vertexObj1.vid, d:dist});
}


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


/*
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


Graph.prototype.printPath = function(path) {
    var s = "";
    for (var i = 0; i < path.length; i++) { //ith vertex of ith child path
        s = s + " -> " + path[i].label;
    }
    s = s.slice(4);
    document.writeln(s);
}

*/

/*
Graph.prototype.pathToString = function(path) {
    var s = "";
    for (var i = 0; i < path.length; i++) {
        s = s + " -> " + path[i].label;
    }
    s = s.slice(4);
    return s;
}
*/
/*
//for bestFitNodes, etc.
Graph.prototype.nodeListToString = function(nodeList) {
    var s = "";
    for (var i = 0; i < nodeList.length; i++) {
        s = s + ", " + nodeList[i].label;
    }
    s = s.slice(2);
    return s;
}

*/

Graph.prototype.dijkstra = function(A, B) {
    if(!this.vertices[A.vid]) {
        return {"path":[], "d":0};
    }
    
    //changing open and closed to have their indices correspond to the vid's of the vertexObj's in this.vertices
    
    //edge case, A == B
    if (A.vid == B.vid) {
        document.writeln("A == B. dist is 0");
        return {"path":[A], "d":0};
    }
    
    var open = [];  //"unvisited" (contains true at index i to signify that vertex with vid == i has not yet been visited)
    var closed = [];  //"visited" (contains true at index i to signify that vertex with vid == i has not already been visited)
    var unvisited = []  //list of actual vertexObj's
    var shortestDistsFromA = [];  //ith entry contains shortest distance from vertexStart to the vertex with vid == i
    //initialize the shortest distance to every vertex to Infinity
    for (var i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i])  {//if the vertex exists
            shortestDistsFromA[i] = Infinity;
        }
    }
    //but assign 0 as the shortest distance to startVertex
    shortestDistsFromA[A.vid] = 0;
    
    var parents = [];  //ith entry contains vid of parent of vertex whose vid == i
    open.push(A);
    var gx;  //"g(x)" = distance from startVertex to a given vertex
    var vertexObj;
    var openD = [];  //distances of elements in open. contains shortest distance of vertex with position i within open at position i within openD
    
    //open and openD are designed to always maintain the same indices. index i of vertex V in open has its shortest distance recorded at index i of openD
    var visitCounter = 0;
    //var j = 0;
    ///
    ///remove j < 100 when test on OSM data///
    ///
    //while (open.length && j < 100) {

    while (open.length) {
        //set vertexObj to the vertex in open with shortest known distance from A
        openD = [];
        for(var i = 0; i < open.length; i++) {
            openD[i] = shortestDistsFromA[open[i].vid];  //populate shortest distances of open list
        }
        
        
        //assign vertexObj to the vertex in open with shortest distance From A
        
        var minDistOfOpenD = Math.min.apply(null, openD);  //smallest distance in openD
        var Vid = shortestDistsFromA.indexOf(minDistOfOpenD);  //vertex that has this minDist has position Vid in shortestDistsFromA...
        //but have to make sure the vertex with this min distance hasnt yet been visited, bc it could could be tied for the min distance with a vertex that has already been visited, and which also occurs earlier in the list, thus always being chosen even though it should never have been chosen again
        
        while (~indexOfVertex(Vid, closed)) {  //keep calculating a new Vid until arrive at one that has not yet been visited (while its in closed)
            Vid = shortestDistsFromA.indexOf(minDistOfOpenD, Vid + 1);  //check Vid's starting at position after the current position
        }

        //...and therefore the same position within this.vertices
        vertexObj = this.vertices[Vid];
        visitCounter++;
        closed.push(vertexObj);
        open.splice(indexOfVertex(vertexObj.vid, open), 1); //remove from open
        //remove it from openD as well
        openD.splice(indexOfVertex(vertexObj.vid, open), 1);
        
        for(var i = 0; i < this.edges[vertexObj.vid].length; i++) {
            //if neighbor is unvisited
            var neighborVid = this.edges[vertexObj.vid][i].vid;
            var distToNeighbor = this.edges[vertexObj.vid][i].d;

            if (!~indexOfVertex(neighborVid,closed)) {  //if neighbor has not yet been visited
                neighborV = this.vertices[neighborVid];
                //make sure its not already in open before adding it
                if (!~indexOfVertex(neighborVid,open)) {
                  open.push(neighborV);
                }
                gx = shortestDistsFromA[vertexObj.vid] + distToNeighbor;
                if (gx < shortestDistsFromA[neighborVid]) {
                    //update shortest distance from A to that neighbor
                    shortestDistsFromA[neighborVid] = gx;

                    //and update the neighbor's parent
                    parents[neighborVid] = vertexObj.vid;
                }
            } //if vertex not in closed
        }
        //j++;
    }
    
    //obtain shortest path from A to B
    vertexObj = B;
    var dist = shortestDistsFromA[vertexObj.vid];
    path = [vertexObj];

    while (parents[vertexObj.vid] != A.vid) {
        parent = this.vertices[parents[vertexObj.vid]];
        path.unshift(parent); //add parent vertexObj to head of path
        vertexObj = this.vertices[parents[vertexObj.vid]];
    }

    //dont forget to add A at the end
    parent = this.vertices[parents[vertexObj.vid]];
    path.unshift(parent);
    var dist = shortestDistsFromA[B.vid];
    //actually, need to return both the path itself as well as its length, so return an object
    //document.writeln("shortest distance from " + A.label + " to " + B.label + ": " + dist);

    return {"path":path, "d":dist};  //returns object containing list of vertexObj's and its length
 
}


 

<<<<<<< HEAD


Graph.prototype.astar = function(start, end) {
    if(!this.vertices[start.vid]) {
        return document.writeln('Vertex not found');
    }
    
    //changing open and closed to have their indices correspond to the vid's of the vertexObj's in this.vertices
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
    //NOTE: given our program will be operating on many vertex graphs, it might be cheaper to calculate hx as we go, instead of all at once in the beginning.
    for (var i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i])  {//if the vertex exists
            V = this.vertices[i];
            distsToB[i] = Math.sqrt(Math.pow(V.lat - end.lat, 2) + Math.pow(V.long - end.long, 2));
        }
    }
    
    
    //is THIS the problem. should be a-t-c-f dist from start to end, not 0 (dist from start to start = 0, and dist from start to end = diststarttoend)
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
        
        closed.push(vertexObj);  //???does it matter if close it here instead of after calculating fx for each of its neighbors???
        open.splice(indexOfVertex(vertexObj.vid, open), 1); //remove from open
        //remove it from openF as well
        openF.splice(indexOfVertex(vertexObj.vid, open), 1);
        
        //ISNT VISITING ITS LAST NEIGHBOR
        for(var i = 0; i < this.edges[vertexObj.vid].length; i++) {
            //if neighbor is unvisited
            neighborVid = this.edges[vertexObj.vid][i].vid;
            neighborV = this.vertices[neighborVid];
            
            distToNeighbor = this.edges[vertexObj.vid][i].d;
            if (!~indexOfVertex(neighborVid,closed)) {  //if neighbor has not yet been visited
                
                //make sure its not already in open before adding it
                //??i have the feeling i can avoid performing this check. eh, maybe not??
                if (!~indexOfVertex(neighborVid,open)) {
                    open.push(neighborV);
                }
                
                
                gx = shortestDistsFromA[vertexObj.vid] + distToNeighbor;
                //??check if both gx and fx are less than current values??
                //if gx is less than current shortest dist, then update gx and parent
                if (gx < shortestDistsFromA[neighborVid]) {
                    //update shortest distance from A to that neighbor
                    shortestDistsFromA[neighborVid] = gx;
                    
                    //and update the neighbor's parent
                    parents[neighborVid] = vertexObj.vid;
                    
                    //??if gx didnt decrease, then fx wont increase either, bc hx is constant. so only need to update fx from within this if-block?? and dont need to check again if it decreased, just go ahead and update it??
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





=======
>>>>>>> 72f8afa04bf0678162954dbc9b040f327a772b82
//don't worry, i'll fix the lack of modularity
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
    var X = 7; //the number of points to gather on each side of the midpoint. results in a midline of 2X + 1 vertices

    if (origPos) {
        i = 0;
        while (i < X) {
            mpR.long = mpR.long + ((invRun / 2) / X);
            mpR.lat = mpR.lat - ((invRise / 2) / X);
            var p = {"lat":mpR.lat, "long":mpR.long};

            points.push(p);
            i++;
        }
        i = 0;
        while (i < X) {
            mpL.long = mpL.long - ((invRun / 2) / X);
            mpL.lat = mpL.lat + ((invRise/ 2) / X);
            var p = {"lat":mpL.lat, "long":mpL.long};
            
            points.unshift(p);
            i++;
        }
        
    } else {
        i = 0;
        while (i < X) {
            mpR.long = mpR.long + ((invRun / 2) / X);
            mpR.lat = mpR.lat + ((invRise/ 2) / X);
            var p = {"lat":mpR.lat, "long":mpR.long};
            points.push(p);
            i++;
        }
        
        i = 0;
        while (i < X) {
            mpL.long = mpL.long - ((invRun / 2) / X);
            mpL.lat = mpL.lat - ((invRise/ 2) / X);
            var p = {"lat":mpL.lat, "long":mpL.long};

            points.unshift(p);
            i++;
        }
    }
 
    //naive best-fitter algorithm:
    //bc every vertex in vertices calculates a diff with every single point, resulting in ((2X + 1) * vertices.length * numOfInstructionsPerDiff) instructions
    smallestDiffs = [];  //consists of 11 diffObj's (if X == 5) at positions 0 thru 10, corresponding to points 0 thru 10 (points 0 thru 4 are Left half, 5 is midPoint, and 6-10 are righthalf)
    //these objects are of the form {vid:X,diff:Y} to denote which vertex so far has the smallest difference, and what that difference is.
    //jth entry corresponds to jth point within points
    //initialize smallestDiff
    for (var i = 0; i < 2 * X + 1; i++) {
        //??which vid to initialize it to??
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
    for (var i = 0; i < 2 * X + 1; i++) {
        V = this.vertices[smallestDiffs[i].vid];
        if (!(~indexOfVertex(V.vid, bestFitNodes)))     //in case same vertex best-fits to same point
          bestFitNodes.push(V);
    }
   
    return bestFitNodes;
}


//lap is longestAllowedPath
Graph.prototype.generateInitialPopulation = function(A, B, bestFitNodes, lap) {
    //REMEMBER to implement feature where they can input xPercent as an absolute number of miles, as well
    var pathPopulation = [] //holds the paths thru each of the midNodes (it is a list of lists)
    for(var i = 0; i < bestFitNodes.length; i++) {
        var midNode = bestFitNodes[i];
<<<<<<< HEAD
        //var pathD1 = this.dijkstra(A, midNode);
        var pathD1 = this.astar(A, midNode);

        //var pathD2 = this.dijkstra(midNode, B);
        var pathD2 = this.astar(midNode, B);

=======
        var pathD1 = this.dijkstra(A, midNode);
        var pathD2 = this.dijkstra(midNode, B);
>>>>>>> 72f8afa04bf0678162954dbc9b040f327a772b82
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
    
    //document.writeln("path population is:");
    //for(var i = 0; i < pathPopulation.length; i++) {
    //    document.writeln(this.pathToString(pathPopulation[i]));
    //}
    document.writeln("longest allowed path is : " + longestAllowedPath);

    return {pop: pathPopulation, lap: longestAllowedPath}
}


Graph.prototype.elevGainOf = function(path) {  //path is of vertexObj’s
    var gain = 0;
    for (var i = 0; i < path.length - 1; i++) {
        elevDiff = path[i+1].elev - path[i].elev;
        if (elevDiff > 0) {
            gain = gain + elevDiff;
            //document.writeln("gain from " + path[i].label + " to " + path[i+1].label + " is " + elevDiff);
        }
        //else
            //document.writeln("gain from " + path[i].label + " to " + path[i+1].label + " is " + 0);

    }
    document.writeln("");

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
    //NOTE: change it later to spin a greater number of times
    for (var i = 0; i < sortedElevationGains.length; i++) {
        rank = rankSpace[getRandomInteger(0, rankSpace.length - 1)];
        //add that path to parentList
        parentList.push(sortedElevationGains[rank - 1]); //(path of rank i is located at index (i-1)
    }
    
    //document.writeln("in replicate: parentList is:");
    for (var i = 0; i < parentList.length; i++) {
        //document.writeln(this.pathToString(parentList[i].path));
    }
    return parentList; //list of (path, gain) ordered pairs not in sorted order
}


//NOTE: handle the case where lots of overlap because ranks happened to be calculated to only contain 2 or 3 different paths. create mutation operator??
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
    
     //document.writeln("in formPairs: pairs is:");
     /*
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
    //document.writeln("first diff between paths:");
    //document.writeln(this.pathToString(p));
    //document.writeln("and");
    //document.writeln(this.pathToString(q));
    //document.writeln("is at index " + i);
    //document.writeln("");

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
    //document.writeln("last diff between paths is at index " + pointsOfld.ldP + " in");
    //document.writeln(this.pathToString(p));
    //document.writeln("and at " + pointsOfld.ldQ + " in");
    //document.writeln(this.pathToString(q));
    //document.writeln("");

    return pointsOfld;
}







//within the bounds at which the paths differ (their "infixes", as opposed to common prefixes or suffixes), obtain positions on p and q that we will later connect together to form a new child path
Graph.prototype.getCrossoverPoints = function(path1, path2, A, B) {
    var fd = this.firstDiff(path1,path2);
    var lds = this.lastDiffs(path1,path2);

    //if the paths are identical or if we fail to a form crossover point between them (either due to t being too far away from B, or s_to_t containing nodes in common with either A_to_s or t_to_B), the outcome is the same (just generate themselves as children). here, we know its due to being identical
    if (fd == path1.length && (lds.ldP == -1 || lds.ldQ == -1)) { //if paths are identical
        document.writeln("paths are identical. wont try to perform crossover");
        document.writeln("");

        return {"sPos":-1, "tPos":-1};
    }

    //choose s on infix of path1
    //document.writeln("infix of path1 is " + this.pathToString(path1.slice(fd, lds.ldP + 1)));
    //document.writeln("infix of path2 is " + this.pathToString(path2.slice(fd, lds.ldQ + 1)));
    
    var sPos = getRandomInteger(fd, lds.ldP);   //crossover point on path1
    var s = path1[sPos];    //crossover node on p
    //choose t on infix of path2
    var tPos = getRandomInteger(fd, lds.ldQ);   //crossover point on path2
    var t = path2[tPos];    //crossover node on path2
    var k = 1;

    //ensure distance from t to B is less than distance from s to B
    var x = Math.sqrt(Math.abs(B.lat - t.lat) + Math.abs(B.long - t.long));
    var y = Math.sqrt(Math.abs(B.lat - s.lat) + Math.abs(B.long - s.long));
    //document.writeln("dist of " + s.label + " from " + B.label + " is " + y);
    //document.writeln("dist of " + t.label + " from " + B.label + " is " + x);
    
    while (x > y && k < 7) {    //while t is further from B than s is from B
        //try again with new crossover points
        k++;
        document.writeln("t is in wrong direction; generating crossover points for the " + k + "th time");
        
        //recalculate s and t
        sPos = getRandomInteger(fd, lds.ldP);
        s = path1[sPos];
        tPos = getRandomInteger(fd, lds.ldQ);
        t = path2[tPos];
        x = Math.sqrt(Math.abs(B.lat - t.lat) + Math.abs(B.long - t.long));
        y = Math.sqrt(Math.abs(B.lat - s.lat) + Math.abs(B.long - s.long));
        //document.writeln("dist of " + s.label + " from " + B.label + " is " + y);
        //document.writeln("dist of " + t.label + " from " + B.label + " is " + x);
    }
    
    if (x > y && k == 7) {   //if we fail to form crossover points between path1 and path2
        return {"sPos":-1, "tPos":-1};
        document.writeln("");

    }
    document.writeln("");

    return {"sPos":sPos, "tPos":tPos};
    
    
}




Graph.prototype.generateChild = function(path1, path2, lap, A, B) {
    var i, crosspoints, s_to_t, path_s_to_t, dist_s_to_t, path_A_to_s, dist_A_to_s, path_t_to_B, dist_t_to_B, totalDist, cond;

    for(i = 0; i < 7; i++) { //NOTE: change this to higher value later. for now, try up to 3 times to form a short enough child
        crosspoints = this.getCrossoverPoints(path1, path2, A, B);
        
        if (crosspoints.sPos == -1 && crosspoints.tPos == -1) {
            document.writeln("t was never close enough to B, or they were identical. failed to cross over");
            document.writeln("");
            document.writeln("");
            document.writeln("");

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
        
        if ((path_A_to_s[path_A_to_s.length-1].vid) == (path_t_to_B[0].vid))
            document.writeln("successfully passed s == t edgecase");

<<<<<<< HEAD
        //s_to_t = this.dijkstra(path1[crosspoints.sPos], path2[crosspoints.tPos]);
        s_to_t = this.astar(path1[crosspoints.sPos], path2[crosspoints.tPos]);

=======
        s_to_t = this.dijkstra(path1[crosspoints.sPos], path2[crosspoints.tPos]);
>>>>>>> 72f8afa04bf0678162954dbc9b040f327a772b82
        path_s_to_t = s_to_t.path;
        dist_s_to_t = s_to_t.d;
        
        //don't include s and t, of course (and do include the edge case where they are equal)
        if (s.vid == t.vid || this.nodeInCommon(path_s_to_t.slice(1), path_A_to_s) || this.nodeInCommon(path_s_to_t, path_t_to_B.slice(1))) {
            document.writeln("had nodes in common, so trying again");
            continue; //try new crosspoints
        }
        
        totalDist = dist_A_to_s + dist_s_to_t + dist_t_to_B;
        if (totalDist <= lap) { //if the child is shorter than the longest allowed path
            //remove s duplicate
            document.writeln("total dist is " + totalDist + ", so child is short enough");

            path_A_to_s = path_A_to_s.slice(0,path_A_to_s.length - 1);
            //remove t duplicate
            path_t_to_B = path_t_to_B.slice(1);
            
            //document.writeln("crossed over at s = " + path1[crosspoints.sPos].label + " and t = " + path2[crosspoints.tPos].label);
            document.writeln("");
            document.writeln("");
            document.writeln("");

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
    //document.writeln("parent 1: " + this.pathToString(p));
    //document.writeln("parent 2: " + this.pathToString(q));
    document.writeln("");
    //document.writeln("child  1: " + this.pathToString(child1));
    //document.writeln("child  2: " + this.pathToString(child2));
    
    return children;
}


Graph.prototype.evolvePopulation = function(population, longestAllowedPath, start, end) {
    var parentList, pairs, parentPop, childPop, parentGains,childGains, parentAndChildGains, localOptimum, bestG;

    parentPop = population;     //parentPop is list of paths

    //get gains of each path in parentPop
    parentGains = this.getElevGains(parentPop);   //parentGains is list of (path, gain) ordered pairs

    parentGains = parentGains.sort(function(P, Q) { return P.g - Q.g;
                                                   }); //index i holds path with rank (i+1) (ranks are 1-based, index is 0-based)
    document.writeln("after sorting, parentGains is: ");
    for (var i = 0; i < parentGains.length; i++) {
        //document.writeln(this.pathToString(parentGains[i].path), parentGains[i].g);
    }
//from this point on, parentGains is always sorted by elevation gain
    
    
    //NOTE: change this to higher value later. for now, arbitrarily decide to do 7 rounds
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
        
        document.writeln("childPop is:");
        for (var xx = 0; xx < childPop.length; xx++) {
            //document.writeln(this.pathToString(childPop[xx]));
        }
        
        childGains = this.getElevGains(childPop);
        //create list of gains of parents and children combined
        parentAndChildGains = parentGains.concat(childGains);
        
        //no longer sorted by gain, so sort it again
        parentAndChildGains = parentAndChildGains.sort(function(P, Q) { //sort paths by gain
                                               return P.g - Q.g;
                                               });
    
        //“kill off the bottom 50th percentile” -> keep the top half of the list only and assign it as the new parentPop (length of total is always even because doubled parentPop to create it. so don’t need to cover the odd length case.
        //assign this upper half as the new parentGains for the new parentPop (what will serve as parentPop in the next round)
        parentGains = []; //clear parentGains
        
        //next generation of parents
        parentGains = parentAndChildGains.slice(parentAndChildGains.length / 2);  //new parentGains contains paths derived from both previous parentGains and new childGains
        
        document.writeln("");
        document.writeln("");
        document.writeln("");

        localOptimum = parentGains[parentGains.length - 1].path;
        bestG = parentGains[parentGains.length - 1].g;
        
        //document.writeln("round " + i + " produced a local optimum of:" + this.pathToString(localOptimum));
        document.writeln("with a gain of " + bestG);
        document.writeln("and a pathlength of " + this.pathLength(localOptimum));
        document.writeln("");
        document.writeln("");
        document.writeln("");
        
        //move to next round
    }
    
    return localOptimum;
    
}







    
    


var graph = new Graph();

var e = new vertexObj(1, 3, 10, 4, "e");
graph.addVertexObj(e);

var d = new vertexObj(2, 2, 17, 2, "d");
graph.addVertexObj(d);

var A = new vertexObj(3, 4, 23, 0, "A");
graph.addVertexObj(A);

var f = new vertexObj(4, 5, 5, 4, "f");
graph.addVertexObj(f);

var h = new vertexObj(5, 9, 18, 4, "h");
graph.addVertexObj(h);

var g = new vertexObj(6, 9, 8, 3, "g");
graph.addVertexObj(g);

var T = new vertexObj(7, 14, 11, 1, "T");
graph.addVertexObj(T);

var u = new vertexObj(8, 12, 4, 3, "u");
graph.addVertexObj(u);

var W = new vertexObj(9, 13, 25, 5, "W");
graph.addVertexObj(W);

var l = new vertexObj(10, 15, 28, 3, "l");
graph.addVertexObj(l);

var m = new vertexObj(11, 17, 30, 6, "m");
graph.addVertexObj(m);

var n = new vertexObj(12, 17, 27, 2, "n");
graph.addVertexObj(n);

var U = new vertexObj(13, 16, 25, 4, "U");
graph.addVertexObj(U);

var r = new vertexObj(14, 16, 19, 2, "r");
graph.addVertexObj(r);

var w = new vertexObj(15, 21, 13, 1, "w");
graph.addVertexObj(w);

var v = new vertexObj(16, 21, 5, 8, "v");
graph.addVertexObj(v);

var y = new vertexObj(17, 19, 1, 16, "y");
graph.addVertexObj(y);

var R = new vertexObj(18, 23, 1, 27, "R");
graph.addVertexObj(R);

var Q = new vertexObj(19, 25, 4, 26, "Q");
graph.addVertexObj(Q);

var D = new vertexObj(20, 22, 34, 10, "D");
graph.addVertexObj(D);

var E = new vertexObj(21, 25, 25, 4, "E");
graph.addVertexObj(E);

var X = new vertexObj(22, 29, 18, 4, "X");
graph.addVertexObj(X);

var F = new vertexObj(23, 29, 31, 10, "F");
graph.addVertexObj(F);

var B = new vertexObj(24, 32, 8, 4, "B");
graph.addVertexObj(B);

var P = new vertexObj(25, 33, 10, 6, "P");
graph.addVertexObj(P);

var M = new vertexObj(26, 33, 12, 9, "M");
graph.addVertexObj(M);

var L = new vertexObj(27, 33, 14, 6, "L");
graph.addVertexObj(L);

var N = new vertexObj(28, 31, 12, 9, "N");
graph.addVertexObj(N);

var K = new vertexObj(29, 31, 14, 7, "K");
graph.addVertexObj(K);

var I = new vertexObj(30, 32, 18, 10, "I");
graph.addVertexObj(I);

var H = new vertexObj(31, 32, 28, 13, "H");
graph.addVertexObj(H);

var G = new vertexObj(32, 35, 30, 18, "G");
graph.addVertexObj(G);

var J = new vertexObj(33, 37, 17, 8, "J");
graph.addVertexObj(J);


graph.addEdge(f, e, 2);
graph.addEdge(f, u, 3);
graph.addEdge(f, g, 2);

graph.addEdge(e, g, 3);
graph.addEdge(e, d, 3);

graph.addEdge(d, A, 3);
graph.addEdge(d, h, 3);

graph.addEdge(T, g, 3);
graph.addEdge(T, w, 4);
graph.addEdge(T, h, 5);

graph.addEdge(v, u, 6);
graph.addEdge(v, y, 2);
graph.addEdge(v, w, 5);
graph.addEdge(v, P, 8);

graph.addEdge(w, u, 7);
graph.addEdge(w, r, 4);
graph.addEdge(w, N, 6);

graph.addEdge(r, h, 4);
graph.addEdge(r, A, 7);
graph.addEdge(r, U, 3);

graph.addEdge(W, A, 4);
graph.addEdge(W, U, 2);
graph.addEdge(W, l, 2);

graph.addEdge(n, U, 1);
graph.addEdge(n, l, 1);
graph.addEdge(n, m, 1);
graph.addEdge(n, E, 4);

graph.addEdge(l, m, 1);

graph.addEdge(D, m, 3);

graph.addEdge(E, m, 5);
graph.addEdge(E, D, 5);
graph.addEdge(E, X, 4);

graph.addEdge(F, D, 5);
graph.addEdge(F, I, 7);
graph.addEdge(F, H, 2);
graph.addEdge(F, G, 3);

graph.addEdge(N, U, 12);
graph.addEdge(N, K, 1);
graph.addEdge(N, M, 1);

graph.addEdge(H, G, 2);
graph.addEdge(H, I, 5);

graph.addEdge(J, I, 3);
graph.addEdge(J, G, 7);
graph.addEdge(J, P, 5);

graph.addEdge(L, M, 1);
graph.addEdge(L, K, 1);
graph.addEdge(L, I, 2);
graph.addEdge(L, X, 2);

graph.addEdge(M, P, 1);

graph.addEdge(K, X, 2);

graph.addEdge(B, P, 1);
graph.addEdge(B, Q, 4);
graph.addEdge(B, R, 6);

graph.addEdge(R, Q, 2);
graph.addEdge(R, y, 2);

graph.addEdge(y, Q, 3);


var start = K;
var end = f;
//graph.dijkstra(start,end);

//graph.astar(start,end);
var bfn = graph.populateMidline(start,end);
//for(var i = 0; i < bfn.length; i++) {
//    document.writeln("best fit node " + bfn[i].label);
//}
var xPercent = 150;
<<<<<<< HEAD
//var shortestPathDist = graph.dijkstra(start,end);
var shortestPathDist = graph.astar(start,end);
=======
var shortestPathDist = graph.dijkstra(start,end);
>>>>>>> 72f8afa04bf0678162954dbc9b040f327a772b82

var shortestDist = shortestPathDist.d;
var longestAllowedPath = shortestDist * (xPercent / 100);

//??why did i design this to also return lap??
var poplap = graph.generateInitialPopulation(start,end,bfn,longestAllowedPath);
var pop = poplap.pop;
var lap = poplap.lap;

//var gain = graph.elevGainOf(pop[4]);
//document.writeln("gain is: " + gain);
//var elevGains = graph.getElevGains(pop);
//for(var i = 0; i < elevGains.length; i++) {
//    document.writeln("elev gain of path: " + graph.pathToString(elevGains[i].path) + " is " + elevGains[i].g);
//}
//document.writeln("");
//var parentGains = elevGains.sort(function(P, Q) { //sort paths by gain
//                                               return P.g - Q.g;
//                                               });
//for(var i = 0; i < parentGains.length; i++) {
//    document.writeln("elev gain of path: " + graph.pathToString(parentGains[i].path) + " is " + parentGains[i].g);
//}
//var parentList = graph.replicate(parentGains);
//var pairs = graph.formPairs(parentList);
//document.writeln("longest allowed path is : " + lap);
//var children = graph.crossover(pathdist.path, pathdist.path, lap, A, B);
//document.writeln("last diff between :");
//document.writeln("and");
//document.writeln("is at index " + x.ldP + " in 1st path and " + x.ldQ + " in 2nd path");
//document.writeln("crossover points are " + thepoints.sPos + " and " + thepoints.tPos);
//document.writeln("child is: " + graph.pathToString(child));


graph.evolvePopulation(pop, lap, start, end);
document.writeln("compared to gain of shortest path, which is " + graph.elevGainOf(shortestPathDist.path));
//document.writeln("and has a path of " + graph.pathToString(graph.dijkstra(start,end).path));

