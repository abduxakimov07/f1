const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

let adminXabari = "Hali javob yo'q"; 

// 1. Skriptdan kelgan HTMLni qabul qilish
app.post('/upload-html', (req, res) => {
    let html = req.body.html;
    // Dizayn buzilmasligi uchun base tegini qo'shamiz
    const baseTag = '<base href="https://lms.tuit.uz/">';
    html = html.replace('<head>', `<head>${baseTag}`);

    const fileName = `sahifa_${Date.now()}.html`;
    fs.writeFile(path.join(__dirname, fileName), html, (err) => {
        if (err) console.log("Saqlashda xato");
    });
    res.json({ success: true });
});

// 2. Admin Panel (Fayllar va SMS yuborish qismi)
app.get('/files', (req, res) => {
    fs.readdir(__dirname, (err, files) => {
        const htmlFiles = files.filter(f => f.endsWith('.html')).reverse();
        let listItems = htmlFiles.map(f => `<li><a href="/view/${f}" target="_blank">${f}</a></li>`).join('');
        res.send(`
            <body style="padding:20px; font-family:sans-serif; background:#f4f4f4;">
                <h2>Admin Panel</h2>
                <div style="background:white; padding:15px; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                    <form action="/set-message" method="GET">
                        <input type="text" name="text" style="padding:10px; width:70%;" placeholder="Javoblarni bu yerga yozing...">
                        <button type="submit" style="padding:10px; cursor:pointer;">SMS Yuborish</button>
                    </form>
                    <p>Hozirgi xabar: <b style="color:blue;">${adminXabari}</b></p>
                </div>
                <hr>
                <h3>Kelgan Savollar (Arxiv):</h3>
                <ul>${listItems || "Hali fayl kelmadi"}</ul>
            </body>
        `);
    });
});

app.get('/latest', (req, res) => res.json({ message: adminXabari }));

app.get('/set-message', (req, res) => {
    if (req.query.text) adminXabari = req.query.text;
    res.redirect('/files');
});

app.get('/view/:name', (req, res) => res.sendFile(path.join(__dirname, req.params.name)));

app.listen(process.env.PORT || 3000);
