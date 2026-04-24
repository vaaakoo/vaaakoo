const fs = require('fs');

const BOARD_FILE = 'board-chess.json'; // ვიყენებთ ახალ სახელს, რომ წინა თამაშისგან განცალკევდეს
const ROWS = 6;
const COLS = 7;

// საწყისი მდგომარეობა
let state = {
    board: Array(ROWS).fill().map(() => Array(COLS).fill(0)),
    currentPlayer: 1, // 1 (P1 - Blue King) ან 2 (P2 - Purple Queen)
    winner: 0,
    isDraw: false
};

// ვკითხულობთ წინა მდგომარეობას (თუ არსებობს)
if (fs.existsSync(BOARD_FILE)) {
    state = JSON.parse(fs.readFileSync(BOARD_FILE));
}

// ვამოწმებთ, თუ სკრიპტი გაეშვა Issue-დან (სათაურის მიხედვით)
const issueTitle = process.env.ISSUE_TITLE || '';
const match = issueTitle.match(/^c4-move-(\d)$/);

// მოგების შემოწმების მარტივი ლოგიკა (უცვლელია Connect 4-დან)
function checkWin(board, player) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (c <= COLS - 4 && board[r][c] === player && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) return true;
            if (r <= ROWS - 4 && board[r][c] === player && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) return true;
            if (r <= ROWS - 4 && c <= COLS - 4 && board[r][c] === player && board[r+1][c+1] === player && board[r+2][c+2] === player && board[r+3][c+3] === player) return true;
            if (r <= ROWS - 4 && c >= 3 && board[r][c] === player && board[r+1][c-1] === player && board[r+2][c-2] === player && board[r+3][c-3] === player) return true;
        }
    }
    return false;
}

// სვლის გაკეთება (თუ ვალიდურია)
if (match) {
    if (state.winner !== 0 || state.isDraw) {
        // თუ თამაში მორჩენილი იყო, ახალი სვლა არესეტებს დაფას
        state = { board: Array(ROWS).fill().map(() => Array(COLS).fill(0)), currentPlayer: 1, winner: 0, isDraw: false };
    } else {
        const col = parseInt(match[1]);
        if (col >= 0 && col < COLS) {
            for (let r = ROWS - 1; r >= 0; r--) {
                if (state.board[r][col] === 0) {
                    state.board[r][col] = state.currentPlayer;
                    if (checkWin(state.board, state.currentPlayer)) {
                        state.winner = state.currentPlayer;
                    } else if (state.board[0].every(c => c !== 0)) {
                        state.isDraw = true;
                    } else {
                        state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
                    }
                    break;
                }
            }
        }
    }
}

// ვინახავთ განახლებულ მდგომარეობას
fs.writeFileSync(BOARD_FILE, JSON.stringify(state));

// ==========================================
// SVG-ის ხატვა (აქ იქმნება ჭადრაკის ეფექტი)
// ==========================================

// გაფართოებული ტერმინალის სტილის SVG ფონი
const width = 850;
const height = 480;

let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: #1e1e1e; rx: 10; }
    .header { fill: #323233; }
    .dot-red { fill: #ff5f56; }
    .dot-yellow { fill: #ffbd2e; }
    .dot-green { fill: #27c93f; }
    
    .game-board { fill: #21262d; rx: 10; }
    
    /* ჭადრაკის დაფის უჯრები */
    .square-light { fill: #5c6c7c; } /* კლასიკური ჭადრაკის ღია უჯრა */
    .square-dark { fill: #3e4e5e; } /* კლასიკური ჭადრაკის მუქი უჯრა */
    
    /* ფიგურების სილუეტები (SVG Path) */
    .piece-blue-king { fill: #58a6ff; } /* Player 1 (Blue King) */
    .piece-purple-queen { fill: #bc8cff; } /* Player 2 (Purple Queen) */

    /* ტექსტის სტილი */
    .game-text { 
      font-family: 'Consolas', 'Courier New', monospace; 
      font-size: 16px; 
      font-weight: bold; 
      text-anchor: middle;
      animation: appear 0.1s forwards;
    }
    .game-text-sm { font-size: 12px; }
    .game-turn-blue { fill: #58a6ff; }
    .game-turn-purple { fill: #bc8cff; }
    .game-win-green { fill: #39d353; }
    .game-draw-yellow { fill: #ffbd2e; }

    @keyframes appear { to { opacity: 1; } }
  </style>

  <rect class="bg" width="850" height="480" />
  <path class="header" d="M0 10 Q0 0 10 0 H840 Q850 0 850 10 V30 H0 Z" />
  <circle class="dot-red" cx="20" cy="15" r="6" />
  <circle class="dot-yellow" cx="40" cy="15" r="6" />
  <circle class="dot-green" cx="60" cy="15" r="6" />
  <text x="375" y="20" font-family="monospace" font-size="12" fill="#888">vaaakoo@vaaakoo-dev: ~ (Connect 4 Chess)</text>

  <text x="425" y="60" class="game-text">♟️ Connect 4 with the Community</text>
  <text x="425" y="85" class="game-text game-text-sm" font-weight="normal">Drop a piece by clicking a column below. Board updates in ~20s[cite: 3].</text>

  <text id="turn-text" x="425" y="110" class="game-text game-turn-bluepiece">Next Move: Player 1 (Blue King)</text>
  <text id="turn-text" x="425" y="110" class="game-text game-turn-purplepiece" visibility="hidden">Next Move: Player 2 (Purple Queen)</text>

  <rect class="game-board" x="25" y="130" width="800" height="300" />
  
  <g id="board-grid" transform="translate(25, 130)">
    <defs>
      <pattern id="chessboard" patternUnits="userSpaceOnUse" width="228.56" height="100">
        <rect width="114.28" height="50" class="square-light" />
        <rect x="114.28" width="114.28" height="50" class="square-dark" />
        <rect y="50" width="114.28" height="50" class="square-dark" />
        <rect x="114.28" y="50" width="114.28" height="50" class="square-light" />
      </pattern>
    </defs>
    
    <rect width="800" height="300" fill="url(#chessboard)" />

    <g transform="translate(85.7, 275)" class="piece-blue-king">
      <path d="M 0,-15 A 15,15 0 0,1 15,0 L 15,15 L -15,15 L -15,0 A 15,15 0 0,1 0,-15 Z" /> <path d="M -10,-10 L 0,-25 L 10,-10 L 0,0 L -10,-10 Z" /> <path d="M -20,-10 L -10,-10 L -10,0 L -20,0 Z" /> <path d="M 10,-10 L 20,-10 L 20,0 L 10,0 Z" /> </g>
    
    <g transform="translate(199.9, 275)" class="piece-purple-queen">
        <path d="M 0,-18 A 18,18 0 0,1 18,0 L 18,15 L -18,15 L -18,0 A 18,18 0 0,1 0,-18 Z" /> <path d="M 0,-15 L -10,-30 L 10,-30 Z" /> <path d="M 15,-10 L 15,-25 L 0,-15 Z" /> <path d="M -15,-10 L -15,-25 L 0,-15 Z" /> <path d="M 0,-15 A 5,5 0 1,1 0,-16 Z" /> </g>
    
  </g>

  <text x="425" y="445" class="game-text game-text-sm">Get 4 Kings or 4 Queens in a row to win! (P1 Blue vs P2 Purple)</text>
  
  <g transform="translate(25, 455)">
    <rect id="btn-col1" x="0" y="0" width="114.28" height="25" fill="#323233" rx="5" /> <text x="57.14" y="16" class="game-text game-text-sm" fill="#ccc" opacity="1">⬇️ Col 1</text>
    <rect id="btn-col2" x="114.28" y="0" width="114.28" height="25" fill="#323233" rx="5" /> <text x="171.42" y="16" class="game-text game-text-sm" fill="#ccc" opacity="1">⬇️ Col 2</text>
    <rect id="btn-col3" x="228.56" y="0" width="114.28" height="25" fill="#323233" rx="5" /> <text x="285.7" y="16" class="game-text game-text-sm" fill="#ccc" opacity="1">⬇️ Col 3</text>
    <rect id="btn-col4" x="342.84" y="0" width="114.28" height="25" fill="#323233" rx="5" /> <text x="399.98" y="16" class="game-text game-text-sm" fill="#ccc" opacity="1">⬇️ Col 4</text>
    <rect id="btn-col5" x="457.12" y="0" width="114.28" height="25" fill="#323233" rx="5" /> <text x="514.26" y="16" class="game-text game-text-sm" fill="#ccc" opacity="1">⬇️ Col 5</text>
    <rect id="btn-col6" x="571.4" y="0" width="114.28" height="25" fill="#323233" rx="5" /> <text x="628.54" y="16" class="game-text game-text-sm" fill="#ccc" opacity="1">⬇️ Col 6</text>
    <rect id="btn-col7" x="685.68" y="0" width="114.28" height="25" fill="#323233" rx="5" /> <text x="742.82" y="16" class="game-text game-text-sm" fill="#ccc" opacity="1">⬇️ Col 7</text>
  </g>
  
</svg>
`;

if (!fs.existsSync('dist')) fs.mkdirSync('dist');
fs.writeFileSync('dist/connect4-chess.svg', svg);
console.log('Connect 4 Chess SVG generated successfully!');
