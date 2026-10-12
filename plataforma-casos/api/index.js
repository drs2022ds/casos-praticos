// Vercel: todas as rotas /api/* são encaminhadas para aqui (ver vercel.json).
module.exports = (req, res) => require("../lib/app").handle(req, res);
