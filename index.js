const dotenv = require('dotenv');
dotenv.config();
const app_port = process.env.HTTP_SERVER_PORT;
const app_access_token = process.env.ACCESS_TOKEN_SECRET;
const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const qrCode = require('qrcode')
const whatsapp = require("./whatsapp");
const api = require("./routes/api");
const web = require("./routes/web");

wsClient = whatsapp.client;

io.on("connection", async (socket) => {
    wsClient.on('qr', async qr => {
        const qrImage = await qrCode.toDataURL(qr, { width: 500 });
        console.log(qr);
        socket.emit('qr_code', { data: qrImage })
    });
});

server.listen(app_port, () => {
    console.log('listening on http://0.0.0.0:' + app_port);
});

app.use(express.json());

app.use(function (req, res, next) {
    const api_key = req.query.api_key;
    if (app_access_token !== api_key) {
        return res.status(401).json({ error: 'unauthorized' });
    }
    next();
});

app.use("/", web);

app.use(function (req, res, next) {
    if (!whatsapp.is_authenticated) {
        return res.status(500).json({ error: 'Error sending message, try again later' });
    }

    next();
});


app.use("/api", api);
