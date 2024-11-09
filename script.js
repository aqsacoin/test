// توليد 12 كلمة استرداد عشوائية
function generateRecoveryWords() {
    const words = ["apple", "orange", "banana", "grape", "mango", "lemon", "berry", "kiwi", "peach", "plum", "fig", "melon"];
    let recoveryPhrase = [];
    for (let i = 0; i < 12; i++) {
        recoveryPhrase.push(words[Math.floor(Math.random() * words.length)]);
    }
    return recoveryPhrase.join(" ");
}

// توليد عنوان محفظة يتوافق مع شبكة TON
function generateWalletAddress() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let address = "EQ";  // بداية العنوان تكون "EQ" لشبكة TON
    for (let i = 0; i < 48; i++) {  // العنوان يتكون من 48 حرفًا بعد "EQ"
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
}

// توليد العقد الذكي والعمليات المتعلقة به
async function contractOperations() {
    // عقد ذكي لاسترجاع الرصيد من الشبكة
    async function getBalance(address) {
        // استدعاء دالة من العقد الذكي لاسترجاع الرصيد
        return await smartContract.getBalance(address); // استبدال هذا بالسطر المناسب لمشروعك
    }

    // عقد ذكي للقيام بعملية التعدين
    async function mineCoins() {
        const lastMiningTime = localStorage.getItem("lastMiningTime");
        const now = Date.now();

        if (!lastMiningTime || now - lastMiningTime >= 8 * 60 * 60 * 1000) {
            // إجراء التعدين عبر العقد الذكي
            const minedCoins = await smartContract.mine(10); // تعدين 10 عملات
            localStorage.setItem("balance", (parseInt(localStorage.getItem("balance") || 0) + minedCoins).toString());
            localStorage.setItem("lastMiningTime", now);
            updateBalance();
            updateMiningTimer();
            alert("Mining successful! You have mined 10 AqsaCoins.");
        } else {
            const remainingTime = 8 * 60 * 60 * 1000 - (now - lastMiningTime);
            alert("You need to wait " + formatTime(remainingTime) + " for the next mining cycle.");
        }
    }

    // عقد ذكي لإرسال العملات
    async function sendCoins(recipientAddress, amount) {
        const senderAddress = localStorage.getItem("walletAddress");

        // تحقق من رصيد المرسل
        const senderBalance = await getBalance(senderAddress);
        if (senderBalance >= amount) {
            // تنفيذ المعاملة عبر العقد الذكي
            const result = await smartContract.transfer(senderAddress, recipientAddress, amount);
            alert(`Successfully sent ${amount} AqsaCoins to ${recipientAddress}.`);
            updateBalance();
        } else {
            alert("Insufficient balance.");
        }
    }

    // دوال إضافية أخرى مثل التحقق من حالة التعدين، الرصيد، والتحويلات ستحتاج إلى التنفيذ عبر العقد الذكي.

    return {
        getBalance,
        mineCoins,
        sendCoins
    };
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
            const walletAddress = generateWalletAddress(); // استخدام دالة توليد عنوان محفظة TON
            const recoveryWords = generateRecoveryWords();
            localStorage.setItem("walletAddress", walletAddress);
            localStorage.setItem("recoveryWords", recoveryWords);
            localStorage.setItem("balance", 0); // رصيد البداية 0

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
        localStorage.setItem("loggedIn", true);  // تغيير من sessionStorage إلى localStorage
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

// بدء دورة التعدين مع مؤقت 8 ساعات
document.getElementById("mineButton").onclick = async function() {
    const contract = await contractOperations();
    contract.mineCoins(); // دالة التعدين عبر العقد الذكي
};

// تحديث وقت التعدين المتبقي
function updateMiningTimer() {
    const lastMiningTime = localStorage.getItem("lastMiningTime");
    if (lastMiningTime) {
        const now = Date.now();
        const remainingTime = 8 * 60 * 60 * 1000 - (now - lastMiningTime);
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

// زر إرسال العملات
document.getElementById("sendCoinsButton").onclick = async function() {
    const recipientAddress = prompt("Enter the recipient's wallet address:");
    const amount = parseInt(prompt("Enter the amount of AqsaCoins to send:"));

    // تحقق من المدخلات
    if (recipientAddress && amount && amount > 0 && amount <= parseInt(localStorage.getItem("balance") || 0)) {
        const contract = await contractOperations();
        contract.sendCoins(recipientAddress, amount);  // إرسال العملات عبر العقد الذكي
    } else {
        alert("Invalid address or insufficient balance.");
    }
};

// زر تسجيل الخروج
document.getElementById("logoutButton").onclick = function() {
    localStorage.removeItem("loggedIn");  // تغيير من sessionStorage إلى localStorage
    document.querySelector(".wallet-section").style.display = "none";
    document.querySelector(".auth-section").style.display = "block";
    alert("Logged out successfully.");
};
