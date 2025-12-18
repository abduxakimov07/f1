const fs = require('fs'); // Fayllar bilan ishlash uchun

app.post('/upload-html', (req, res) => {
    const htmlContent = req.body.html;
    const fileName = `page_${Date.now()}.html`; // Har bir kelgan sahifaga vaqt bilan nom beradi

    fs.writeFile(fileName, htmlContent, (err) => {
        if (err) console.log("Xato:", err);
        else console.log(`Sahifa saqlandi: ${fileName}`);
    });

    res.json({ success: true });
});
