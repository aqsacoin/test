// تنفيذ عملية التسجيل
document.getElementById("registerButton").onclick = function() {
    // تحقق من إدخال بيانات المستخدم
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");
    if (username && password) {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        alert("Registration successful!");
        showWallet();
    } else {
        alert("Please enter both username and password.");
    }
};

// تنفيذ عملية تسجيل الدخول
document.getElementById("loginButton").onclick = function() {
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");
    if (username === localStorage.getItem("username") && password === localStorage.getItem("password")) {
        alert("Login successful!");
        showWallet();
    } else {
        alert("Incorrect username or password.");
    }
};

// عرض المحفظة وإنشاء كلمات الاسترداد
function showWallet() {
    document.querySelector(".wallet-section").style.display = "block";

    // توليد عنوان المحفظة
    const walletAddress = "0x" + Math.random().toString(36).substr(2, 40);
    document.getElementById("walletAddress").textContent = walletAddress;

    // توليد كلمات استرداد عشوائية
    const words = generateRecoveryWords();
    document.getElementById("recoveryWords").textContent = words.join(" ");
}

// وظيفة توليد كلمات استرداد عشوائية
function generateRecoveryWords() {
    const wordsList = ["apple", "banana", "orange", "grape", "mango", "pear", "peach", "cherry", "kiwi", "melon", "berry", "plum"];
    let recoveryWords = [];
    for (let i = 0; i < 12; i++) {
        recoveryWords.push(wordsList[Math.floor(Math.random() * wordsList.length)]);
    }
    return recoveryWords;
}

// إخفاء المحفظة عند بداية الصفحة
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".wallet-section").style.display = "none";
});
