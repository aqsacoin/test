// توليد 12 كلمة استرداد عشوائية
function generateRecoveryWords() {
    const words = ["apple", "orange", "banana", "grape", "mango", "lemon", "berry", "kiwi", "peach", "plum", "fig", "melon"];
    let recoveryPhrase = [];
    for (let i = 0; i < 12; i++) {
        recoveryPhrase.push(words[Math.floor(Math.random() * words.length)]);
    }
    return recoveryPhrase.join(" ");
}

// توليد عنوان محفظة طويل
function generateWalletAddress() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let address = "AQSA-";
    for (let i = 0; i < 16; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
}

// زر التسجيل
document.getElementById("registerButton").onclick = function() {
    const email = prompt("Enter your email:");
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");
    const confirmPassword = prompt("Re-enter your password:");

    if (email && username && password && confirmPassword) {
        if (password === confirmPassword) {
            localStorage.setItem("email", email);
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);

            // إنشاء عنوان محفظة وكلمات الاسترداد
            const walletAddress = generateWalletAddress();
            const recoveryWords = generateRecoveryWords();
            localStorage.setItem("walletAddress", walletAddress);
            localStorage.setItem("recoveryWords", recoveryWords);

            alert("Registration successful!");
            showWallet();
        } else {
            alert("Passwords do not match. Please try again.");
        }
    } else {
        alert("Please fill in all fields.");
    }
};

// زر تسجيل الدخول
document.getElementById("loginButton").onclick = function() {
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");

    if (username === localStorage.getItem("username") && password === localStorage.getItem("password")) {
        alert("Login successful!");
        sessionStorage.setItem("loggedIn", true);
        showWallet();
    } else {
        alert("Incorrect username or password.");
    }
};

// إظهار المحفظة عند تسجيل الدخول
function showWallet() {
    document.querySelector(".auth-section").style.display = "none";
    document.querySelector(".wallet-section").style.display = "block";
    document.getElementById("walletAddressDisplay").textContent = localStorage.getItem("walletAddress");
    updateBalance();
    updateMiningTimer();
}

// تحديث الرصيد
function updateBalance() {
    document.getElementById("balance").textContent = "Balance: " + (localStorage.getItem("balance") || 0) + " AqsaCoins";
}

// بدء دورة التعدين مع مؤقت 24 ساعة
document.getElementById("mineButton").onclick = function() {
    const lastMiningTime = localStorage.getItem("lastMiningTime");
    const now = Date.now();

    if (!lastMiningTime || now - lastMiningTime >= 24 * 60 * 60 * 1000) {
        alert("Mining started! You have mined 3 AqsaCoins.");
        localStorage.setItem("balance", (parseInt(localStorage.getItem("balance") || 0) + 3).toString());
        localStorage.setItem("lastMiningTime", now);
        updateBalance();
        updateMiningTimer();
    } else {
        const remainingTime = 24 * 60 * 60 * 1000 - (now - lastMiningTime);
        alert("You need to wait " + formatTime(remainingTime) + " for the next mining cycle.");
    }
};

// تحديث وقت التعدين المتبقي
function updateMiningTimer() {
    const lastMiningTime = localStorage.getItem("lastMiningTime");
    if (lastMiningTime) {
        const now = Date.now();
        const remainingTime = 24 * 60 * 60 * 1000 - (now - lastMiningTime);
        if (remainingTime > 0) {
            document.getElementById("miningTimer").textContent = "Next mining available in: " + formatTime(remainingTime);
            setTimeout(updateMiningTimer, 1000);
        } else {
            document.getElementById("miningTimer").textContent = "You can start mining now!";
        }
    }
}

// تنسيق الوقت المتبقي
function formatTime(ms) {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
}

// إظهار/إخفاء عنوان المحفظة
document.getElementById("walletButton").onclick = function() {
    const walletAddress = document.getElementById("walletAddress");
    walletAddress.style.display = walletAddress.style.display === "none" ? "block" : "none";
};

// إظهار/إخفاء كلمات الاسترداد
document.getElementById("recoveryToggleButton").onclick = function() {
    const recoveryWords = document.getElementById("recoveryWords");
    recoveryWords.style.display = recoveryWords.style.display === "none" ? "block" : "none";
};

// زر تسجيل الخروج
document.getElementById("logoutButton").onclick = function() {
    sessionStorage.removeItem("loggedIn");
    document.querySelector(".wallet-section").style.display = "none";
    document.querySelector(".auth-section").style.display = "block";
};

// التأكد من تسجيل الدخول عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    if (sessionStorage.getItem("loggedIn") === "true") {
        showWallet();
    } else {
        document.querySelector(".wallet-section").style.display = "none";
    }
    updateBalance();
});
