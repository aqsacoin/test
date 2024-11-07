// Simulate login status
let loggedIn = false;

// Function to check login status
function isLoggedIn() {
    return loggedIn;
}

// Set up the wallet section when logged in
function setupWalletPage() {
    const walletAddress = "YourWalletAddress123"; // Placeholder address
    document.getElementById("walletAddress").textContent = `Wallet Address: ${walletAddress}`;
    
    // Start mining timer
    let timeLeft = 24 * 60 * 60; // 24 hours in seconds
    const miningTimer = document.getElementById("miningTimer");

    const timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            miningTimer.textContent = "Mining completed!";
        } else {
            timeLeft--;
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            miningTimer.textContent = `Mining Timer: ${hours}:${minutes}:${seconds}`;
        }
    }, 1000);
}

// Show login/register buttons or wallet section based on login status
window.onload = function() {
    if (isLoggedIn()) {
        document.querySelector(".auth-buttons").style.display = "none";
        document.querySelector(".wallet-section").style.display = "block";
        setupWalletPage();
    } else {
        document.querySelector(".auth-buttons").style.display = "block";
        document.querySelector(".wallet-section").style.display = "none";
    }
};

// Register button event
document.getElementById("registerButton").onclick = function() {
    alert("Register button clicked. Registration not yet implemented.");
};

// Login button event
document.getElementById("loginButton").onclick = function() {
    alert("Login button clicked. Logging in...");
    loggedIn = true;
    document.querySelector(".auth-buttons").style.display = "none";
    document.querySelector(".wallet-section").style.display = "block";
    setupWalletPage();
};

// Start Mining button event
document.getElementById("startMiningButton").onclick = function() {
    alert("Mining started!");
};
