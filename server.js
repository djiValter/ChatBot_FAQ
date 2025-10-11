const express = require('express');
const cors = require('cors');
const axios = require('axios');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Importa as rotas e controladores
const faqRouter = require('./routers/faqRouter');
const faqController = require('./controllers/faqController');

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// 🧠 Rota normal da tua API de FAQ
// ============================================
app.use('/api', faqRouter);

// ============================================
// ✅ 1️⃣ Rota de verificação do Webhook (GET)
// ============================================
app.get("/webhook", (req, res) => {
    const VERIFY_TOKEN = "meu_token_verificador"; // 🔒 define tua palavra secreta
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// ============================================
// 💬 2️⃣ Rota de recebimento de mensagens (POST)
// ============================================
app.post("/webhook", async (req, res) => {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const message = changes?.value?.messages?.[0];
        const phoneNumberId = changes?.value?.metadata?.phone_number_id;

        if (message && message.text) {
            const textoUsuario = message.text.body;

            // Usa o controlador de FAQ para obter a resposta
            const resposta = await obterRespostaFAQ(textoUsuario);

            // Envia a resposta pelo WhatsApp Cloud API
            await enviarMensagemWhatsApp(phoneNumberId, message.from, resposta);
        }

        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// ============================================
// 🤖 3️⃣ Função auxiliar: chama o controller FAQ
// ============================================
async function obterRespostaFAQ(pergunta) {
    return new Promise((resolve) => {
        const req = { body: { pergunta } };
        const res = { json: (data) => resolve(data.resposta) };
        faqController.getResposta(req, res);
    });
}

// ============================================
// 📤 4️⃣ Função auxiliar: envia mensagem ao WhatsApp
// ============================================
async function enviarMensagemWhatsApp(phoneNumberId, to, text) {
    const token = process.env.WHATSAPP_TOKEN; // 🔑 usa variável ambiente
    await axios.post(
        `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
        {
            messaging_product: "whatsapp",
            to,
            text: { body: text },
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
}

// ============================================
// 🚀 5️⃣ Inicializa o servidor
// ============================================
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
