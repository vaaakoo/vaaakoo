const fs = require('fs');

// ბადის ზომები ზუსტად ისეთივეა, როგორიც GitHub-ის კონტრიბუციების გრაფს აქვს (53 კვირა, 7 დღე)
const cols = 53;
const rows = 7;
const cellSize = 11;
const gap = 4;
const generations = 30; // 30 კადრი
const durationPerGen = 0.5; // ნახევარი წამი თითო კადრზე

// 1. საწყისი ბადის შექმნა (შემთხვევითი "კონტრიბუციები" Seed-ისთვის)
let grid = Array(rows).fill().map(() =>
    Array(cols).fill(0).map(() => (Math.random() > 0.75 ? 1 : 0))
);

const history = [grid];

// 2. სიცოცხლის თამაშის ლოგიკა (Conway's rules)
for (let g = 0; g < generations; g++) {
    let nextGrid = Array(rows).fill().map(() => Array(cols).fill(0));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let neighbors = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    let nr = r + i, nc = c + j;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        neighbors += grid[nr][nc];
                    }
                }
            }
            if (grid[r][c] === 1 && (neighbors < 2 || neighbors > 3)) nextGrid[r][c] = 0;
            else if (grid[r][c] === 0 && neighbors === 3) nextGrid[r][c] = 1;
            else nextGrid[r][c] = grid[r][c];
        }
    }
    history.push(nextGrid);
    grid = nextGrid;
}

// 3. SVG-ის და CSS Keyframes-ის გენერაცია
const width = cols * (cellSize + gap) - gap;
const height = rows * (cellSize + gap) - gap;
const githubGreens = ['#0e4429', '#006d32', '#26a641', '#39d353']; // GitHub Dark Mode-ის მწვანე ფერები

let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n`;
let styles = `<style>\n  .cell { fill: #161b22; rx: 2; }\n`;
let cellsSvg = '';

for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const cellId = `c${r}_${c}`;
        const isEverAlive = history.some(h => h[r][c] === 1);
        let x = c * (cellSize + gap);
        let y = r * (cellSize + gap);

        // ვაგენერირებთ ანიმაციას მხოლოდ იმ უჯრედებისთვის, რომლებიც ერთხელ მაინც "ცოცხლდებიან" (ფაილის ზომის შესამცირებლად)
        if (isEverAlive) {
            styles += `  #${cellId} { animation: a_${cellId} ${generations * durationPerGen}s step-end infinite; }\n`;
            styles += `  @keyframes a_${cellId} {\n`;
            for (let g = 0; g <= generations; g++) {
                let pct = ((g / generations) * 100).toFixed(1);
                let alive = history[g][r][c] === 1;
                let color = alive ? githubGreens[Math.floor(Math.random() * githubGreens.length)] : '#161b22';
                styles += `    ${pct}% { fill: ${color}; }\n`;
            }
            styles += `  }\n`;
        }
        cellsSvg += `  <rect id="${cellId}" class="cell" x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" />\n`;
    }
}

styles += `</style>\n`;
svg += styles + cellsSvg + `</svg>`;

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}
fs.writeFileSync('dist/game-of-life.svg', svg);
console.log('Game of Life SVG generated successfully!');
