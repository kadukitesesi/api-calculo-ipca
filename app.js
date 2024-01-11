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


export const validacaoErro = (valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno) => {
    const anoLimiteFinal = historicoInflacao[historicoInflacao.length - 1].ano;
    const anoLimiteInicial = historicoInflacao[0].ano
    const mesLimiteFinal = historicoInflacao[historicoInflacao.length - 1].mes;
    if (
      isNaN(valor) ||
      isNaN(dataInicialMes) ||
      isNaN(dataInicialAno) ||
      isNaN(dataFinalMes) ||
      isNaN(dataFinalAno) ||
      dataInicialMes < 1 || dataInicialMes > 12 ||
      dataInicialAno < anoLimiteInicial || dataInicialAno > anoLimiteFinal ||
      dataFinalMes < 1 || dataFinalMes > 12 ||
      dataFinalAno < anoLimiteInicial || dataFinalAno > anoLimiteFinal ||
      (dataFinalAno === anoLimiteFinal && dataFinalMes > mesLimiteFinal) ||
      dataFinalAno < dataInicialAno ||
      (dataFinalAno == dataInicialAno && dataFinalMes < dataInicialMes)
    ) {
      return true;
    } else {
      return false;
    }
  };


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