// Theme toggle
const toggleCheckbox = document.getElementById('themeToggle');
toggleCheckbox.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', toggleCheckbox.checked);
});

// Resources DB
const resourcesDB = {
  "Math": [
    "Khan Academy Math: https://www.khanacademy.org/math",
    "PatrickJMT: https://www.youtube.com/user/patrickJMT",
    "MIT OCW Math: https://ocw.mit.edu/courses/mathematics/"
  ],
  "Physics": [
    "HyperPhysics: http://hyperphysics.phy-astr.gsu.edu",
    "MinutePhysics: https://www.youtube.com/user/minutephysics",
    "MIT OCW Physics: https://ocw.mit.edu/courses/physics/"
  ],
  "English": [
    "BBC Learning English: https://www.bbc.co.uk/learningenglish",
    "Grammarly Blog: https://www.grammarly.com/blog/",
    "Coursera English: https://www.coursera.org/browse/language-learning/english"
  ],
  "Computer Science": [
    "GeeksforGeeks: https://www.geeksforgeeks.org/",
    "CS50: https://cs50.harvard.edu/x/2026/",
    "FreeCodeCamp: https://www.freecodecamp.org/"
  ]
};

// Get resources for subject
function getResources(subject) {
  return resourcesDB[subject] || [
    "Wikipedia: https://www.wikipedia.org/",
    "Khan Academy: https://www.khanacademy.org/",
    "Coursera: https://www.coursera.org/",
    "YouTube: https://www.youtube.com/"
  ];
}

// DFS/BFS functions
function dfs(node, graph, visited, order){
  if(visited.has(node)) return;
  visited.add(node);
  if(graph[node]) graph[node].forEach(n => dfs(n, graph, visited, order));
  order.push(node);
}

function bfs(startNodes, graph){
  let visited = new Set();
  let queue = [...startNodes];
  let order = [];
  queue.forEach(n => visited.add(n));
  while(queue.length){
    let node = queue.shift();
    order.push(node);
    if(graph[node]) graph[node].forEach(n=>{
      if(!visited.has(n)){
        visited.add(n);
        queue.push(n);
      }
    });
  }
  return order;
}

// Form submission
document.getElementById('plannerForm').addEventListener('submit', function(e){
  e.preventDefault();

  let raw = document.getElementById('subjectTopics').value.trim();
  let subjectsPriority = document.getElementById('priority').value.trim().split(',').map(x=>parseInt(x));
  let hours = parseInt(document.getElementById('hours').value);
  let algoMode = document.getElementById('algoMode').value;
  let depInput = document.getElementById('dependencies').value.trim();

  if(!raw || isNaN(hours) || subjectsPriority.length === 0){
    alert("⚠️ Enter valid inputs!");
    return;
  }

  // Parse subjects & topics
  let subjects = [];
  let topicsMap = {}; // subject -> [topics]
  raw.split(',').forEach((pair)=>{
    let [sub, tops] = pair.split(':');
    if(sub && tops){
      sub = sub.trim();
      let topsArr = tops.split('|').map(t=>t.trim());
      topicsMap[sub] = topsArr;
      subjects.push(sub);
    }
  });

  // Validate priority
  if(subjectsPriority.length !== subjects.length){
    alert("⚠️ Number of priorities must match number of subjects!");
    return;
  }

  // Build dependency graph
  let depGraph = {};
  if(depInput){
    depInput.split(',').forEach(pair=>{
      let [t, deps] = pair.split(':');
      if(t && deps){
        depGraph[t.trim()] = deps.split('|').map(d=>d.trim());
      }
    });
  }

  // Plan order
  let order = [];
  let allTopics = [];
  Object.keys(topicsMap).forEach(sub => allTopics.push(...topicsMap[sub]));
  
  if(algoMode==='dfs'){
    let visited = new Set();
    allTopics.forEach(t=>dfs(t, depGraph, visited, order));
  } else if(algoMode==='bfs'){
    order = bfs(allTopics, depGraph);
  } else order = allTopics;

  // AI-inspired allocation & display
  let totalPriority = subjectsPriority.reduce((a,b)=>a+b,0);
  let scheduleDiv = document.getElementById('schedule');
  scheduleDiv.innerHTML = '';

  let motivational = [
    "💪 Keep going!", "🔥 You got this!", "✨ Study smart!", "🎯 Focus and achieve!", 
    "🌟 Make every hour count!", "📚 Knowledge is power!", "⏰ Time well spent!", 
    "🎉 Small progress is big success!", "⭐ Shine bright!", "🧠 Train your brain!"
  ];

  let colors = ["#AEDFF7","#80CFFF","#4FB0FF","#007BFF","#004E8C"];

  order.forEach(topic=>{
    // Find subject of topic
    let sub = Object.keys(topicsMap).find(s=>topicsMap[s].includes(topic));
    let idx = subjects.indexOf(sub);
    let allocated = Math.round((subjectsPriority[idx]/totalPriority)*hours);
    let resLinks = getResources(sub).map(r => `<li>${r}</li>`).join('');

    let div = document.createElement('div');
    div.className = 'card';
    div.style.backgroundColor = colors[subjectsPriority[idx]-1] || "#e8f4f8";
    let msg = motivational[Math.floor(Math.random()*motivational.length)];
    div.innerHTML = `<input type="checkbox" id="${topic}" />
      <label for="${topic}"><strong>${topic}</strong> (${allocated}h) - ${msg}</label>
      <ul>${resLinks}</ul>`;
    scheduleDiv.appendChild(div);
  });

  // Copy Plan button
  let copyBtn = document.createElement('button');
  copyBtn.textContent = "📄 Copy Plan";
  copyBtn.addEventListener('click', ()=>{
    let text = order.map(topic=>{
      let sub = Object.keys(topicsMap).find(s=>topicsMap[s].includes(topic));
      let idx = subjects.indexOf(sub);
      let allocated = Math.round((subjectsPriority[idx]/totalPriority)*hours);
      return `${topic} (${allocated}h)`;
    }).join("\n");
    navigator.clipboard.writeText(text);
    alert("✅ Plan copied to clipboard!");
  });
  scheduleDiv.appendChild(copyBtn);
});