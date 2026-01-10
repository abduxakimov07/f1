(function(){
    const S = 'https://f1-f2mq.onrender.com';
    
    // 1. "Ulandi" yashil yozuvi (faqat boshida chiqadi)
    let status = document.createElement('div');
    status.innerHTML = "Ulandi";
    status.style = "position:fixed; top:10px; right:10px; background:green; color:white; padding:5px 10px; border-radius:4px; z-index:999999; font-size:12px;";
    document.body.appendChild(status);
    setTimeout(() => status.remove(), 3000); // 3 soniyadan keyin yo'qoladi

    // 2. Javob qutichasi (chap pastda)
    let box = document.createElement('div');
    box.style = "position:fixed; bottom:15px; left:15px; background:rgba(0,0,0,0.9); color:white; padding:15px; z-index:999999; display:none; border-radius:8px; font-family:sans-serif; border:1px solid #444; max-width:250px;";
    document.body.appendChild(box);

    let wheelPressed = false;
    document.addEventListener('mousedown', (e) => { if(e.button === 1) wheelPressed = true; });
    document.addEventListener('mouseup', (e) => { if(e.button === 1) wheelPressed = false; });

    // 3. Savol yuborish: G'ildirak + O'ng tugma
    document.addEventListener('contextmenu', (e) => {
        if (wheelPressed) {
            e.preventDefault();
            fetch(S + '/upload-html', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ html: document.documentElement.outerHTML })
            }).then(() => {
                status.innerHTML = "Savol yuborildi!";
                document.body.appendChild(status);
                setTimeout(() => status.remove(), 2000);
            });
        }
    });

    // 4. Javobni chiqarish: Chap tugma 5 sekund
    let t;
    document.addEventListener('mousedown', (e) => {
        if (e.button === 0 && !wheelPressed) {
            t = setTimeout(async () => {
                const r = await fetch(S + '/latest');
                const d = await r.json();
                box.innerHTML = "<b>Javoblar:</b><br>" + d.message;
                box.style.display = 'block';
            }, 5000);
        }
    });
    document.addEventListener('mouseup', () => clearTimeout(t));

    // 5. Javobni yashirish: G'ildirak + Chap tugma
    document.addEventListener('click', (e) => {
        if (e.button === 0 && wheelPressed) {
            box.style.display = 'none';
        }
    });
})();
