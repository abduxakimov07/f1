const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

let adminXabari = "Hali javob yo'q"; 

// Sahifani qabul qilish
app.post('/upload-html', (req, res) => {
    const html = req.body.html;
    const fileName = `sahifa_${Date.now()}.html`;
    fs.writeFile(path.join(__dirname, fileName), html, (err) => {
        if (err) console.log("Xato saqlashda");
    });
    res.json({ success: true });
});

// Admin Panel (Fayllarni ko'rish va SMS yuborish)
app.get('/files', (req, res) => {
    fs.readdir(__dirname, (err, files) => {
        const htmlFiles = files.filter(f => f.endsWith('.html')).reverse();
        let listItems = htmlFiles.map(f => `<li><a href="/view/${f}" target="_blank">${f}</a></li>`).join('');
        res.send(`
            <html>
            <body style="padding:20px; font-family:sans-serif;">
                <h2>Admin Panel</h2>
                <form action="/set-message" method="GET">
                    <input type="text" name="text" style="padding:10px; width:300px;" placeholder="Javobni yozing...">
                    <button type="submit" style="padding:10px;">SMS Yuborish</button>
                </form>
                <p>Yuborilgan xabar: <b>${adminXabari}</b></p>
                <hr>
                <h3>Kelgan savollar:</h3>
                <ul>${listItems}</ul>
            </body>
            </html>
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
