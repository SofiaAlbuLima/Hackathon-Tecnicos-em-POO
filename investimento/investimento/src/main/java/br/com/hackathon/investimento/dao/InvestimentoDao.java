package br.com.hackathon.investimento.dao;
import java.util.List;

import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import br.com.hackathon.investimento.model.Investimento;

@Repository
@RegisterBeanMapper(Investimento.class)
public interface InvestimentoDao {

    @GetGeneratedKeys
    @SqlUpdate("INSERT INTO Investimento (valorInicial, valorMensal, duracaoEmAnos, objetivo, relacaoInvestimento, perfil) "
             + "VALUES (:valorInicial, :valorMensal, :duracaoEmAnos, :objetivo, :relacaoInvestimento, :perfil)")
    Long insert(@BindBean Investimento investimento);

    @SqlQuery("SELECT * FROM Investimento WHERE idInvestimento = :idInvestimento")
    Investimento get(@Bind("idInvestimento") Long idInvestimento);

    @SqlQuery("SELECT * FROM Investimento ORDER BY dataCriacao DESC")
    List<Investimento> getAll();
    
    @SqlQuery("SELECT i.* FROM Investimento i "
            + "JOIN InvestimentoUsuario iu ON i.idInvestimento = iu.idInvestimento "
            + "WHERE iu.idUsuario = :idUsuario "
            + "ORDER BY i.dataCriacao DESC")
    List<Investimento> getByUsuario(@Bind("idUsuario") Long idUsuario);
}