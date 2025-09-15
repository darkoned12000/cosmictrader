
// This function resets the lottery state for a new game
// ES6 Module export
export function resetLotteryState() {
    game.lottery.isActive = false;
    game.lottery.stage = 'pick';
    game.lottery.userNumbers = [];
    game.lottery.drawnNumbers = [];
    game.lottery.spinningIntervals.forEach(clearInterval);
    game.lottery.spinningIntervals = [];
    game.lottery.currentDrawingDigitIndex = 0;
    game.lottery.matches = 0;
    game.lottery.winnings = 0;
    game.lottery.playsThisPeriod = 0;
    game.lottery.lastPlayPeriodResetMoveCount = 0;
}


// This function checks if the lottery play counter should be reset
function checkLotteryPeriodReset() {
    if (game.moveCount >= game.lottery.lastPlayPeriodResetMoveCount + LOTTERY_PLAYS_RESET_INTERVAL_MOVES) {
        if (game.lottery.playsThisPeriod >= game.lottery.maxPlaysPerPeriod) {
            displayConsoleMessage("Lottery plays for the current period have been reset!", "minor");
        }
        game.lottery.playsThisPeriod = 0;
        game.lottery.lastPlayPeriodResetMoveCount = game.moveCount;
    }
}


// This puts the cursor in the first box during the lottery play
function focusLotteryInput() {
    const firstInput = document.getElementById('lotto-digit-0');
    if (firstInput) {
        firstInput.focus();
    }
}

function generateLotteryUI() {
    let html = `<div style="padding:10px; text-align:center;">`;
    const ticketCost = game.lottery.ticketCost;

    switch (game.lottery.stage) {
        case 'pick':
            html += `<h3>Pick 6 Unique Lucky Digits (0-9)</h3>`;
            html += `<p style="font-size:11px;">Enter one digit per box. Use Tab or click to navigate.</p>`; // Updated instruction
            html += `<div id="lottery-inputs" style="margin: 15px 0;">`; // Added some margin
            for (let i = 0; i < 6; i++) {
                const currentValue = game.lottery.userNumbers[i] !== undefined ? game.lottery.userNumbers[i] : '';
                // Apply the new class. Added maxlength="1" and oninput for auto-tabbing (optional enhancement)
                html += `<input type="text" pattern="[0-9]" inputmode="numeric" class="lottery-input-digit" id="lotto-digit-${i}" value="${currentValue}" maxlength="1" style="/* Inline styles removed as they are in CSS now */" oninput="handleLotteryDigitInput(this, ${i})">`;
            }
            html += `</div>`;
            html += `<div id="lottery-message-area" style="color: #ffae42; height: 20px; margin-bottom:10px; font-size: 12px;"></div>`;
            html += `<button onclick="triggerAction('lotterySubmitNumbers')" style="margin-right: 10px;">Submit Numbers (Cost: ${ticketCost}cr)</button>`;
            html += `<button onclick="triggerAction('lotteryExit')">Cancel & Exit Lottery</button>`;
            break;

        case 'drawing':
            html += `<h3>Drawing Lottery Numbers...</h3>`;
            html += `<p>Your Numbers: <span style="color: #76ff03;">${game.lottery.userNumbers.join(' ')}</span></p>`;
            html += `<div id="lottery-draw-area" style="font-size: 24px; letter-spacing: 10px; margin: 20px 0; height: 30px; line-height: 30px;">`;
            for (let i = 0; i < 6; i++) {
                html += `<span id="drawn-digit-${i}" style="display:inline-block; width: 30px; border-bottom: 1px solid #0f0;">?</span>`;
            }
            html += `</div>`;
            html += `<p style="font-size:11px;"><em>Spinning in progress... please wait.</em></p>`;
            // No buttons here, waits for animation to complete
            break;

        case 'results':
            html += `<h3>Lottery Results!</h3>`;
            html += `<p>Your Numbers: <span style="color: #76ff03;">${game.lottery.userNumbers.join(' ')}</span></p>`;
            let drawnDisplay = "";
            game.lottery.drawnNumbers.forEach(drawnNum => {
                if (game.lottery.userNumbers.includes(drawnNum)) { // Check if string is in array of strings
                    drawnDisplay += `<span style="color: lime; font-weight:bold; border: 1px solid lime; padding: 2px;">${drawnNum}</span> `;
                } else {
                    drawnDisplay += `<span style="border: 1px solid #555; padding: 2px;">${drawnNum}</span> `;
                }
            });
            html += `<p>Drawn Numbers: ${drawnDisplay.trim()}</p>`;
            html += `<hr style="border-color:#050;">`;
            html += `<p>You matched: <strong>${game.lottery.matches}</strong> number(s)!</p>`;
            if (game.lottery.winnings > 0) {
                html += `<p style="color: lime; font-weight:bold;">Congratulations! You won ${game.lottery.winnings} credits!</p>`;
            } else {
                html += `<p>Sorry, no prize this time. Better luck next draw!</p>`;
            }
            // Prize tier messages
            if (game.lottery.matches === 6) html += `<p style="color: yellow;">🎉🎉🎉 JACKPOT!!! 🎉🎉🎉</p>`;
            else if (game.lottery.matches === 5) html += `<p style="color: yellow;">🎉 Incredible! 5 Matches! 🎉</p>`;
            else if (game.lottery.matches === 4) html += `<p style="color: #76ff03;">Excellent! 4 Matches!</p>`;
            else if (game.lottery.matches === 3) html += `<p>Well done! 3 Matches.</p>`;

			// 3 tries disable play again
			const canPlayAgain = game.lottery.playsThisPeriod < game.lottery.maxPlaysPerPeriod && game.player.credits >= game.lottery.ticketCost;
            const playsLeftForDisplay = game.lottery.maxPlaysPerPeriod - game.lottery.playsThisPeriod;

            html += `<div style="margin-top: 20px;">`
            // Conditionally disable "Play Again" button
            html += `<button onclick="triggerAction('lotteryPlayAgain')" style="margin-right: 10px;" ${!canPlayAgain ? 'disabled' : ''}>Play Again (Cost: ${ticketCost}cr)</button>`;
            if (playsLeftForDisplay <=0 && canPlayAgain == false) { // Show why it might be disabled if not due to credits
                 html += `<span style="font-size:10px;">(No plays left this period)</span>`
            }
            html += `<button onclick="triggerAction('lotteryExit')" style="margin-left:10px;">Return to Port Services</button>`;
            html += `</div>`;
            break;
    }
    html += `</div>`;
    return html;
}


function handleLotteryNumberSubmission() {
    const inputs = [];
    const userNumbersSet = new Set();
    let isValid = true;
    const messageArea = document.getElementById('lottery-message-area');
    if(messageArea) messageArea.textContent = ''; // Clear previous messages

    for (let i = 0; i < 6; i++) {
        const inputEl = document.getElementById(`lotto-digit-${i}`);
        const val = inputEl.value;
        if (val === '' || !/^[0-9]$/.test(val)) {
            if(messageArea) messageArea.textContent = 'Error: Please enter a single digit (0-9) in each box.';
            isValid = false;
            break;
        }
        inputs.push(val);
        userNumbersSet.add(val);
    }

    if (isValid && inputs.length !== 6) {
        if(messageArea) messageArea.textContent = 'Error: Please enter exactly 6 numbers.';
        isValid = false;
    }

    if (isValid && userNumbersSet.size !== 6) {
        if(messageArea) messageArea.textContent = 'Error: All 6 numbers must be unique.';
        isValid = false;
    }

    if (isValid) {
        if (game.player.credits < game.lottery.ticketCost) {
            if(messageArea) messageArea.textContent = `Error: Insufficient credits. Ticket costs ${game.lottery.ticketCost}cr.`;
            playSoundEffect('error');
            return;
        }

        // --- THIS IS THE CRITICAL PART ---
        game.player.credits -= game.lottery.ticketCost;
        game.lottery.playsThisPeriod++; // <<< --- ENSURE THIS LINE IS PRESENT AND EXECUTED
        // --- END CRITICAL PART ---

        game.lottery.userNumbers = inputs;
        // Now the console message will use the updated playsThisPeriod count
        displayConsoleMessage(`Lottery ticket purchased for ${game.lottery.ticketCost}cr. Plays this period: ${game.lottery.playsThisPeriod}/${game.lottery.maxPlaysPerPeriod}. Your numbers: ${inputs.join(', ')}`, 'success', 'trade_buy');

        game.lottery.stage = 'drawing';
        updateUI();
        startLotteryDrawAnimation();
    } else {
        playSoundEffect('error');
        // Error message already set by validation checks in the UI
    }
}


function startLotteryDrawAnimation() {
    game.lottery.drawnNumbers = [];
    game.lottery.spinningIntervals.forEach(clearInterval);
    game.lottery.spinningIntervals = [];
    game.lottery.currentDrawingDigitIndex = 0;

    // --- NEW: Generate 6 unique drawn numbers from 0-9 ---
    let availableDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = 0; i < 6; i++) {
        if (availableDigits.length === 0) break; // Should not happen if drawing 6 from 10
        const randomIndex = getRandomInt(0, availableDigits.length - 1);
        const pickedDigit = availableDigits.splice(randomIndex, 1)[0]; // Pick and remove
        game.lottery.drawnNumbers.push(pickedDigit);
    }
    // Now game.lottery.drawnNumbers contains 6 unique digits (as strings)

    drawNextLotteryDigitWithAnimation(); // Proceed with animation using pre-generated numbers
}

function drawNextLotteryDigitWithAnimation() {
    if (game.lottery.currentDrawingDigitIndex >= 6) {
        calculateLotteryResults();
        return;
    }

    const digitIndex = game.lottery.currentDrawingDigitIndex;
    const digitSpan = document.getElementById(`drawn-digit-${digitIndex}`);
    if (!digitSpan) {
        console.error(`Lottery draw span drawn-digit-${digitIndex} not found!`);
        return;
    }

    const spinDurationMs = 1800;
    const spinRefreshIntervalMs = 75;
    let spinFrames = 0;
    const maxSpinFrames = Math.floor(spinDurationMs / spinRefreshIntervalMs);

    // Clear any previous interval for this span, just in case
    if(game.lottery.spinningIntervals[digitIndex]) clearInterval(game.lottery.spinningIntervals[digitIndex]);

    game.lottery.spinningIntervals[digitIndex] = setInterval(() => {
        if (spinFrames >= maxSpinFrames) {
            clearInterval(game.lottery.spinningIntervals[digitIndex]);

            // Reveal the pre-generated unique digit
            const finalDigit = game.lottery.drawnNumbers[digitIndex];

            if (game.lottery.userNumbers.includes(finalDigit)) {
                digitSpan.innerHTML = `<span style="color: lime; font-weight:bold;">${finalDigit}</span>`;
            } else {
                digitSpan.textContent = finalDigit;
            }
            digitSpan.style.borderColor = '#080';

            game.lottery.currentDrawingDigitIndex++;
            drawNextLotteryDigitWithAnimation();
            return;
        }
        digitSpan.textContent = String(getRandomInt(0, 9));
        spinFrames++;
    }, spinRefreshIntervalMs);
}


function calculateLotteryResults() {
    game.lottery.matches = 0;
    const userNumSet = new Set(game.lottery.userNumbers); // For efficient lookup

    // Count matches - drawn numbers can repeat, so check each drawn against user's unique set
    // If drawn numbers should also be unique, the drawing logic would need adjustment.
    // For now, let's count how many of the *user's chosen unique numbers* appear in the drawn sequence.
    // A more typical lottery counts how many of the unique winning numbers the user picked.
    // Let's adjust to match the Python: user picks unique, drawn can have repeats.
    // We count how many of the *drawn* numbers are present in the *user's* chosen set.

    // Create a frequency map of drawn numbers if drawn numbers can repeat and we only count each user number match once.
    // Example: User picks 1,2,3,4,5,6. Drawn: 1,1,7,8,9,0. Matches = 1 (for the number '1').
    // The Python example counts distinct drawn numbers that are in the user's set.
    // If drawn are [1,1,2,3,4,5] and user picked [1,2,0,0,0,0], matches = 2 (for 1 and 2)

    let tempUserNumbers = [...game.lottery.userNumbers]; // Copy for mutable check
    game.lottery.drawnNumbers.forEach(drawnNum => {
        const indexInUserPicks = tempUserNumbers.indexOf(drawnNum);
        if (indexInUserPicks !== -1) {
            game.lottery.matches++;
            tempUserNumbers.splice(indexInUserPicks, 1); // Remove matched number to ensure it's not counted again if drawn multiple times
        }
    });

    game.lottery.winnings = game.lottery.prizeTiers[game.lottery.matches] || 0;

    if (game.lottery.winnings > 0) {
        game.player.credits += game.lottery.winnings;
        displayConsoleMessage(`Lottery win! You won ${game.lottery.winnings}cr for ${game.lottery.matches} matches!`, 'success', 'trade_buy');
    } else {
         displayConsoleMessage(`Lottery draw complete. ${game.lottery.matches} matches. No prize this time.`, 'minor');
    }

    game.lottery.stage = 'results';
    updateUI(); // Show the results screen
}


function handleLotteryDigitInput(currentInput, currentIndex) {
    // Ensure only a single digit 0-9 is kept
    currentInput.value = currentInput.value.replace(/[^0-9]/g, '');
    if (currentInput.value.length > 1) {
        currentInput.value = currentInput.value.charAt(0);
    }

    // Auto-tab to next input if a digit is entered and it's not the last input
    if (currentInput.value.length === 1 && currentIndex < 5) {
        const nextInput = document.getElementById(`lotto-digit-${currentIndex + 1}`);
        if (nextInput) {
            nextInput.focus();
            nextInput.select(); // Optional: select the content of the next input
        }
    }
}
