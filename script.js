let isMining = false;
let miningTimer;
let coins = 0;
let recoveryWords = [];

document.getElementById("registerButton").addEventListener("click", function() {
    alert("Registration is not implemented yet");
});

document.getElementById("loginButton").addEventListener("click", function() {
    alert("Login is not implemented yet");
});

document.getElementById("walletButton").addEventListener("click", function() {
    generateWallet();
});

document.getElementById("startMiningButton").addEventListener("click", function() {
    startMining();
});

document.getElementById("showRecoveryButton").addEventListener("click", function() {
    document.getElementById("recoveryWords").style.display = "block";
    document.getElementById("recoveryWordsList").textContent = recoveryWords.join(", ");
});

// Generate Wallet
function generateWallet() {
    // Generate random 12 recovery words
    recoveryWords = generateRecoveryWords();
    const walletAddress = generateWalletAddress();

    // Display wallet address
    document.getElementById("walletAddress").textContent = "Wallet Address: " + walletAddress;

    // Display wallet section
    document.getElementById("walletSection").style.display = "block";
}

// Generate 12 random recovery words (example words)
function generateRecoveryWords() {
    const words = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon", "mango", "nectarine"];
    let selectedWords = [];
    for (let i = 0; i < 12; i++) {
        selectedWords.push(words[Math.floor(Math.random() * words.length)]);
    }
    return selectedWords;
}

// Generate random wallet address (dummy address for now)
function generateWalletAddress() {
    const address = "AQSA-" + Math.random().toString(36).substring(2, 15);
    return address;
}

// Start Mining
function startMining() {
    if (!isMining) {
        isMining = true;
        document.getElementById("startMiningButton").textContent = "Stop Mining";
        startMiningTimer();
    } else {
        isMining = false;
        document.getElementById("startMiningButton").textContent = "Start Mining";
        stopMiningTimer();
    }
}

// Start mining timer (24 hours)
function startMiningTimer() {
    const countdownElement = document.getElementById("countdown");

    let timeLeft = 24 * 60 * 60; // 24 hours in seconds
    miningTimer = setInterval(function() {
        if (timeLeft <= 0) {
            clearInterval(miningTimer);
            alert("Mining cycle complete!");
            coins += 3; // Adding 3 coins after each mining cycle
            document.getElementById("coinCount").textContent = coins;
            document.getElementById("countdown").textContent = "00:00:00";
            return;
        }

        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;

        countdownElement.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        timeLeft--;
    }, 1000);
}

// Stop mining timer
function stopMiningTimer() {
    clearInterval(miningTimer);
}

// Pad numbers for timer format
function pad(num) {
    return num < 10 ? "0" + num : num;
}
