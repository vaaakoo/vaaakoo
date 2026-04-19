const fs = require('fs');

const svgContent = `
<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: #1e1e1e; rx: 10; }
    .header { fill: #323233; }
    .dot-red { fill: #ff5f56; }
    .dot-yellow { fill: #ffbd2e; }
    .dot-green { fill: #27c93f; }
    
    .text {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 14px;
      fill: #cccccc;
      opacity: 0;
      animation: appear 0.1s forwards;
    }
    
    .prompt { fill: #4af626; font-weight: bold; }
    .path { fill: #3b8eea; font-weight: bold; }
    .cmd { fill: #ffffff; }
    .success { fill: #27c93f; font-weight: bold; }
    .warning { fill: #ffbd2e; }
    
    .cursor {
      fill: #cccccc;
      animation: blink 1s step-end infinite;
    }

    /* ანიმაციის თანმიმდევრობა (წამებში) */
    .l1 { animation-delay: 0.5s; }
    .l2 { animation-delay: 1.5s; }
    .l3 { animation-delay: 2.0s; }
    .l4 { animation-delay: 2.5s; }
    .l5 { animation-delay: 3.5s; }
    .l6 { animation-delay: 3.7s; }
    .l7 { animation-delay: 3.9s; }
    .l8 { animation-delay: 5.0s; }
    .l9 { animation-delay: 6.0s; }
    .l10 { animation-delay: 6.3s; }
    .l11 { animation-delay: 7.5s; }

    @keyframes appear {
      to { opacity: 1; }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  </style>

  <rect class="bg" width="800" height="400" />
  <path class="header" d="M0 10 Q0 0 10 0 H790 Q800 0 800 10 V30 H0 Z" />
  <circle class="dot-red" cx="20" cy="15" r="6" />
  <circle class="dot-yellow" cx="40" cy="15" r="6" />
  <circle class="dot-green" cx="60" cy="15" r="6" />
  <text x="350" y="20" font-family="monospace" font-size="12" fill="#888">vako@dev-machine: ~</text>

  <g transform="translate(20, 60)">
    <text class="text l1" y="0">
      <tspan class="prompt">vako@dev-machine</tspan>:<tspan class="path">~</tspan>$ <tspan class="cmd">cd Nexus.Core</tspan>
    </text>
    
    <text class="text l2" y="25">
      <tspan class="prompt">vako@dev-machine</tspan>:<tspan class="path">~/Nexus.Core</tspan>$ <tspan class="cmd">dotnet build -c Release</tspan>
    </text>
    
    <text class="text l3" y="50">MSBuild version 17.8.3+195e7f5a3 for .NET</text>
    <text class="text l4" y="70">  Determining projects to restore...</text>
    <text class="text l5" y="90">  Restored /src/Nexus.Core/Nexus.Core.csproj (in 245 ms).</text>
    <text class="text l6 success" y="115">Build succeeded.</text>
    <text class="text l7 warning" y="135">    0 Warning(s)</text>
    <text class="text l7" y="155">    0 Error(s)</text>

    <text class="text l8" y="190">
      <tspan class="prompt">vako@dev-machine</tspan>:<tspan class="path">~/Nexus.Core</tspan>$ <tspan class="cmd">docker-compose up -d grocery-db redis</tspan>
    </text>
    
    <text class="text l9" y="215">[+] Running 2/2</text>
    <text class="text l10" y="235"> ✔ Container grocery-db  <tspan class="success">Started</tspan></text>
    <text class="text l10" y="255"> ✔ Container redis-cache <tspan class="success">Started</tspan></text>

    <text class="text l11" y="290">
      <tspan class="prompt">vako@dev-machine</tspan>:<tspan class="path">~/Nexus.Core</tspan>$ <tspan class="cmd">./deploy.sh</tspan>
    </text>
    
    <rect class="text l11 cursor" x="310" y="278" width="8" height="15" />
  </g>
</svg>
`;

if (!fs.existsSync('dist')){
    fs.mkdirSync('dist');
}

fs.writeFileSync('dist/terminal.svg', svgContent);
console.log('Terminal SVG generated successfully!');
