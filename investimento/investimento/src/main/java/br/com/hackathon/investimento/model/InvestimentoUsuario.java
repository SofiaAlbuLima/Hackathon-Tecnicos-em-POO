package br.com.hackathon.investimento.model;

import java.sql.Date;
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
public class InvestimentoUsuario {
    @NotNull
    private Long idUsuario;
    @NotNull
    private Long idInvestimento;
    @NotNull
    private Double coeficienteAngular;
    @NotNull
    private Date dataInicio;
}

