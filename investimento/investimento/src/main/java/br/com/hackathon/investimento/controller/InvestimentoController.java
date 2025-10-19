package br.com.hackathon.investimento.controller;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.hackathon.investimento.model.Investimento;
import br.com.hackathon.investimento.model.InvestimentoUsuario;
import br.com.hackathon.investimento.service.InvestimentoService;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.TimeUnit; // Importado para timeouts
import org.springframework.http.HttpStatus; // Importado para status de erro
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/s1/investimento")
@CrossOrigin(origins = "*")
public class InvestimentoController {

    private final InvestimentoService investimentoService;

    public InvestimentoController(InvestimentoService investimentoService) {
        this.investimentoService = investimentoService;
    }

    @PostMapping("/{idUsuario}/{valorFinalPessimista}")
    public ResponseEntity<Investimento> inserir(
            @RequestBody Investimento investimento,
            @PathVariable Long idUsuario,
            @PathVariable double valorFinalPessimista) 
    {
        return ResponseEntity.ok(investimentoService.inserir(investimento, idUsuario, valorFinalPessimista));
    }
    

    @GetMapping("/{idUsuario}/{idInvestimento}/consultar/{dataConsulta}")
    public ResponseEntity<Double> consultarValor(
            @PathVariable Long idUsuario,
            @PathVariable Long idInvestimento,
            @PathVariable String dataConsulta) 
    {
        LocalDate data = LocalDate.parse(dataConsulta);
        return ResponseEntity.ok(investimentoService.consultarValor(idUsuario, idInvestimento, data));
    }
    
    
    
    @GetMapping("/{idUsuario}/{idInvestimento}/consultarEsperado/{dataConsulta}")
    public ResponseEntity<Double> consultarEsperado(
            @PathVariable Long idUsuario,
            @PathVariable Long idInvestimento,
            @PathVariable String dataConsulta) 
    {
        LocalDate data = LocalDate.parse(dataConsulta);
        return ResponseEntity.ok(investimentoService.valorEsperado(idUsuario, idInvestimento, data));
    }

    @GetMapping({"/", ""})
    public ResponseEntity<List<Investimento>> consultarTodos() {
        return ResponseEntity.ok(investimentoService.consultarTodos());
    }
    
    @GetMapping("/detalhes/{idInvestimento}")
    public ResponseEntity<Investimento> consultarDetalhesInvestimento(
            @PathVariable Long idInvestimento) 
    {
        return ResponseEntity.ok(investimentoService.getInvestimento(idInvestimento));
    }
    
    @GetMapping("/usuario/{idUsuario}/detalhes/{idInvestimento}")
    public ResponseEntity<InvestimentoUsuario> consultarDetalhesInvestimentoUsuario(
            @PathVariable Long idUsuario,
            @PathVariable Long idInvestimento) 
    {
        return ResponseEntity.ok(investimentoService.getInvestimentoUsuario(idUsuario, idInvestimento));
    }
    
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Investimento>> consultarPorUsuario(
            @PathVariable Long idUsuario) 
    {
        return ResponseEntity.ok(investimentoService.consultarPorUsuario(idUsuario));
    }
    
    
}