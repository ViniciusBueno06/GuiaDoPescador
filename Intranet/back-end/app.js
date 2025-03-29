const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')

const app = express()
app.use(cors()) 

const porta = 3000
app.use(bodyParser.json())

app.listen(porta, () => {
    console.log(`O servidor está rodando http://localhost:${porta}`)
})

// criar uma pool de conexão
const pool = mysql.createPool({
    host: ``, //ip da maquina
    user: `root`,
    password: '',
    database: `db_node`,
    waitForConnections:true,
    connectionLimit: 3,
    queueLimit: 0
})

// 01 ROTA CADASTRAR PEIXE
app.post("/api/cadastro_peixe", async(req, res) => {
    try {
        const {
            nome_peixe, desc_peixe, isca_pref, desc_isca, local_pesca, profundidade, tecnica, img_peixe, 
            peso, tamanho, epoca, horario, anzol 
        } = req.body
        
        const conexao = await pool.getConnection()
        const sql = `INSERT INTO peixes (
            nome_peixe, desc_peixe, isca_pref, desc_isca, local_pesca, profundidade, tecnica, img_peixe, 
            peso, tamanho, epoca, horario, anzol
        ) VALUES (
            "${nome_peixe}", "${desc_peixe}", "${isca_pref}", "${desc_isca}", "${local_pesca}", 
            "${profundidade}", "${tecnica}", "${img_peixe}", "${peso}", "${tamanho}", 
            "${epoca}", "${horario}", "${anzol}"
        )`
        
        console.log(sql)
        const [linhas] = await conexao.execute(sql)
        conexao.release()
        res.json({msg: "Registro cadastrado!"})

    } catch (error) {
        console.log(`O Erro que ocorreu foi :${error}`)
        res.status(500).json({error: "Deu algum erro no cadastro"})
    }
})
