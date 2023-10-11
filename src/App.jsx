import { createCanvas } from 'algorithmx';
import React, { useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import seedrandom from 'seedrandom';
// var seedrandom = require('seedrandom');


function App() {
  const [count, setCount] = useState(0)
  const canvas = createCanvas('output');
  var nodes = [];
  var edges = [];
  const [ops, setOps] = useState(0);
  const [minDistOut, setMinDistOut] = useState(0);
  const [pathOut, setPathOut] = useState([]);
  const [n, setN] = useState(5);
  const [seed, setSeed] = useState("hi");
  const pause = 0.15;

  function clear() {
    canvas.nodes().remove();  
  }

  function create() {
    var rng = seedrandom(seed);
    edges = [];
    nodes = [];
    

    canvas.size([500, 500])
    for (let i = 0; i < n; i++) {
      nodes.push(i);
      edges.push([])
      for (let t = 0; t < n; t++) {
        edges[i].push(0);
      }
    }
    canvas.nodes(nodes).add().color('blue');

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i; j < nodes.length; j++) {
        if (i != j) {
          const leng = Math.floor(rng() * 100);
          canvas.edge([i, j]).add({length: leng, labels: ({ 0: { 'text': leng } })});
          edges[i][j] = leng;
          edges[j][i] = leng;
        } 

      }
    }
  }

  function bf() {
    create();
    let perms = [];
    let operations = 0;
    
    function permute(arr, memo) {
      var cur, memo = memo || [];
      
      for (var i = 0; i < arr.length; i++) {
        cur = arr.splice(i, 1);
        if (arr.length === 0) {
          perms.push(memo.concat(cur));
        }
        permute(arr.slice(), memo.concat(cur));
        arr.splice(i, 0, cur[0]);
      }
    }
    permute(nodes.slice(1));

    var path = [];
    let minDist = Number.MAX_VALUE;
    perms.forEach(perm => {
      canvas.edges().color('grey');
      // console.log(perm);
      let dist = 0;
      dist += edges[0][perm[0]];
      canvas.edge([0, perm[0]]).traverse('red').pause(pause);
      operations++;
      for (let i = 1; i < perm.length; i++) {
        operations++;
        dist += edges[perm[i-1]][perm[i]];
        canvas.edge([perm[i-1], perm[i]]).traverse('red').pause(pause);
      }  
      operations++;
      canvas.edge([perm[n-2], 0]).traverse('red').pause(pause);
      dist += edges[0][perm[n-2]];
      // console.log(dist);
      if (dist < minDist) {
        minDist = dist;
        path = perm;
      }
    });
    
    canvas.edges().color('grey');
    canvas.edge([0, path[0]]).traverse('green').pause(pause);
    for (let i = 1; i < path.length; i++) {
      canvas.edge([path[i-1], path[i]]).traverse('green').pause(pause);
    }  
    canvas.edge([path[n-2], 0]).traverse('green').pause(pause);
    
    setMinDistOut(minDist);
    setPathOut(path);
    setOps(operations);
  }

  function greedy() {
    create();
    let operations = 0;
    let path = [];
    let options = [];
    for (let i = 0; i < n; i++) {
      options.push(i);
    }
    
    let x = options.shift();
    while (options.length != 0) {
      canvas.edges().color('grey');
      path.push(x);
      let min = Number.MAX_VALUE;
      let next = 0;

      options.forEach(element => {
        operations++;
        canvas.edge([x, element]).traverse('red').pause(pause);
        if (edges[x][element] < min) {
          next = element;
          min = edges[x][element];
        }
      });

      options.splice(options.indexOf(next), 1);
      x = next;
    }
    path.push(x);
    path.push(0);

    let dist = 0;
    canvas.edges().color('white');
    for (let i = 1; i < path.length; i++) {
      dist += edges[path[i-1]][path[i]];
      canvas.edge([path[i-1], path[i]]).traverse('green').pause(pause);
    }  
    setMinDistOut(dist);
    setPathOut(path);
    setOps(operations);
  }

  function k2op() {
    create();
    let operations = 0;
    let path = [];
    let options = [];
    for (let i = 0; i < n; i++) {
      options.push(i);
    }
    
    let x = options.shift();
    while (options.length != 0) {
      canvas.edges().color('grey');
      path.push(x);
      let min = Number.MAX_VALUE;
      let next = 0;

      options.forEach(element => {
        operations++;
        canvas.edge([x, element]).traverse('red').pause(pause);
        if (edges[x][element] < min) {
          next = element;
          min = edges[x][element];
        }
      });

      options.splice(options.indexOf(next), 1);
      x = next;
    }
    path.push(x);
    path.push(0);
    
    let minDist = 0;
    canvas.edges().color('grey');
    for (let i = 1; i < path.length; i++) {
      minDist += edges[path[i-1]][path[i]];
      canvas.edge([path[i-1], path[i]]).traverse('red').pause(pause);
    }
    
    for (let j = 2; j < path.length -1; j++) {
      let newpath = path.slice();
      const temp = newpath[j];
      newpath[j] = newpath[j-1]
      newpath[j-1] = temp;
      let dist = 0;
      canvas.edges().color('grey');
      for (let i = 1; i < path.length; i++) {
        operations++;
        dist += edges[newpath[i-1]][newpath[i]];
        canvas.edge([newpath[i-1], newpath[i]]).traverse('red').pause(pause);
      }        
      
      if (dist < minDist) {
        path = newpath;
        minDist = dist;
        console.log('helped');
      }
    }

    canvas.edges().color('white');
    for (let i = 1; i < path.length; i++) {
      canvas.edge([path[i-1], path[i]]).traverse('green').pause(pause);
    }

    setMinDistOut(minDist);
    setPathOut(path);
    setOps(operations);
  }

  function k3op() {
    create();
    let operations = 0;
    let path = [];
    let options = [];
    for (let i = 0; i < n; i++) {
      options.push(i);
    }
    
    let x = options.shift();
    while (options.length != 0) {
      canvas.edges().color('grey');
      path.push(x);
      let min = Number.MAX_VALUE;
      let next = 0;

      options.forEach(element => {
        operations++;
        canvas.edge([x, element]).traverse('red').pause(pause);
        if (edges[x][element] < min) {
          next = element;
          min = edges[x][element];
        }
      });

      options.splice(options.indexOf(next), 1);
      x = next;
    }
    path.push(x);
    path.push(0);
    
    let minDist = 0;
    canvas.edges().color('grey');
    for (let i = 1; i < path.length; i++) {
      minDist += edges[path[i-1]][path[i]];
      canvas.edge([path[i-1], path[i]]).traverse('red').pause(pause);
    }
    
    for (let j = 3; j < path.length -1; j++) {
      let newpath = path.slice();
      const temp = newpath[j];
      newpath[j] = newpath[j-2]
      newpath[j-2] = temp;
      let dist = 0;
      canvas.edges().color('grey');
      for (let i = 1; i < path.length; i++) {
        operations++;
        dist += edges[newpath[i-1]][newpath[i]];
        canvas.edge([newpath[i-1], newpath[i]]).traverse('red').pause(pause);
      }        
      
      if (dist < minDist) {
        path = newpath;
        minDist = dist;
      }
    }

    canvas.edges().color('white');
    for (let i = 1; i < path.length; i++) {
      canvas.edge([path[i-1], path[i]]).traverse('green').pause(pause);
    }

    setMinDistOut(minDist);
    setPathOut(path);
    setOps(operations);
  }

  


  return (
    <body>
    <div className="App">
        <h1>Simple react app to show different travelling salesperson algorithm</h1>
        <br></br>

        <label>Number of nodes: </label>
        <input
            type="n"
            placeholder="n"
            className="me-2"
            onChange={(event) => setN(event.target.value)}
            value={n}
        />

        <br></br>
        <label>Seed: </label>
        <input
            type="n"
            placeholder="n"
            className="me-2"
            onChange={(event) => setSeed(event.target.value)}
            value={seed}
        />
        <br></br>
        <button onClick={create}>Create</button>
        <button onClick={clear}>Clear</button>

        <br></br>
        <br></br>
        <button onClick={bf}>BruteForce</button>
        <button onClick={greedy}>nearest neighbour</button>
        <button onClick={k2op}>2op</button>
        <button onClick={k3op}>3op</button>
        <p>operations: {ops}</p>
        <p>path: {pathOut}</p>
        <p>distance: {minDistOut}</p>
        <div id="output"> </div>
    </div>
    </body>
  );
}

export default App;