const faqRouter = require('express').Router();
const faqController = require("../controllers/faqController");

faqRouter.post("/faq", faqController.getResposta);

module.exports = faqRouter;