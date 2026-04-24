const fs = require('fs');

const BOARD_FILE = 'board.json';
const ROWS = 6;
const COLS = 7;

// საწყისი მდგომარეობა
let state = {
    board: Array(ROWS).fill().map(() => Array(COLS).fill(0)),
    currentPlayer: 1, // 1 (Blue) ან 2 (Purple)
    winner: 0,
    isDraw: false
};

// ვკითხულობთ წინა მდგომარეობას (თუ არსებობს)
if (fs.existsSync(BOARD_FILE)) {
    state = JSON.parse(fs.readFileSync(BOARD_FILE));
}

// ვამოწმებთ, თუ სკრიპტი გაეშვა Issue-დან
const issueTitle = process.env.ISSUE_TITLE || '';
const match = issueTitle.match(/^c4-move-(\d)$/);

// მოგების შემოწმების მარტივი ლოგიკა
function checkWin(board, player) {
    // ჰორიზონტალური, ვერტიკალური და დიაგონალური შემოწმება
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

// სვლის გაკეთება
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

// ვხატავთ SVG-ს
const cell = 60;
const gap = 10;
const width = COLS * (cell + gap) + gap;
const height = ROWS * (cell + gap) + gap + 40; // +40 ტექსტისთვის

let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0d1117" rx="15" />
  <rect x="0" y="40" width="${width}" height="${height - 40}" fill="#161b22" rx="10" />`;

for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
        const cx = gap + c * (cell + gap) + cell / 2;
        const cy = 40 + gap + r * (cell + gap) + cell / 2;
        let color = '#21262d'; // ცარიელი
        if (state.board[r][c] === 1) color = '#58a6ff'; // ლურჯი (P1)
        if (state.board[r][c] === 2) color = '#bc8cff'; // იასამნისფერი (P2)
        
        svg += `\n  <circle cx="${cx}" cy="${cy}" r="${cell/2 - 2}" fill="${color}" stroke="#30363d" stroke-width="2" />`;
    }
}

let statusText = `Next Move: Player ${state.currentPlayer} ${state.currentPlayer === 1 ? '(Blue)' : '(Purple)'}`;
let textColor = state.currentPlayer === 1 ? '#58a6ff' : '#bc8cff';

if (state.winner !== 0) {
    statusText = `🏆 Player ${state.winner} Wins! Click any column to restart.`;
    textColor = '#39d353';
} else if (state.isDraw) {
    statusText = "It's a Draw! Click any column to restart.";
    textColor = '#ffbd2e';
}

svg += `\n  <text x="${width/2}" y="25" fill="${textColor}" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">${statusText}</text>`;
svg += `\n</svg>`;

if (!fs.existsSync('dist')) fs.mkdirSync('dist');
fs.writeFileSync('dist/connect4.svg', svg);
console.log('Connect 4 SVG generated successfully!');
