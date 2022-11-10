import dotenv from 'dotenv'
dotenv.config();
import express from "express"
import http from 'http'
import { Server } from "socket.io"
import qrCode from 'qrcode'
import whatsapp from "./whatsapp"
import api from "./routes/api"
import web from "./routes/web";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const appAccessToken = process.env.ACCESS_TOKEN_SECRET;
const appPort = process.env.HTTP_SERVER_PORT;
const wsClient = whatsapp.client;

io.on("connection", async (socket) => {
    wsClient.on('qr', async qr => {
        const qrImage = await qrCode.toDataURL(qr, { width: 500 });
        // console.log(qr);
        socket.emit('qr_code', { data: qrImage })
    });
});

server.listen(appPort, () => {
    // console.log('listening on http://0.0.0.0:' + appPort);
});

app.use(express.json());

app.use((req, res, next) => {
    const api_key = req.query.api_key;
    if (appAccessToken !== api_key) {
        return res.status(401).json({ error: 'unauthorized' });
    }
    next();
});

app.use("/", web);

app.use((req, res, next) => {
    if (!whatsapp.is_authenticated) {
        return res.status(500).json({ error: 'Error sending message, try again later' });
    }

    next();
});


app.use("/api", api);
