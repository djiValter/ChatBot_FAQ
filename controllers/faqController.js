function removerAcentos(texto) {
    return texto
        .normalize("NFD") // Decompõe os caracteres acentuados
        .replace(/[\u0300-\u036f]/g, ""); // Remove os diacríticos
}

const faqs = [
    { pergunta: "horário de funcionamento", resposta: "Atendemos de segunda a sábado, das 8h às 18h. Aos domingos e feriados, apenas por agendamento prévio." },
    { pergunta: "localização", resposta: "Estamos localizados na Av. Eduardo Mondlane, nº 123, Maputo. Fazemos deslocações a outras zonas mediante marcação." },
    { pergunta: "formas de pagamento", resposta: "Aceitamos M-Pesa, e-Mola, transferência bancária e pagamentos em dinheiro." },
    { pergunta: "serviços", resposta: "Prestamos serviços de montagem e reparação de portões elétricos, instalações elétricas residenciais e comerciais, e instalação de câmeras de vigilância." },
    { pergunta: "orçamento", resposta: "Os orçamentos são gratuitos! Basta enviar-nos uma breve descrição do serviço ou agendar uma visita técnica." },
    { pergunta: "contato", resposta: "Pode contactar-nos pelo WhatsApp no número +258 84 000 0000 ou pelo e-mail: suporte@empresa.com." },
    { pergunta: "prazo de instalação", resposta: "O prazo depende do tipo de serviço. Em média, portões elétricos são instalados em 2 a 4 dias úteis e câmeras em até 2 dias." },
    { pergunta: "garantia", resposta: "Oferecemos garantia de 6 meses em todos os serviços de montagem e instalação." }
];

exports.getResposta = (req, res) => {
    let perguntaUsuario = req.body.pergunta;

    if (!perguntaUsuario) {
        return res.json({ resposta: "Por favor, escreva sua dúvida para que eu possa ajudar." });
    }

    perguntaUsuario = removerAcentos(perguntaUsuario.toLowerCase());


    const faq = faqs.find(f => perguntaUsuario.includes(removerAcentos(f.pergunta.toLowerCase())));

    if (faq) {
        res.json({ resposta: faq.resposta });
    } else {
        res.json({
            resposta: "Desculpe, não entendi sua pergunta. Pode reformular ou perguntar, por exemplo: 'quais servicos oferecem?' ou 'qual o horario de funcionamento?'."
        });
    }
};
