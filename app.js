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


const calcularReajuste = (valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno) => {
    const historicoFiltrado = historicoInflacao.filter(
      historico => {
        if (dataInicialAno === dataFinalAno) {
          return historico.ano === dataInicialAno && historico.mes >= dataInicialMes && historico.mes <= dataFinalMes;
        } else {
          return (
            (historico.ano === dataInicialAno && historico.mes >= dataInicialMes) ||
            (historico.ano > dataInicialAno && historico.ano < dataFinalAno) ||
            (historico.ano === dataFinalAno && historico.mes <= dataFinalMes)
          );
        }
      }
    )};

    app.get('/historicoIPCA/calculo', (req, res) => {
        const valor = parseFloat(req.query.valor);
        const dataInicialMes = parseInt(req.query.mesInicial);
        const dataInicialAno = parseInt(req.query.anoInicial);
        const dataFinalMes = parseInt(req.query.mesFinal);
        const dataFinalAno = parseInt(req.query.anoFinal);
      
        if (validacaoErro(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno)) {
          res.status(400).json({ erro: 'Parâmetros inválidos' });
          return;
        }
    })


app.get('/historicoIPCA', (req, res) => {
    const ipcaAno = parseInt(req.query.ano); 
    const resultado = filtra(ipcaAno);
    res.json(resultado);
});

app.listen(8080, () => {
    console.log('Servidor iniciado às ' + new Date().getHours());
});