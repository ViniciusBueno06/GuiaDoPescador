const btn_login = document.getElementById("btn_acao_login");
/////////////////////
const user = "admin";
const senha = "123";
////////////////////

btn_login.addEventListener("click", async () => {
    let userIns = document.getElementById("inp_user").value;
    let senhaIns = document.getElementById("inp_senha").value;

    if (userIns === user && senhaIns === senha) {
        window.location.href = 'http://10.111.9.49:5501/front-end/home.html';
    } else {
        alert("Senha incorreta");
    }
});



// function _Byid(id) {
//     return document.getElementById(id)
//   };
//   function _getValue(id) {
//     return _Byid(id).value
//   };
  