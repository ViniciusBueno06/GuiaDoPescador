const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')


const ip_maquina = 'localhost'
const porta = 3000

const app = express()
app.use(bodyParser.json());
const crypto = require('crypto');

app.use(express.json())

app.listen(porta, () => {
    console.log(`O servidor está rodando http://${ip_maquina}:${porta}`);
});

// criar uma pool de conexão
const pool = mysql.createPool({
    host: `localhost`,
    user: 'root',
    port: 3306,
    password: '',
    database: 'db_node',
    // waitForConnections: true,
    // connectionLimit: 3,
    // queueLimit: 0
})

///////////////////////////////////////////////////////////////////////////////////////////////////////
app.post("/api/atualizar_usuario", async (req, res) => {
    const { id_user, nome, senha } = req.body;
  
    try {
      const conexao = await pool.getConnection();
      let sql = 'UPDATE cadastro_usuario SET nome = ?';
      let params = [nome];
  
      // Se uma nova senha foi fornecida, atualiza também a senha
      if (senha) {
        const hash = crypto.createHash('SHA256').update(senha).digest('hex');
        sql += ', senha = ?';
        params.push(hash);
      }
  
      sql += ' WHERE id = ?';
      params.push(id_user);
  
      await conexao.execute(sql, params);
      conexao.release();
  
      res.status(200).json({ msg: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({ error: 'Erro ao atualizar perfil.' });
    }
  });
  
  app.get("/api/anzol_opcoes", async (req, res) => {
    try {
        const conexao = await pool.getConnection();
        const sql = "SELECT DISTINCT anzol FROM peixes ORDER BY anzol";
        const [linha] = await conexao.execute(sql);
        conexao.release();

        // Enviando a resposta para o cliente
        res.json(linha.map(row => row.anzol));
    } catch (error) {
        console.error("Erro ao buscar opções de anzol:", error);
        res.status(500).json({ message: "Erro ao buscar opções de anzol." });
    }
});


//////////////////////////////////////////////////////////////

app.post("/api/validar_senha", async (req, res) => {
    const { id_user, senha_atual } = req.body;
  
    try {
      const conexao = await pool.getConnection();
      const hash = crypto.createHash('SHA256').update(senha_atual).digest('hex');
      const sql = `SELECT * FROM cadastro_usuario WHERE id = ? AND senha = ?`;
      const [linha] = await conexao.execute(sql, [id_user, hash]);
      conexao.release();
  
      if (linha.length === 1) {
        return res.status(200).json({ msg: "Senha atual válida" });
      } else {
        return res.status(400).json({ msg: "Senha atual incorreta" });
      }
    } catch (error) {
      console.error("Erro ao validar senha atual:", error);
      res.status(500).json({ error: "Erro ao validar senha" });
    }
  });
  

/////////////////////////////////////////////////////////////

app.get("/api/get_imagem_perfil", async (req, res) => {
    const { id_user } = req.query;
  
    try {
      const conexao = await pool.getConnection();
      const sql = `SELECT imagem_perfil FROM cadastro_usuario WHERE id = ?`;
      const [linha] = await conexao.execute(sql, [id_user]);
      conexao.release();
  
      if (linha.length > 0) {
        console.log({ imagem_perfil: linha[0].imagem_perfil })
        // Supondo que a imagem esteja armazenada como nome do arquivo no banco
        res.json({ imagem_perfil: linha[0].imagem_perfil });
      } else {
        res.status(404).json({ error: 'Imagem de perfil não encontrada.' });
      }
    } catch (error) {
      console.error("Erro ao buscar imagem de perfil:", error);
      res.status(500).json({ error: "Erro ao buscar imagem de perfil." });
    }
  });

/////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/api/atualizar_foto_perfil", async (req, res) => {
    const { id_user, imagem_perfil } = req.body;

    try {
        const conexao = await pool.getConnection();
        const sql = `UPDATE cadastro_usuario SET imagem_perfil = ? WHERE id = ?`;
        await conexao.execute(sql, [imagem_perfil, id_user]);
        conexao.release();
        res.json({ msg: "Foto de perfil atualizada com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar foto de perfil:", error);
        res.status(500).json({ error: "Erro interno ao atualizar foto de perfil" });
    }
});



app.post("/api/cadastro_usuario", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const conexao = await pool.getConnection();
        const hash = crypto.createHash("SHA256").update(senha).digest("hex");

        const sql = `INSERT INTO cadastro_usuario (nome, email, senha) VALUES (?, ?, ?)`;
        await conexao.execute(sql, [nome, email, hash]);
        conexao.release();
        res.json({ msg: "Registro cadastrado!" });
    } catch (error) {
        console.log(`O Erro que ocorreu foi: ${error}`);
        res.status(500).json({ error: "Deu algum erro no cadastro" });
    }
});



app.get('/api/favoritos', async (req, res) => {
    console.log('Rota /api/favoritos acessada');
    const conexao = await pool.getConnection();
    const userId = req.query.id_user;

    const sql = `
        SELECT *
        FROM favoritos f
        JOIN peixes p ON f.id_peixe = p.id
        WHERE f.id_user = ${userId}
    `;

    const [linha] = await conexao.execute(sql)
    conexao.release()
    res.json(linha);    

});




app.post("/api/verificar_email", async (req, res) => {
    const { email } = req.body;

    try {
        const conexao = await pool.getConnection();
        const sql = `SELECT * FROM cadastro_usuario WHERE email = lower(?)`;
        const [linha] = await conexao.execute(sql, [email]);
        conexao.release();

        if (linha.length > 0) {
            return res.status(409).json({ msg: "Email já está em uso." });
        }
        return res.status(200).json({ msg: "Email disponível." });
    } catch (error) {
        console.error("Erro ao verificar email:", error);
        return res.status(500).json({ error: "Erro interno ao verificar email." });
    }
});


app.post("/api/login", async (req, res) => {
    try {
        const { email, senha } = req.body;
        const conexao = await pool.getConnection();
        const hash = crypto.createHash("SHA256").update(senha).digest("hex");
        const sql = `SELECT * FROM cadastro_usuario WHERE email = lower(?) AND senha = ?`;
        const [linha] = await conexao.execute(sql, [email, hash]);
        conexao.release();

        if (linha.length === 1) {
            res.status(200).json({ msg: "Login é valido!", login: `${email}`, nome: `${linha[0]['nome']}`, id_user: `${linha[0]['id']}` });
        } else {
            res.status(401).json({ msg: "Login ou senha inválidos!" });
        }
    } catch (error) {
        console.error("Erro ao autenticar usuário:", error);
        res.status(500).json({ error: "Erro interno ao processar login" });
    }
});



app.get("/api/buscapeixe", async (req, res) => {

    try {

        const conexao = await pool.getConnection();
        const sql = `SELECT * FROM peixes`
        const [linha] = await conexao.execute(sql);
        conexao.release();
        // Enviando a resposta para o cliente
        res.json(linha);

    } catch (error) {

        console.error(error);
        // Retornando uma mensagem de erro para o cliente
        res.status(500).json({ message: 'Erro ao buscar peixes' });

    }

});




app.post("/add_fav", async (req, res) => {

    const { id_user, id_peixe } = req.body
    console.log(id_user)

    try {

        const conexao = await pool.getConnection();
        const sql = `INSERT INTO favoritos (id_user,id_peixe) VALUES ("${id_user}","${id_peixe}")`
        const [linha] = await conexao.execute(sql);
        conexao.release();
        res.json(linha)

    } catch (error) {

        console.error(error);
        // Retornando uma mensagem de erro para o cliente
        res.status(500).json({ message: 'Erro ao buscar peixes' });

    }

})
app.post("/tirar_fav", async (req, res) => {

    const { id_user, id_peixe } = req.body
    try {

        const conexao = await pool.getConnection();
        const sql = `DELETE FROM favoritos WHERE id_user = ${id_user} AND id_peixe=${id_peixe};`
        const [linha] = await conexao.execute(sql);
        conexao.release();
        res.json(linha);

    } catch (error) {
        console.error(error);
        // Retornando uma mensagem de erro para o cliente
        res.status(500).json({ message: 'Erro ao buscar peixes' });
    }

})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/verificar_fav/", async (req, res) => {
    const { id_user, id_peixe } = req.query;
    console.log(id_user, id_peixe)

    try {
        const estado = true
        const conexao = await pool.getConnection();
        const sql = `SELECT * FROM favoritos WHERE id_user = ${id_user} AND id_peixe=${id_peixe}`
        console.log(sql)
        const [linha] = await conexao.execute(sql);
        if (linha.length === 0) {
            conexao.release()
            return res.status(404).json(!estado)
        } else {
            conexao.release()
            res.json(estado)
        }

        // console.log(linha)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar peixes' });
    }


})