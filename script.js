// تخزين معلومات المستخدم
function saveUserData(username, walletAddress, recoveryWords) {
    localStorage.setItem("username", username);
    localStorage.setItem("walletAddress", walletAddress);
    localStorage.setItem("recoveryWords", JSON.stringify(recoveryWords));
}

// استرجاع بيانات المستخدم
function loadUserData() {
    const username = localStorage.getItem("username");
    const walletAddress = localStorage.getItem("walletAddress");
    const recoveryWords = JSON.parse(localStorage.getItem("recoveryWords"));
    return { username, walletAddress, recoveryWords };
}

// التحقق من تسجيل الدخول
function isLoggedIn() {
    return !!localStorage.getItem("username");
}

// إعداد صفحة المحفظة بعد تسجيل الدخول
function setupWalletPage() {
    const userData = loadUserData();
    document.getElementById("walletAddress").textContent = `Wallet Address: ${userData.walletAddress}`;
    document.querySelector(".auth-buttons").style.display = "none";
    document.querySelector(".wallet-section").style.display = "block";
}

// إنشاء محفظة جديدة
function generateWallet() {
    const walletAddress = "wallet_" + Math.random().toString(36).substr(2, 9);
    const recoveryWords = Array.from({ length: 12 }, () => Math.random().toString(36).substr(2, 5));
    return { walletAddress, recoveryWords };
}

// معالجة التسجيل
document.getElementById("registerButton").onclick = function() {
    const username = prompt("Enter a username:");
    if (username) {
        const { walletAddress, recoveryWords } = generateWallet();
        saveUserData(username, walletAddress, recoveryWords);
        alert("Registration successful! Your recovery words are: " + recoveryWords.join(" "));
        setupWalletPage();
    }
};

// معالجة تسجيل الدخول
document.getElementById("loginButton").onclick = function() {
    const username = prompt("Enter your username:");
    const savedUsername = localStorage.getItem("username");
    if (username === savedUsername) {
        alert("Login successful!");
        setupWalletPage();
    } else {
        alert("User not found. Please register.");
    }
};

// التحقق من حالة تسجيل الدخول عند تحميل الصفحة
window.onload = function() {
    if (isLoggedIn()) {
        setupWalletPage();
    }
};

// بدء دورة التعدين
document.getElementById("startMiningButton").onclick = function() {
    startMiningCycle();
};

function startMiningCycle() {
    let timer = 86400; // 24 hours in seconds
    const miningTimer = document.getElementById("miningTimer");

    const interval = setInterval(function() {
        const hours = Math.floor(timer / 3600);
        const minutes = Math.floor((timer % 3600) / 60);
        const seconds = timer % 60;
        
        miningTimer.innerHTML = `Next mining cycle in: ${hours}:${minutes}:${seconds}`;
        
        if (timer <= 0) {
            clearInterval(interval);
            miningTimer.innerHTML = "Mining ready! Click to mine again.";
            // هنا يمكن إضافة كود لتحديث رصيد المستخدم بعد انتهاء دورة التعدين
        }
        timer--;
    }, 1000);
}
