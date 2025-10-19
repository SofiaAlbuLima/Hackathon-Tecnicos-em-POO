package br.com.hackathon.investimento.dao;

import java.sql.Date;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.springframework.stereotype.Repository;

import br.com.hackathon.investimento.model.InvestimentoUsuario;

@Repository
@RegisterBeanMapper(InvestimentoUsuario.class)
public interface InvestimentoUsuarioDao {

    @SqlUpdate("INSERT INTO InvestimentoUsuario (idUsuario, idInvestimento, coeficienteAngular, dataInicio) "
             + "VALUES (:idUsuario, :idInvestimento, :coeficienteAngular, :dataInicio)")
    void insert(@BindBean InvestimentoUsuario iu);

    @SqlQuery("SELECT * FROM InvestimentoUsuario WHERE idUsuario = :idUsuario AND idInvestimento = :idInvestimento")
    InvestimentoUsuario get(@Bind("idUsuario") Long idUsuario, @Bind("idInvestimento") Long idInvestimento);
}
