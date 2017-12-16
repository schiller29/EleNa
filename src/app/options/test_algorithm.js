var num_failures = 0;
//kept the for loop not visually indented to be easily removed.
for(i = 0; i < 10; i++){
	var graph = new Graph();

	var e = new vertexObj(1, 3, 10, Math.floor((Math.random() * 10)) + 1, "e");
	graph.addVertexObj(e);

	var d = new vertexObj(2, 2, 17, Math.floor((Math.random() * 10)) + 1, "d");
	graph.addVertexObj(d);

	var A = new vertexObj(3, 4, 23, Math.floor((Math.random() * 10)) + 1, "A");
	graph.addVertexObj(A);

	var f = new vertexObj(4, 5, 5, Math.floor((Math.random() * 10)) + 1, "f");
	graph.addVertexObj(f);

	var h = new vertexObj(5, 9, 18, Math.floor((Math.random() * 10)) + 1, "h");
	graph.addVertexObj(h);

	var g = new vertexObj(6, 9, 8, Math.floor((Math.random() * 10)) + 1, "g");
	graph.addVertexObj(g);

	var T = new vertexObj(7, 14, 11, Math.floor((Math.random() * 10)) + 1, "T");
	graph.addVertexObj(T);

	var u = new vertexObj(8, 12, 4, Math.floor((Math.random() * 10)) + 1, "u");
	graph.addVertexObj(u);

	var W = new vertexObj(9, 13, 25, Math.floor((Math.random() * 10)) + 1, "W");
	graph.addVertexObj(W);

	var l = new vertexObj(10, 15, 28, Math.floor((Math.random() * 10)) + 1, "l");
	graph.addVertexObj(l);

	var m = new vertexObj(11, 17, 30, Math.floor((Math.random() * 10)) + 1, "m");
	graph.addVertexObj(m);

	var n = new vertexObj(12, 17, 27, Math.floor((Math.random() * 10)) + 1, "n");
	graph.addVertexObj(n);

	var U = new vertexObj(13, 16, 25, Math.floor((Math.random() * 10)) + 1, "U");
	graph.addVertexObj(U);

	var r = new vertexObj(14, 16, 19, Math.floor((Math.random() * 10)) + 1, "r");
	graph.addVertexObj(r);

	var w = new vertexObj(15, 21, 13, Math.floor((Math.random() * 10)) + 1, "w");
	graph.addVertexObj(w);

	var v = new vertexObj(16, 21, 5, Math.floor((Math.random() * 10)) + 1, "v");
	graph.addVertexObj(v);

	var y = new vertexObj(17, 19, 1, Math.floor((Math.random() * 10)) + 1, "y");
	graph.addVertexObj(y);

	var R = new vertexObj(18, 23, 1, Math.floor((Math.random() * 10)) + 1, "R");
	graph.addVertexObj(R);

	var Q = new vertexObj(19, 25, 4, Math.floor((Math.random() * 10)) + 1, "Q");
	graph.addVertexObj(Q);

	var D = new vertexObj(20, 22, 34, Math.floor((Math.random() * 10)) + 1, "D");
	graph.addVertexObj(D);

	var E = new vertexObj(21, 25, 25, Math.floor((Math.random() * 10)) + 1, "E");
	graph.addVertexObj(E);

	var X = new vertexObj(22, 29, 18, Math.floor((Math.random() * 10)) + 1, "X");
	graph.addVertexObj(X);

	var F = new vertexObj(23, 29, 31, Math.floor((Math.random() * 10)) + 1, "F");
	graph.addVertexObj(F);

	var B = new vertexObj(24, 32, 8, Math.floor((Math.random() * 10)) + 1, "B");
	graph.addVertexObj(B);

	var P = new vertexObj(25, 33, 10, Math.floor((Math.random() * 10)) + 1, "P");
	graph.addVertexObj(P);

	var M = new vertexObj(26, 33, 12, Math.floor((Math.random() * 10)) + 1, "M");
	graph.addVertexObj(M);

	var L = new vertexObj(27, 33, 14, Math.floor((Math.random() * 10)) + 1, "L");
	graph.addVertexObj(L);

	var N = new vertexObj(28, 31, 12, Math.floor((Math.random() * 10)) + 1, "N");
	graph.addVertexObj(N);

	var K = new vertexObj(29, 31, 14, Math.floor((Math.random() * 10)) + 1, "K");
	graph.addVertexObj(K);

	var I = new vertexObj(30, 32, 18, Math.floor((Math.random() * 10)) + 1, "I");
	graph.addVertexObj(I);

	var H = new vertexObj(31, 32, 28, Math.floor((Math.random() * 10)) + 1, "H");
	graph.addVertexObj(H);

	var G = new vertexObj(32, 35, 30, Math.floor((Math.random() * 10)) + 1, "G");
	graph.addVertexObj(G);

	var J = new vertexObj(33, 37, 17, Math.floor((Math.random() * 10)) + 1, "J");
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

	
	var assert = function(condition, message) { 
    	if (!condition){
        	throw Error("Assert failed" + (typeof message !== "undefined" ? ": " + message : ""));
        	num_failures++;
    	}
	};

	evolver(graph.vertices, graph.edges, R, D, true, 200);
	assert(CURRENT_BEST >= SHORTEST_PATH_EL, "The found path was better performance than shortes path");
	assert(CURRENT_BEST_PL <= longestAllowedPath);
	document.writeln("compared to gain of shortest path, which is " + graphx.elevGainOf(shortestPathDist.path));
	//document.writeln("and has a path of " + graph.pathToString(graph.dijkstra(start,end).path));
}

document.writeln('The number of failures were: ' + num_failures);


