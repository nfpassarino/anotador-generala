var $$ = Dom7;
var app = new Framework7({
  root: '#app',
  name: 'My App',
  id: 'com.myapp.test',
  panel: {
      swipe: 'left',
  },
  routes: [
      { path: '/index/', url: 'index.html', },
      { path: '/anotador/', url: 'anotador.html', },
  ]
});
var mainView = app.views.create('.view-main');
var router = mainView.router;
var j1nombre = '', j2nombre = '', idjugada = '', nrojugada = '';
var jugadas = {
  PUNTAJES: '',
  UNO: [1,2,3,4,5], DOS: [2,4,6,8,10], TRES: [3,6,9,12,15], CUATRO: [4,8,12,16,20], CINCO: [5,10,15,20,25], SEIS: [6,12,18,24,30],
  ESCALERA: [20,25], FULL: [30,35], POKER: [40,45], GENERALA: [50,100], TOTAL: '',
};

// Página Inicio
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  $$('#btnComenzar').on('click', guardarNombres);
});

function guardarNombres() {
  ($$('#jugador1').val() == '') ? (j1nombre = 'Jugador 1') : (j1nombre = $$('#jugador1').val());
  ($$('#jugador2').val() == '') ? (j2nombre = 'Jugador 2') : (j2nombre = $$('#jugador2').val());
  router.navigate('/anotador/');
}

// Página anotador
$$(document).on('page:init', '.page[data-name="anotador"]', function (e) {
  crearTabla();
  $$('.popover-open').on('click', capturarJugada);
  $$('.menor').on('click', calcularJugada);
  $$('.mayor').on('click', calcularJugada);
  $$('.tachar').on('click', tacharJugada);
  $$('#btnVolver').on('click', function() {
    app.dialog.confirm('¿Quiere volver? Se perderá el progreso del juego','VOLVER A INICIO', function () {
      router.navigate('/index/');
    });
  });
  $$('#btnReiniciar').on('click', function() {
    app.dialog.confirm('¿Quiere reiniciar los puntos? Se perderá el registro de los mismos','REINICIAR PUNTOS', function () {
      $$('.popover-open').text(' - ');
      $$('.total').text('0');
    });
  });
});

function crearTabla() {
  for (var i = 0; i < Object.keys(jugadas).length; i++) {
    $$('#jugadas').append('<button class="button col" id="categoria_' + i + '" >' + Object.keys(jugadas)[i] + '</button>');
  }
  for (var i = 1; i <= 2; i++) {
    for (var j = 0; j < Object.keys(jugadas).length; j++) {
      if (j === 0) {
        $$('#j' + i + 'p').append('<button id="j' + i + '_' + j + '" class="button col">' + ((i === 1) ? j1nombre : j2nombre) + '</button>');
      } else if (j > 0 && j <= 6){
        $$('#j' + i + 'p').append('<button id="j' + i + '_' + j + '" class="button col popover-open" data-popover=".popover-menor"> - </button>');
      } else if (j > 6 && j < 11) {
        $$('#j' + i + 'p').append('<button id="j' + i + '_' + j + '" class="button col popover-open" data-popover=".popover-mayor"> - </button>');
      } else if (j === 11) {
        $$('#j' + i + 'p').append('<button id="j' + i + '_' + j + '" class="button col total"> 0 </button>');
      }
    }
  }
}

function capturarJugada() {
  idjugada = this.id;
  nrojugada = idjugada.split('_')[1];
}

function tacharJugada() {
  $$('#' + idjugada).text('X');
  calcularTotal();
}

function calcularJugada() {
  var opcion = (this.innerText)[0];
  (opcion === 'S') ? opcion = '2' : null;
  (opcion === 'A') ? opcion = '1' : null;
  $$('#' + idjugada).text(Object.values(jugadas)[Number(nrojugada)][Number(opcion - 1)]);
  calcularTotal();
}

function calcularTotal() {
  var total = 0;
  var valor = 0;
  for (var i = 1; i < Object.keys(jugadas).length - 1; i++) {
    valor = $$('#' + idjugada.split('_')[0] + '_' + i).text();
    (!isNaN(valor)) ? (total += Number(valor)) : null;
  }
  $$('#' + idjugada.split('_')[0] + '_11').text(total);
}