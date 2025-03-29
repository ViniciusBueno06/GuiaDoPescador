const URL_API = "http://localhost:3000"
// --------------------------------------BOTÕES---------------------------------------------------
//Botões de abrir a tela
const btn_tela_excluir = document.getElementById("btn_tela_excluir")

// Botões de ação dentro de cada DIV
const btn_cadastro = document.getElementById("btn_acao_add");

// ---------------------------------------------cadastrar--------------------------------------------------
btn_cadastro.addEventListener("click", async () => {
  let nome_peixe = _getValue("inp_nomepeixe");
  let desc_peixe = _getValue("inp_desc");
  let isca_pref = _getValue("inp_isca");
  let desc_isca = _getValue("inp_desc_isca");
  let local_pesca = _getValue("inp_local");
  let profundidade = _getValue("inp_profundidade");
  let tecnica = _getValue("inp_tecnica");
  let img_peixe = _getValue("inp_imagem");
  let peso = _getValue("inp_peso");
  let tamanho = _getValue("inp_tamanho");
  let epoca = _getValue("inp_epoca");
  let horario = _getValue("inp_horario");
  let anzol = _getValue("inp_anzol");

  let dados = await fetch(URL_API + "/api/cadastro_peixe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome_peixe: nome_peixe,
      desc_peixe: desc_peixe,
      isca_pref: isca_pref,
      desc_isca: desc_isca,
      local_pesca: local_pesca,
      profundidade: profundidade,
      tecnica: tecnica,
      img_peixe: img_peixe,
      peso: peso,
      tamanho: tamanho,
      epoca: epoca,
      horario: horario,
      anzol: anzol
    })
  });

//   _setValue("inp_nomepeixe", "")
//   _setValue("inp_desc", "")
//   _setValue("inp_isca", "")
//   _setValue("inp_desc_isca", "")
//   _setValue("inp_local", "")
//   _setValue("inp_profundidade", "")
//   _setValue("inp_tecnica", "")
//   _setValue("inp_imagem", "")
//   _setValue("inp_peso", "")
//   _setValue("inp_tamanho", "")
//   _setValue("inp_epoca", "")
//   _setValue("inp_horario", "")
//   _setValue("inp_anzol", "")
})

function _Byid(id) {
    return document.getElementById(id);
}

function _getValue(id) {
    return _Byid(id).value;
}

function _setValue(id, value) {
    _Byid(id).value = value;
}
