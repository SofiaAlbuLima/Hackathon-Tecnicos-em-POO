package br.com.hackathon.investimento.service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.jdbi.v3.core.Jdbi;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.hackathon.investimento.dao.InvestimentoDao;
import br.com.hackathon.investimento.dao.InvestimentoUsuarioDao;
import br.com.hackathon.investimento.model.Investimento;
import br.com.hackathon.investimento.model.InvestimentoUsuario;

@Service
public class InvestimentoService {

    private final InvestimentoDao investimentoDao;
    private final InvestimentoUsuarioDao investimentoUsuarioDao;

    public InvestimentoService(Jdbi jdbi) {
        this.investimentoDao = jdbi.onDemand(InvestimentoDao.class);
        this.investimentoUsuarioDao = jdbi.onDemand(InvestimentoUsuarioDao.class);
    }

    public Investimento inserir(Investimento investimento, Long idUsuario, double valorFinalPessimista) {
        if (investimento.getIdInvestimento() != null && investimento.getIdInvestimento() != 0) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Id - informacao ilegal.");
        }

        Long idInvestimento = investimentoDao.insert(investimento);
        investimento.setIdInvestimento(idInvestimento);

        // cálculo do coeficiente angular (crescimento linear)
        double deltaY = valorFinalPessimista - investimento.getValorInicial();
        double deltaX = investimento.getDuracaoEmAnos() * 365.0;
        double coefAngular = deltaY / deltaX;

        InvestimentoUsuario iu = new InvestimentoUsuario();
        iu.setIdUsuario(idUsuario);
        iu.setIdInvestimento(idInvestimento);
        iu.setCoeficienteAngular(coefAngular);
        iu.setDataInicio(Date.valueOf(LocalDate.now()));
        investimentoUsuarioDao.insert(iu);

        return investimento;
    }

    public double consultarValor(Long idUsuario, Long idInvestimento, LocalDate dataConsulta) {
        double valorEsperado = valorEsperado(idUsuario, idInvestimento, dataConsulta);

        // gera um valor aleatório entre -10% e +10% do esperado
        double fatorAleatorio = 0.9 + Math.random() * 0.2;
        return valorEsperado * fatorAleatorio;
    }
    
    public double valorEsperado(Long idUsuario, Long idInvestimento, LocalDate dataConsulta) {
        InvestimentoUsuario iu = investimentoUsuarioDao.get(idUsuario, idInvestimento);
        Investimento investimento = investimentoDao.get(idInvestimento);

        if (iu == null || investimento == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Investimento não encontrado.");
        }

        long diasDecorridos = ChronoUnit.DAYS.between(iu.getDataInicio().toLocalDate(), dataConsulta);
        double valorEsperado = investimento.getValorInicial() + iu.getCoeficienteAngular() * diasDecorridos;
        return valorEsperado;
    }

    public List<Investimento> consultarTodos() {
        return investimentoDao.getAll();
    }
    
    public List<Investimento> consultarPorUsuario(Long idUsuario) {
        return investimentoDao.getByUsuario(idUsuario);
    }
    
    public InvestimentoUsuario getInvestimentoUsuario(Long idUsuario, Long idInvestimento) {
        InvestimentoUsuario iu = investimentoUsuarioDao.get(idUsuario, idInvestimento);
        if (iu == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Relação Investimento/Usuário não encontrada.");
        }
        return iu;
    }
    
    public Investimento getInvestimento(Long idInvestimento) {
        Investimento inv = investimentoDao.get(idInvestimento);
        if (inv == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Investimento não encontrado.");
        }
        return inv;
    }
}
