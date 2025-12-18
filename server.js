const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.static(__dirname)); 
app.use(express.json({ limit: '50mb' }));

// HTMLni qabul qilish va faylga saqlash
app.post('/upload-html', (req, res) => {
    const fileName = `sahifa_${Date.now()}.html`;
    const filePath = path.join(__dirname, fileName);

    fs.writeFile(filePath, req.body.html, (err) => {
        if (err) {
            console.error("Faylni saqlashda xato:", err);
            return res.json({ success: false });
        }
        console.log(`✅ Yangi sahifa saqlandi: ${fileName}`);
        res.json({ success: true });
    });
});

// Saqlangan barcha fayllarni ko'rish uchun ro'yxat
app.get('/files', (req, res) => {
    fs.readdir(__dirname, (err, files) => {
        const htmlFiles = files.filter(f => f.endsWith('.html'));
        let listItems = htmlFiles.map(f => `<li><a href="/${f}" target="_blank">${f}</a></li>`).join('');
        res.send(`
            <html>
            <head><title>Saqlangan Sahifalar</title></head>
            <body>
                <h1>Kelgan sahifalar ro'yxati</h1>
                <ul>${listItems || "Hozircha fayllar yo'q"}</ul>
            </body>
            </html>
        `);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server yoqildi: ${PORT}`));
