const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

let oxirgiSahifa = "<h1>Hali ma'lumot kelmadi...</h1><p>U kompyuterda skript ishlatilishini kuting.</p>";
let adminXabari = "Server aloqada!"; 

// 1. Skriptdan HTML qabul qilish
app.post('/upload-html', (req, res) => {
    let html = req.body.html;
    const baseTag = '<base href="https://lms.tuit.uz/">';
    
    // Kelgan HTMLni "Live" ko'rish uchun tayyorlash
    oxirgiSahifa = html.includes('<head>') 
        ? html.replace('<head>', `<head>${baseTag}`) 
        : baseTag + html;

    // Arxiv uchun fayl qilib saqlash
    const fileName = `sahifa_${Date.now()}.html`;
    fs.writeFile(path.join(__dirname, fileName), oxirgiSahifa, (err) => {
        if (err) console.log("Fayl saqlashda xato");
    });

    res.json({ success: true });
});

// 2. JONLI KUZATISH (Siz shu manzilni ochib o'tirasiz)
app.get('/live', (req, res) => {
    const autoRefresh = `
        <script>
            setTimeout(() => { location.reload(); }, 4000); // Har 4 soniyada yangilanadi
        </script>
    `;
    res.send(oxirgiSahifa + autoRefresh);
});

// 3. Admin Panel (Xabar yuborish va fayllar ro'yxati)
app.get('/files', (req, res) => {
    fs.readdir(__dirname, (err, files) => {
        const htmlFiles = files.filter(f => f.endsWith('.html')).reverse();
        let listItems = htmlFiles.map(f => `<li><a href="/view/${f}" target="_blank">${f}</a></li>`).join('');
        
        res.send(`
            <html>
            <body style="font-family:sans-serif; padding:20px; background:#f0f2f5;">
                <h2>Admin Panel</h2>
                <div style="background:white; padding:15px; border-radius:8px; margin-bottom:20px;">
                    <a href="/live" style="background:red; color:white; padding:10px; text-decoration:none; border-radius:5px;">🔴 JONLI KUZATISH (LIVE)</a>
                </div>
                <form action="/set-message" method="GET">
                    <input type="text" name="text" placeholder="Javoblarni yozing..." style="padding:10px; width:300px;">
                    <button type="submit" style="padding:10px; background:green; color:white; border:none; border-radius:4px;">Yuborish</button>
                </form>
                <p>Hozirgi xabar: <b>${adminXabari}</b></p>
                <hr>
                <h3>Arxiv fayllar:</h3>
                <ul>${listItems || "Fayllar yo'q"}</ul>
            </body>
            </html>
        `);
    });
});

// Boshqa kerakli yo'laklar
app.get('/latest', (req, res) => res.json({ success: true, message: adminXabari }));
app.get('/set-message', (req, res) => {
    if (req.query.text) adminXabari = req.query.text;
    res.send('Xabar yangilandi! <br><a href="/files">Orqaga</a>');
});
app.get('/view/:name', (req, res) => res.sendFile(path.join(__dirname, req.params.name)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server tayyor: ${PORT}`));
