const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

const faqRouter = require('./routers/faqRouter');

app.use(cors());
app.use(express.json());

app.use('/api', faqRouter);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})

module.exports = app;