// دالة لتوليد الكلمات الاستردادية
function generateRecoveryWords() {
    const words = ["apple", "orange", "banana", "grape", "mango", "lemon", "berry", "kiwi", "peach", "plum", "fig", "melon"];
    let recoveryPhrase = [];
    for (let i = 0; i < 12; i++) {
        recoveryPhrase.push(words[Math.floor(Math.random() * words.length)]);
    }
    return recoveryPhrase.join(" ");
}

// دالة لتوليد عنوان محفظة يتوافق مع شبكة TON
function generateWalletAddress() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let address = "EQ";  // بداية العنوان تكون "EQ" لشبكة TON
    for (let i = 0; i < 48; i++) {  // العنوان يتكون من 48 حرفًا بعد "EQ"
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
}

// دالة للتحقق من تنسيق البريد الإلكتروني
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// دالة للتأكد من أن البريد الإلكتروني واسم المستخدم غير موجودين مسبقًا
function isEmailOrUsernameTaken(email, username) {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // التحقق من وجود البريد الإلكتروني أو اسم المستخدم في قائمة المستخدمين
    return existingUsers.some(user => user.email === email || user.username === username);
}

// دالة للتسجيل
document.getElementById("registerButton").onclick = function() {
    const email = prompt("Enter your email:");
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");
    const confirmPassword = prompt("Re-enter your password:");

    if (email && username && password && confirmPassword) {
        // التحقق من أن البريد الإلكتروني بتنسيق صحيح
        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // التحقق من أن البريد الإلكتروني واسم المستخدم غير موجودين مسبقًا
        if (isEmailOrUsernameTaken(email, username)) {
            alert("Email or Username is already taken. Please try another one.");
        } else {
            if (password === confirmPassword) {
                // تخزين بيانات المستخدم الجديدة
                const newUser = {
                    email: email,
                    username: username,
                    password: password,
                    walletAddress: generateWalletAddress(),
                    recoveryWords: generateRecoveryWords(),
                    balance: 0,
                };

                const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
                existingUsers.push(newUser);
                localStorage.setItem("users", JSON.stringify(existingUsers));

                alert("Registration successful!");
                showWallet(newUser);
            } else {
                alert("Passwords do not match. Please try again.");
            }
        }
    } else {
        alert("Please fill in all fields.");
    }
};

// دالة لتسجيل الدخول
document.getElementById("loginButton").onclick = function() {
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");

    // البحث عن المستخدم في قائمة المستخدمين المخزنة
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = existingUsers.find(user => user.username === username && user.password === password);

    if (user) {
        alert("Login successful!");
        localStorage.setItem("loggedIn", true); // تخزين حالة تسجيل الدخول
        localStorage.setItem("loggedInUser", JSON.stringify(user)); // تخزين بيانات المستخدم المسجل
        showWallet(user);
    } else {
        alert("Incorrect username or password.");
    }
};

// دالة لإظهار المحفظة بعد تسجيل الدخول
function showWallet(user) {
    document.querySelector(".auth-section").style.display = "none";
    document.querySelector(".wallet-section").style.display = "block";
    document.getElementById("walletAddressDisplay").textContent = user.walletAddress;
    updateBalance(user);
    updateMiningTimer();
}

// دالة لتحديث الرصيد
function updateBalance(user) {
    document.getElementById("balance").textContent = "Balance: " + user.balance + " AqsaCoins";
}

// بدء دورة التعدين مع مؤقت 8 ساعات
document.getElementById("mineButton").onclick = function() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        const lastMiningTime = localStorage.getItem("lastMiningTime");
        const now = Date.now();

        // تحقق من أن وقت التعدين السابق قد مر عليه 8 ساعات
        if (!lastMiningTime || now - lastMiningTime >= 8 * 60 * 60 * 1000) {
            // بدء التعدين: إضافة 10 عملات للمستخدم
            loggedInUser.balance += 10;
            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
            localStorage.setItem("lastMiningTime", now);

            alert("Mining successful! You earned 10 AqsaCoins.");

            // تحديث الرصيد
            updateBalance(loggedInUser);

            // تحديث مؤقت التعدين
            updateMiningTimer();
        } else {
            alert("You can mine again after 8 hours.");
        }
    }
};

// تحديث وقت التعدين المتبقي
function updateMiningTimer() {
    const lastMiningTime = localStorage.getItem("lastMiningTime");
    if (lastMiningTime) {
        const now = Date.now();
        const remainingTime = 8 * 60 * 60 * 1000 - (now - lastMiningTime);
        if (remainingTime > 0) {
            document.getElementById("miningTimer").textContent = "Next mining available in: " + formatTime(remainingTime);
            setTimeout(updateMiningTimer, 1000);  // إعادة التحديث كل ثانية
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
document.getElementById("sendCoinsButton").onclick = function() {
    const recipientAddress = prompt("Enter the recipient's wallet address:");
    const amount = parseInt(prompt("Enter the amount of AqsaCoins to send:"));

    // تحقق من المدخلات
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (recipientAddress && amount && amount > 0 && amount <= loggedInUser.balance) {
        loggedInUser.balance -= amount;
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        alert(`Successfully sent ${amount} AqsaCoins to ${recipientAddress}`);

        // تحديث الرصيد
        updateBalance(loggedInUser);
    } else {
        alert("Invalid address or insufficient balance.");
    }
};

// زر تسجيل الخروج
document.getElementById("logoutButton").onclick = function() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loggedInUser");
    document.querySelector(".wallet-section").style.display = "none";
    document.querySelector(".auth-section").style.display = "block";
    alert("Logged out successfully.");
};

// التحقق من حالة تسجيل الدخول عند تحميل الصفحة
window.onload = function() {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn) {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        showWallet(user);
        updateMiningTimer(); // تحديث وقت التعدين عند تحميل الصفحة
    } else {
        document.querySelector(".auth-section").style.display = "block";
        document.querySelector(".wallet-section").style.display = "none";
    }
};
