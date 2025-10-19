package br.com.hackathon.investimento.model;

import java.sql.Timestamp;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Investimento {
    private Long idInvestimento;
    @NotNull
    private Double valorInicial;
    private Double valorMensal;
    @NotNull
    private Integer duracaoEmAnos;
    @NotNull
    private Integer objetivo;
    @NotNull
    private Integer relacaoInvestimento;
    @NotNull
    private String perfil; // conservador, moderado, sofisticado
    private Timestamp dataCriacao;
}
