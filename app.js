import express from 'express';
import historicoInflacao from './dados.js';
const app = express();


const filtra = (ano) => {
    if (ano) {
        return historicoInflacao.filter(ipca => ipca.ano == ano);
    } else {
        return historicoInflacao;
    }
}

app.get('/historicoIPCA', (req, res) => {
    const ipcaAno = parseInt(req.query.ano); 
    const resultado = filtra(ipcaAno);
    res.json(resultado);
});

app.listen(8080, () => {
    console.log('Servidor iniciado às ' + new Date().getHours());
});