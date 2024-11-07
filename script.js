// وظيفة إنشاء المحفظة وتوليد كلمات الاسترداد
function generateWallet() {
    const mnemonic = bip39.generateMnemonic();  // توليد كلمات الاسترداد
    const walletAddress = generateWalletAddress();  // توليد عنوان المحفظة الفريد
    document.getElementById('walletAddress').textContent = walletAddress;  // عرض عنوان المحفظة
    document.getElementById('mnemonic').textContent = mnemonic;  // عرض كلمات الاسترداد
    document.getElementById('mnemonic').style.display = 'none';  // إخفاء كلمات الاسترداد بشكل افتراضي
}

// توليد عنوان محفظة فريد
function generateWalletAddress() {
    return 'AQSA-' + Math.random().toString(36).substring(2, 15);  // يولد عنوان عشوائي للمحفظة
}

// إظهار كلمات الاسترداد
function showMnemonic() {
    document.getElementById('mnemonic').style.display = 'block';  // إظهار كلمات الاسترداد
}

// إضافة أحداث للأزرار
document.getElementById('generateWalletButton').addEventListener('click', generateWallet);
document.getElementById('showMnemonicButton').addEventListener('click', showMnemonic);

// تسجيل الدخول
document.getElementById('loginButton').addEventListener('click', function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (email && password) {
        alert('تم تسجيل الدخول بنجاح');
        // هنا يمكن إضافة الكود الفعلي لتسجيل الدخول
    } else {
        alert('يرجى إدخال البريد الإلكتروني وكلمة السر');
    }
});

// التسجيل
document.getElementById('signupButton').addEventListener('click', function() {
    const email = document.getElementById('signupEmail').value;
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (email && username && password && confirmPassword) {
        if (password === confirmPassword) {
            alert('تم التسجيل بنجاح');
            // هنا يمكن إضافة الكود الفعلي لتسجيل المستخدم في قاعدة البيانات
        } else {
            alert('كلمة السر غير متطابقة');
        }
    } else {
        alert('يرجى تعبئة جميع الحقول');
    }
});

// التعدين
let miningInterval;
document.getElementById('startMiningButton').addEventListener('click', function() {
    document.getElementById('miningStatus').textContent = 'بدأ التعدين...';
    let timeLeft = 24 * 60 * 60;  // 24 ساعة بالثواني
    miningInterval = setInterval(function() {
        timeLeft--;
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        document.getElementById('miningStatus').textContent = `التعدين مستمر: ${hours}:${minutes}:${seconds}`;
        if (timeLeft <= 0) {
            clearInterval(miningInterval);
            document.getElementById('miningStatus').textContent = 'تم التعدين بنجاح!';
        }
    }, 1000);
});
