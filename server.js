const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static(__dirname)); // Bu qator papkadagi fayllarni brauzerga ochib beradi
app.use(express.json({ limit: '50mb' })); // Katta sahifalarni sig'dirish uchun

app.post('/upload-html', (req, res) => {
    console.log("--- Yangi HTML ma'lumot keldi ---");
    console.log(req.body.html.substring(0, 500) + "..."); // Konsolda boshlanishini ko'rish
    res.json({ success: true });
});

app.get('/latest', (req, res) => {
    res.json({ success: true, message: "Server aloqada!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlayapti`));
