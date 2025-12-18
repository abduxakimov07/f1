const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.static(__dirname)); 
app.use(express.json({ limit: '50mb' }));

let adminXabari = "Server aloqada!"; // Ikkinchi kompyuterga ko'rinadigan xabar

// 1. Ikkinchi kompyuterdan HTML qabul qilish
app.post('/upload-html', (req, res) => {
    const fileName = `sahifa_${Date.now()}.html`;
    fs.writeFile(path.join(__dirname, fileName), req.body.html, (err) => {
        if (err) console.log("Xato:", err);
        else console.log(`✅ Saqlandi: ${fileName}`);
    });
    res.json({ success: true });
});

// 2. Ikkinchi kompyuter 3 soniya bosib turganda xabarni olib ketishi uchun
app.get('/latest', (req, res) => {
    res.json({ success: true, message: adminXabari });
});

// 3. Siz (Admin) xabar yuborishingiz uchun yo'lak
app.get('/set-message', (req, res) => {
    const msg = req.query.text;
    if (msg) {
        adminXabari = msg;
        res.send(`<h1>Xabar o'zgartirildi: ${adminXabari}</h1><br><a href="/files">Orqaga qaytish</a>`);
    } else {
        res.send("Xabar matni yo'q!");
    }
});

// 4. Admin Paneli (Fayllarni ko'rish va xabar yozish)
app.get('/files', (req, res) => {
    fs.readdir(__dirname, (err, files) => {
        const htmlFiles = files.filter(f => f.endsWith('.html')).reverse();
        let listItems = htmlFiles.map(f => `<li><a href="/${f}" target="_blank">${f}</a></li>`).join('');
        
        res.send(`
            <html>
            <head>
                <title>Admin Panel</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; background: #f4f4f4; }
                    .box { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    input { padding: 10px; width: 300px; border: 1px solid #ccc; border-radius: 4px; }
                    button { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
                </style>
            </head>
            <body>
                <div class="box">
                    <h1>Admin Panel</h1>
                    <h3>Foydalanuvchiga xabar yuborish:</h3>
                    <form action="/set-message" method="GET">
                        <input type="text" name="text" placeholder="Xabarni shu yerga yozing..." required>
                        <button type="submit">Xabarni yangilash</button>
                    </form>
                    <p>Hozirgi xabar: <b>${adminXabari}</b></p>
                    <hr>
                    <h3>Kelgan sahifalar ro'yxati:</h3>
                    <ul>${listItems || "Hozircha fayllar yo'q"}</ul>
                </div>
            </body>
            </html>
        `);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT}-portda tayyor`));
