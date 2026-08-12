// Ano dinâmico no rodapé
(function () {
  var el = document.getElementById('ano');
  if (el) el.textContent = new Date().getFullYear();
})();

// Contador de vagas — SÓ roda onde o bloco tem o atributo data-countdown
// (variante B). No controle (index.html) o número fica estático.
// Começa a cair quando o bloco entra na tela, perde 1 vaga a cada ~3s e
// trava no mínimo. Persiste em localStorage pra não voltar pra 20 no reload.
(function () {
  var INICIO = 20;
  var MINIMO = 3;
  var KEY = 'musaEliteVagasRestantes';

  var count = document.querySelector('.scarcity-count[data-countdown]');
  if (!count || !count.firstChild) return;

  var vagas = INICIO;
  try {
    var salvo = parseInt(localStorage.getItem(KEY), 10);
    if (salvo >= MINIMO && salvo <= INICIO) vagas = salvo;
  } catch (e) {}

  function render() { count.firstChild.nodeValue = String(vagas); }
  function salvar() { try { localStorage.setItem(KEY, String(vagas)); } catch (e) {} }

  render();

  var rodando = false;
  function agendar() {
    // ~3s com leve variação, pra queda parecer orgânica
    setTimeout(tick, 2400 + Math.random() * 1500);
  }
  function tick() {
    if (vagas <= MINIMO) return;
    vagas -= 1;
    render();
    salvar();
    if (vagas > MINIMO) agendar();
  }
  function iniciar() {
    if (rodando || vagas <= MINIMO) return;
    rodando = true;
    agendar();
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          iniciar();
          io.disconnect();
          break;
        }
      }
    }, { threshold: 0.4 });
    io.observe(count);
  } else {
    iniciar();
  }
})();
