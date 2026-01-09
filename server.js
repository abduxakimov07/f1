const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

let adminXabari = "Hali javob yo'q";

app.post('/upload-html', (req, res) => {
    let html = req.body.html;
    const baseTag = '<base href="https://lms.tuit.uz/">';
    html = html.replace('<head>', `<head>${baseTag}`);
    const fileName = `sahifa_${Date.now()}.html`;
    fs.writeFile(path.join(__dirname, fileName), html, (err) => {
        if (err) console.log("Xato");
    });
    res.json({ success: true });
});

app.get('/files', (req, res) => {
    fs.readdir(__dirname, (err, files) => {
        const htmlFiles = files.filter(f => f.endsWith('.html')).reverse();
        let listItems = htmlFiles.map(f => `<li><a href="/view/${f}" target="_blank">${f}</a></li>`).join('');
        res.send(`<h2>Admin Panel</h2>
            <form action="/set-message" method="GET">
                <input type="text" name="text" placeholder="Javobni yozing...">
                <button type="submit">Yuborish</button>
            </form>
            <p>SMS: <b>${adminXabari}</b></p><hr>
            <ul>${listItems}</ul>`);
    });
});

app.get('/latest', (req, res) => res.json({ message: adminXabari }));
app.get('/set-message', (req, res) => {
    if (req.query.text) adminXabari = req.query.text;
    res.redirect('/files');
});
app.get('/view/:name', (req, res) => res.sendFile(path.join(__dirname, req.params.name)));
app.listen(process.env.PORT || 3000);
