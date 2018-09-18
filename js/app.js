// Dom7
var $$ = Dom7;
var app = new Framework7({
  root: '#app', 
  id: 'com.interlabs.chocolateboutiquemotel', 
  name: 'Chocolate-App', 
  theme: 'auto', 
  popup: {
    closeByBackdropClick: false,
  },
  dialog: {
    title: 'Chocolate Boutique Motel',
    buttonOk: 'Aceptar',
    buttonCancel: 'Cancelar',
    usernamePlaceholder: 'Nombre de usuario',
    passwordPlaceholder: 'Contraseña'
  },
  routes: routes,
  init: true,
  initOnDeviceReady: true
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});

var premiosView = app.views.create('#view-premios', {
  url: '/premios/'
});

var vistaCarrito = app.views.create('#view-carrito', {
  url: '/carrito/'
});

var AyudaView = app.views.create('#view-settings', {
  url: '/ayuda/'
});


serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";

$$('.open-login').on('click', function () {
  app.dialog.login('Ingresa tu nombre de usuario y contraseña', 'INICIAR SESION', function (usuario, password) {
    app.request.post(serviceURL + "login.php", { username: usuario, psswrd: password }, function (data) {
      app.dialog.alert(data, "Inicio de sesión");
      localStorage.setItem("PuntajeUsuario",data.Puntos);
        app.request.post(serviceURL + "consultarPuntaje.php", {
          username: usuario,
          psswrd: password
        }, function (data) {
          var info = JSON.parse(data);
          app.popup.close(".demo-login",true);
          localStorage.setItem("PuntajeUsuario", info.Puntos);
          localStorage.setItem("IdUsuario", info.IdUsuario);
          var vId = localStorage.getItem("IdUsuario");
          console.log("Este el el id cuando inicia sesion " + vId);
          localStorage.setItem("IdHistorial", info.IdUsuario);
          localStorage.setItem("NombreUsuario", info.NombreUsuario);
        });
    });
    // Consultamos y almacenamos los puntos acumulados por el usuario
  });
});

$$('.open-prompt').on('click', function () {
  app.dialog.prompt('Escribe tu correo electrónico para reestablecer contraseña', 'CONTRASEÑA OLVIDADA', function (email) {
    app.request.post(serviceURL + "olvidoContra.php", {
      email: email
    }, function (data) {
      if (data != "Usuario no encontrado") {
        // app.dialog.alert(data);
        app.dialog.alert('Se ha enviado un correo a ' + email + ', sigue las instrucciones para poder reestablecer tu contraseña. Revisa tu bandeja de SPAM si no lo ves en tu bandeja de entrada', '¡LISTO!');
      } else {
        app.dialog.alert("Usuario no encontrado", "Reestablecer contraseña");
      }
    });
  });
});

$$('.btn-registrar').on('click', function () {
  var vnombreRegistro = $$('.nombre_registro').val();
  var vemaiRegistro = $$('.email_registro').val();
  var vpassRegistro = $$('.pass_registro').val();
  if (vnombreRegistro == "")
    app.dialog.alert("Por favor escriba un nombre de usuario", "Registro de usuuario");
  if (vemaiRegistro == "")
    app.dialog.alert("Por favor escriba un correo electrónico vaiido", "Registro de usuuario");
  if (vpassRegistro == "")
    app.dialog.alert("Por favor escriba una contraseña", "Registro de usuario");
  if (vnombreRegistro != "" && vemaiRegistro != "" && vpassRegistro != "") {
    app.request.post(serviceURL + "insertarUsuario.php", { username: vnombreRegistro, psswrd: vpassRegistro, email: vemaiRegistro }, function (data) {
      app.dialog.alert(data, "Registro de usuarios");
      app.popup.close(".demo-registro", true);
    });
  }
});

$$('.btn-new-pass').on('click', function () {
  var vkey = $$('.txt_key_restore').val();
  var vemail = $$('.txt_email_key_restore').val();
  var vPsswrd = $$('.txt_new_pass').val();
  // app.dialog.alert(vnombreRegistro, "Nombre de registro");
  app.request.post(serviceURL + "reestalbecerContra.php", {
        email: vemail, 
        psswrd: vPsswrd, 
        key: vkey
      }, function (data) {
    if (data != "Registro no encontrado") {
      app.dialog.alert("Su nueva contraseña se ha guardado exitosemante", "Nueva contraseña");
      app.popup.close(".popup-restore-key", true);
    } else {
      app.dialog.alert("Su código enviado por email y correo no son validos o es un usuario no activado. Por favor intente de nuevo", "Nueva contraseña");
    }
  });
});

$$('.btn-registrar-visita').on('click', function () {
  $$('#warning').html(
    "<h3><center> Por favor asegurese que tiene encendido el bluetooth de su celular </center></h3>"+
    "Estamos analizando si usted esta dentro de una habitacion de chocolate Boutique Motel por favor espere <br>" +
    "<br ><center ><img src = 'images/loading.gif' width = '20%'></center>"
  );
  // localStorage.setItem("tipoEstimote", "");
  localStorage.setItem("puntaje", "");
  timeNow = Date.now();
});

$$('.cerrar-sesion').on('click', function () {
  limpiarLocalStorage();
  app.popup.open(".demo-login", true);
});

$$('#cerrar-registro').on('click', function () {
  app.popup.close(".demo-registro", true);
});

$$('#cerrar-login').on('click', function () {
  app.popup.close(".demo-login", true);
});

$$('.cerrar-popup-aviso-privacidad').on('click', function () {
  app.popup.close(".popup-aviso-privacidad", true);
});

$$('.cerrar-popup-terminos').on('click', function () {
  app.popup.close(".popup-terminos", true);
});

$$('.cerrar-restore-key').on('click', function () {
  app.popup.close(".popup-restore-key", true);
});

function esNumero(numero) {
  var bandera = false;
  if (isNaN(numero)) {
    bandera = false;
  }
  else {
    bandera = true;
  }
  return bandera;
}

function actualizarListaPedido(lista)
{
  // Actualizamos lista virtual
} 

function ganarPuntos(vIdUsuario, vPuntos, vHabitacion) {
// Consultamos si no hay un puntaje en esa habitación
var fechaActual = fechaHoy();
var vIdUsuario = localStorage.getItem('IdUsuario');
app.request.post(serviceURL + "ultimoPuntaje.php", { fecha: fechaActual, IdUsuario: vIdUsuario, Habitacion: vHabitacion }, function (data) { 
  app.dialog.alert(data, "Data último puntaje");
  if (data != "") {
    app.dialog.alert(data, "Data último puntaje");
  }
  // Analizamos cuanto tiempo pasa entre acciones de los usuarios
  app.popup.close(".demo-popup", true);
  if (data != "Solo se pueden acumular puntos en el hotel una vez por día" && data != "No se pueden acumular puntos en esta habitación en este momento, solo se permite acumar puntos a un solo usuario por habitación") {
    app.request.post(serviceURL + "insertarPuntos.php", { IdUsuario: vIdUsuario, Puntos: vPuntos, Habitacion: vHabitacion }, function (data) {
      app.dialog.alert(data, "¡Felicidades!");
      var puntajeActual = localStorage.getItem("PuntajeUsuario");
      localStorage.setItem("PuntajeUsuario", parseInt(puntajeActual) + parseInt(vPuntos));
      app.popup.close(".demo-popup", true);
    });
    } 
  });
}

function realizarPedido(vista)
{ 
  var IdSucursal = 1; 
  var IdUsuario = localStorage.getItem("IdUsuario");
  var Premio1 = localStorage.getItem("Premio1");
  var Cantidad1 = localStorage.getItem("Cantidad1");
  var Premio2 = localStorage.getItem("Premio2");
  var Cantidad2 = localStorage.getItem("Cantidad2");
  var NombreUsuario = localStorage.getItem("NombreUsuario");
  var PuntosTotales = calcularPuntajePedido();
  console.log("Estos son los puntos totales: " + PuntosTotales)
  app.request.post(serviceURL + "insertarPedido.php", {
    IdUsuario: IdUsuario,
    NombreUsuario: NombreUsuario,
    IdSucursal: IdSucursal,
    Premio1: Premio1,
    Cantidad1: Cantidad1,
    Premio2: Premio2,
    Cantidad2: Cantidad2,
    PuntosTotales: PuntosTotales
  }, function (data) {
    PuntosAnteriores = localStorage.getItem("PuntajeUsuario");
    NuevosPuntos = parseFloat(PuntosAnteriores) - parseFloat(PuntosTotales);
    $$("#PuntajeUsuarioPedido").text(NuevosPuntos);
    localStorage.setItem("PuntajeUsuario",NuevosPuntos);
      app.dialog.alert (data ,"Canje de premio");
    limpiarLocalStorage();
    if (vista =="premios")
    limpiarListaPedido('.pedidos-list');
    if (vista == "pedidos")
    limpiarListaPedido('.carrito-list');
  });
}

function limpiarPedido(vista)
{
  // Limpiamos las variables de tipo localstorage.
  limpiarLocalStorage();
  limpiarListaPedido(vista);
}

function validarPuntajePremioActual()
{
  var Cantidad = parseInt(app.stepper.getValue('.stepper-pedido'));
  var PuntosActuales = parseInt(localStorage.getItem("PuntosPremioActual"));
  var PuntajeUsuario = parseInt(localStorage.getItem("PuntajeUsuario"));
  if (PuntajeUsuario < (Cantidad * PuntosActuales)) {
    // app.dialog.alert("Actualmente usted cuenta con " + PuntajeUsuario + " Por lo que no son suficientes para agregar este articulo a su pedido.");
    
    var mitostadita = app.toast.create({
      // icon: app.theme === 'ios' ? '<i class="f7-icons">warning</i>' : '<i class="material-icons">warning</i>',
      text: "Actualmente usted cuenta con " + PuntajeUsuario.toLocaleString('es-MX') + " puntos, por lo que no son suficientes para agregar este permio a su canje.",
      position: 'bottom',
      closeButton: true,
      closeButtonText: 'Ok',
      closeButtonColor: 'orange',
      closeTimeout: 6000,
    });
    mitostadita.open();
    $$('.btn-agregar-pedido').addClass("disabled");
  } else {
    $$('.btn-agregar-pedido').removeClass("disabled");
  }
  $$('.puntos-premio').text(Cantidad * PuntosActuales + " Puntos");
}

function calcularPuntajePedido()
{
  var Puntaje1 = localStorage.getItem("Puntaje1");
  var Cantidad1 = localStorage.getItem("Cantidad1");
  var Puntaje2 = localStorage.getItem("Puntaje2");
  var Cantidad2 = localStorage.getItem("Cantidad2");
  if (Puntaje1 == "" || isNaN(Puntaje1)) 
    Puntaje1 = 0;
  if (Cantidad1 == "" || isNaN(Cantidad1))
    Cantidad1 = 1;
  if (Puntaje2 == "" || isNaN(Puntaje2))
    Puntaje2 = 0;
  if (Cantidad2 == "" || isNaN(Cantidad2))
    Cantidad2 = 1;
  var PuntajePedido = parseFloat(Cantidad1 * Puntaje1) + parseFloat(Cantidad2 * Puntaje2);
  return PuntajePedido;
}

function limpiarLocalStorage()
{
  localStorage.setItem("Premio1", "");
  localStorage.setItem("TipoPremio1", "");
  localStorage.setItem("Puntaje1", "");
  localStorage.setItem("Cantidad1", "");
  localStorage.setItem("Premio2", "");
  localStorage.setItem("TipoPremio2", "");
  localStorage.setItem("Puntaje2", "");
  localStorage.setItem("Cantidad2", "");
  localStorage.setItem("IdPremioGlobal", "");
  localStorage.setItem("TipoPremioGlobal","");
  localStorage.setItem("PuntosPremioActual", "");
  // console.log("Se limpiaron las variables globales");
  $$('.iconito').text("0");
}

function actualizarBadge(action)
{
 var cuantos = parseInt($$('.iconito').text());
 if (action=="mas")
 {
  // Consultamos el badge
  var cuantos = $$('.iconito').text(parseInt(cuantos) + 1);
}
else if (action == "menos")
{
  var cuantos = $$('.iconito').text(parseInt(cuantos) - 1);
 }
}

function actualizarListadoPremios(pTipoPremio, elList) {
  app.request.post(serviceURL + "listadoPremios.php", { TipoPremio: pTipoPremio }, function (data) {
    var conversion = JSON.parse(data);
    var cuantos = Object.keys(conversion).length; //Contamos el numero de elementos que llegan del server
    if (cuantos>0)
    {
      if (elList == '.habitaciones-list')
      {
       $$('.motel-empty').hide();
      }
      if (elList == '.snack-list') {
        $$('.snack-empty').hide();
      }
      if (elList == '.cocina-list') {
        $$('.cocina-empty').hide();
      }
      if (elList == '.sexshop-list') {
        $$('.sexshop-empty').hide();
      }
      // cuantos = 1;
    }
    // app.dialog.alert(cuantos);
    var vl= app.virtualList.create({
      el: elList,
      items: conversion,
      cache: true,
      rowsAfter: cuantos,
      updatableScroll: true,
      itemTemplate:
      '<li>'+
      '<div class="card demo-card-header-pic" style="background-color: #ffffff;">' +
        '<div style="background-image:url(http://chocolateboutiquemotel.com/demoapp/images/{{imgPremio}})" class="card-header align-items-flex-end"></div>' +
        '<div class="card-content card-content-padding">' +
        '<div class="row" style="margin-top: -35px;">' +
        '<div class="col-50 tablet-50"><br>' +
            '<p style="color:#000000;">{{Premio}}</p>' +
        '</div>' +
        '<div class="col-50 tablet-50"><br>' +
        '<p class="date" style="font-weight: bold; font-size: 14px; color: orange; letter-spacing: -1.2px;">Valor: {{Puntos}} Puntos</p>' +
        '</div>' +
        '</div>' +
        '<div class="row" style="margin-top: -35px;">' +
        '<div class="col-50 tablet-50"><br>' +
        '</div>' +
        '</div>' +
        '<div class="col-50 tablet-50" style="margin-top: 3px;"><br>' +
        '<a href="/detallePremio/Id/{{IdPremio}}/TipoPremio/{{TipoPremio}}/" class="button button-small button-fill button-raised color-green link" @click="showToastCenter">Agregar a pedido</a>' +
        '</div>' + 
        '</div>' +
        '</div>' +
        '</div>' +
        '</li>',
        // dynamicHeightBufferSize: 50,
    });
    vl.update();
    vl.destroy(); // Te la mamaste Vladimir!
  }); 
}

function limpiarListaPedido(Lista)
{ 
  if (Lista == ".pedidos-list")
  {
    $$('.SumaPuntos').text('0');
    $$('.pedido-canje').addClass('disabled');
    $$('.AlertaPedido').text('');
  }
  else
  {
    $$('.SumaPuntosCarrito').text('0');
    $$('.carrito-canje').addClass('disabled');
    $$('.AlertaPedido').text('');
  }
  var lista= app.virtualList.get(Lista);
  // Deshabilitamos el botón de pedido canje
  lista.deleteAllItems();
}

function fechaHoy() {
  var hoy = new Date();
  var dd = hoy.getDate();
  var mm = hoy.getMonth() + 1; //hoy es 0!
  var yyyy = hoy.getFullYear();

  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }
  var respuesta = yyyy + '-' + mm + '-' + dd;
  return respuesta;
}

function pedidoHoy(vfecha) {
  // Devolvemos true si el usuario ha efectuado un pedio de canje de premio hoy.
  var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
  var vIdUsuario = localStorage.getItem('IdUsuario');
  app.request.post(serviceURL + "ultimoPedido.php", {
    fecha: vfecha,
    IdUsuario: vIdUsuario
  });
  console.log("Esta es la respuesta que viene de pedidohoy");
  app.dialog.alert("Respuesta del server: " + respuesta['responseText']);
  console.log(respuesta);
  if (respuesta == "1")
  {
    return "true";
  }
  else
  {
    return "false";
  }
}
// Specify your beacon 128bit UUIDs here.
var regions =
  [
    { uuid: 'E4787C7D-B081-4BFC-B2E3-D3251E828D67' }, // Verde Sencilla 1
    { uuid: '5089CCA0-51F9-462A-9B20-DD26C8FB7132' }, // Morado Sencilla 2
    { uuid: '45ECAAC7-04AB-4E6C-976D-25554A7B9C27' }, // Azul Sencilla 3
    { uuid: '9FCED411-E711-41E4-B235-E6ABC6C22D22' }, // Morado Sencilla 4
    { uuid: 'A5F86E84-ED36-4D47-8E2B-A79A0386464C' }, // Verde Sencilla 5
    { uuid: '5CE6F452-FBFF-4A7E-883A-AC9DE9FB9116' }, // Azul Sencilla 6
    { uuid: 'F69313C0-613E-4A7F-A388-195BD23EA865' }, // Azul Sencilla 7
    { uuid: '794AC210-287E-4F82-A218-0FC862203446' }, // Morado Sencilla 8
    { uuid: 'CFD89003-3BD1-4176-8476-7617C519AD09' }, // Azul Jacuzzi 9
    { uuid: '8FE06DEF-A514-4E64-AE24-1D44C25F5D7C' }, // Morado Jacuzzi 10
    { uuid: '9E4049B4-7924-4EB8-AD23-3CE83F13AD86' }, // Verde sencilla 11
    { uuid: 'E5F781E1-BA9D-433E-9711-219CEA7DCD38' }, // Azul Jacuzzi 12
    { uuid: 'ABB825C0-132D-4049-01AE-542447B3CA82' }, // Zacatecas Jacuzzi 14
    { uuid: 'F3C36438-8C65-4F82-85A4-E197920009BF' }, // Verde Sencilla 15
    { uuid: '1730150A-0A2A-4A50-BBB0-D01CB5966B38' }, // Azul Sencilla 16
    { uuid: 'E10F073A-52E2-4435-9329-904E2CFD5BA5' }, // Morado Sencilla 17
    { uuid: '45D73B97-B069-4255-A440-EC3890F1DC06' }, // Morado Sencilla 19
    { uuid: '6DE738C0-3863-4BAD-99DC-A68359186081' }, // Azul Sencilla 20
    { uuid: '5FAA6EE5-8FBD-4C82-9C38-E9BF7789E46F' }, // Verde Sencilla 21
    { uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D' }, // Verde Sencilla 22
    { uuid: 'F6CE6C6D-860B-4247-A370-A32C5421802D' }, // Verde Peatonal 23 24
    { uuid: '65F3BC6C-F5BF-46DF-A58B-8CB3E449FB9C' }, // Morado Sencilla 25 26
    { uuid: 'F98881F6-EBD5-4E8D-9016-736C4A777BAC' }, // Azul Fiestera 69
  ];

// Background detection.
var notificationID = 0;
var inBackground = false;

$$('.canje-premio').on('click', function () {
  var vIdUsuario = localStorage.getItem("IdUsuario");
  var vPuntaje = localStorage.getItem("puntaje");
  var vTipoEstimote = localStorage.getItem("tipoEstimote");
  ganarPuntos(vIdUsuario,vPuntaje,vTipoEstimote);
}); 

$$('.premios-icon').on('click', function () {
  // actualizarListadoPremios('Habitacion', '.habitaciones-list');
  // actualizarListadoPremios('Barra', '.snack-list');
  // actualizarListadoPremios('Cocina', '.cocina-list');
  // actualizarListadoPremios('SexShop', '.sexshop-list');

  
  // Cuando le dan clic al icono, construimos la lista virtual y mensajes segun sea el caso
  var PuntajeUsuario = localStorage.getItem("PuntajeUsuario");
  $$('#PuntajeUsuarioPedido').text(PuntajeUsuario);
  var elemento = [];
  var Premio1 = localStorage.getItem("Premio1");
  var Puntaje1 = localStorage.getItem("Puntaje1");
  var Cantidad1 = localStorage.getItem("Cantidad1");
  var Premio2 = localStorage.getItem("Premio2");
  var Puntaje2 = localStorage.getItem("Puntaje2");
  var Cantidad2 = localStorage.getItem("Cantidad2");
  if (Premio1 != "") {
    elemento.push({
      Premio: Cantidad1 + " x " + Premio1,
      Puntos: Cantidad1 * Puntaje1
    })
  }
  if (Premio2 != "") {
    elemento.push({
      Premio: Cantidad2 + " x " + Premio2,
      Puntos: Cantidad2 * Puntaje2
    })
  }
  // Calculamos la suma de puntos de de ambos elementos
  var PuntajePedido = calcularPuntajePedido();
  $$('.SumaPuntos').text(PuntajePedido);
  if (PuntajePedido > PuntajeUsuario) {
    $$('.AlertaPedido').text("No tienes puntos suficientes para este canje.");
    $$('.pedido-canje').addClass("disabled");
  } else {
    $$('.pedido-canje').removeClass("disabled");
  }
  if (PuntajePedido == 0) {
    $$('.pedido-canje').addClass("disabled");
  }

  app.virtualList.create({
    el: '.pedidos-list',
    items: elemento,
    itemTemplate: '<li class="swipeout deleted-callback">' +
      '<a href="#" class="item-link item-content swipeout-content">' +
      '<div class="item-inner">' +
      '<div class="item-title-row">' +
      '<div class="item-title">{{Premio}}</div>' +
      '</div>' +
      '<div class="item-subtitle">{{Puntos}}</div>' +
      '</div>' +
      '<div class="swipeout-actions-right">' +
      '<a href="#" class="swipeout-delete">Borrar</a>' +
      '</div>' +
      '</a>' +
      '</li>',
  });
});

$$('.pedidos-icon').on('click', function () {
  var PuntajeUsuario = localStorage.getItem("PuntajeUsuario");
  $$('.PuntajeUsuarioCarrito').text(PuntajeUsuario);
  console.log("Este es el puntaje sacado de localstorage" + PuntajeUsuario)
  var elemento = [];
  var Premio1 = localStorage.getItem("Premio1");
  var Puntaje1 = localStorage.getItem("Puntaje1");
  var Cantidad1 = localStorage.getItem("Cantidad1");
  var Premio2 = localStorage.getItem("Premio2");
  var Puntaje2 = localStorage.getItem("Puntaje2");
  var Cantidad2 = localStorage.getItem("Cantidad2");
  if (Premio1 == "")
    $$('.capa-boton-limipiar').hide();
  else 
    $$('.capa-boton-limipiar').show();
  if (Premio1 != "") {
    elemento.push({
      Premio: Cantidad1 + " x " + Premio1,
      Puntos: Cantidad1 * Puntaje1
    })
  }
  if (Premio2 != "") {
    elemento.push({
      Premio: Cantidad2 + " x " + Premio2,
      Puntos: Cantidad2 * Puntaje2
    })
  }
  // Calculamos la suma de puntos de de ambos elementos
  var PuntajePedido = calcularPuntajePedido();
  console.log("Puntaje del pedido desde la vista de pedido: " + PuntajePedido)
  $$('.SumaPuntosCarrito').text(PuntajePedido);
  if (parseFloat(PuntajePedido) > parseFloat(PuntajeUsuario)) {
    $$('.AlertaCarrito').text("No tienes puntos suficientes para este canje.");
    $$('.carrito-canje').addClass("disabled");
  } else {
    $$('.carrito-canje').removeClass("disabled");
  }
  if (PuntajePedido == 0)
  {
    $$('.carrito-canje').addClass("disabled");
  }
  console.log("Vamos a inspeccionar los elementos del carrito");
  console.log(elemento);
  
  app.virtualList.create({
    el: '.carrito-list',
    items: elemento,
    itemTemplate: '<li class="swipeout deleted-callback">' +
      '<a href="#" class="item-link item-content swipeout-content">' +
      '<div class="item-inner">' +
      '<div class="item-title-row">' +
      '<div class="item-title">{{Premio}}</div>' +
      '</div>' +
      '<div class="item-subtitle">{{Puntos}}</div>' +
      '</div>' +
      '<div class="swipeout-actions-right">' +
      '<a href="#" class="swipeout-delete">Borrar</a>' +
      '</div>' +
      '</a>' +
      '</li>',
  });
  // actualizarListaPedido('.pedidos-list');
});

document.addEventListener('pause', function () { inBackground = true });
document.addEventListener('resume', function () { inBackground = false });
// Dictionary of beacons.
var beacons = {};

// Timer that displays list of beacons.
var updateTimer = null;

app.initialize = function () {
  document.addEventListener(
    'deviceready',
    function () { 
      evothings.scriptsLoaded(onDeviceReady);
    },
    false);
};

function onDeviceReady() {
  // Specify a shortcut for the location manager holding the iBeacon functions.
  // window.locationManager = cordova.plugins.locationManager;
  // // Start tracking beacons!
  // startScan();
  // // Display refresh timer.
  // updateTimer = setInterval(displayBeaconList, 500);
}

function startScan() {
  // The delegate object holds the iBeacon callback functions
  // specified below.
  var delegate = new locationManager.Delegate();

  // Called continuously when ranging beacons.
  delegate.didRangeBeaconsInRegion = function (pluginResult) {
    for (var i in pluginResult.beacons) {
      // Insert beacon into table of found beacons.
      var beacon = pluginResult.beacons[i];
      beacon.timeStamp = Date.now();
      var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
      beacons[key] = beacon;
    }
  };

  // Called when starting to monitor a region.
  // (Not used in this example, included as a reference.)
  delegate.didStartMonitoringForRegion = function (pluginResult) {
    //console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult))
  };

  // Called when monitoring and the state of a region changes.
  // If we are in the background, a notification is shown.
  delegate.didDetermineStateForRegion = function (pluginResult) {
    if (inBackground) {
      // Show notification if a beacon is inside the region.
      // TODO: Add check for specific beacon(s) in your app.
      if (pluginResult.region.typeName == 'BeaconRegion' &&
        pluginResult.state == 'CLRegionStateInside') {
        cordova.plugins.notification.local.schedule(
          {
            id: ++notificationID,
            title: 'Acumule sus puntos',
            text: 'Esta usted dentro de una habitación de Chocolate Boutique Motel.'
          });
          inBackground= false;
      }
    }
  };

  // Set the delegate object to use.
  locationManager.setDelegate(delegate);

  // Request permission from user to access location info.
  // This is needed on iOS 8.
  // locationManager.requestAlwaysAuthorization();
  locationManager.requestWhenInUseAuthorization();

  // Start monitoring and ranging beacons.
  for (var i in regions) {
    var beaconRegion = new locationManager.BeaconRegion(
      i + 1,
      regions[i].uuid);

    // Start ranging
    locationManager.startRangingBeaconsInRegion(beaconRegion)
      .fail(console.error)
      .done();

    // Start monitoring.
    // (Not used in this example, included as a reference.)
    locationManager.startMonitoringForRegion(beaconRegion)
      .fail(console.error)
      .done();
  }
}

function displayBeaconList() {
  // Clear beacon list.
  // TODO Aqui vamos a 
  $$('#found-beacons').empty();
  timeNow = Date.now();
  var tipoEstimote="";
  var puntaje="300";
  $.each(beacons, function (key, beacon) {
    if (beacon.timeStamp + 240000 > timeNow) {
      // Create tag to display beacon data.
      var habitacion1 = 'E4787C7D-B081-4BFC-B2E3-D3251E828D67';
      var habitacion2 = '5089CCA0-51F9-462A-9B20-DD26C8FB7132';
      var habitacion3 = '45ECAAC7-04AB-4E6C-976D-25554A7B9C27';
      var habitacion4 = '9FCED411-E711-41E4-B235-E6ABC6C22D22';
      var habitacion5 = 'A5F86E84-ED36-4D47-8E2B-A79A0386464C';
      var habitacion6 = '5CE6F452-FBFF-4A7E-883A-AC9DE9FB9116';
      var habitacion7 = 'F69313C0-613E-4A7F-A388-195BD23EA865';
      var habitacion8 = '794AC210-287E-4F82-A218-0FC862203446';
      var habitacion9 = 'CFD89003-3BD1-4176-8476-7617C519AD09';
      var habitacion10 = '8FE06DEF-A514-4E64-AE24-1D44C25F5D7C';
      var habitacion11 = '9E4049B4-7924-4EB8-AD23-3CE83F13AD86';
      var habitacion12 = 'E5F781E1-BA9D-433E-9711-219CEA7DCD38';
      var habitacion14 = 'ABB825C0-132D-4049-01AE-542447B3CA82';
      var habitacion15 = 'F3C36438-8C65-4F82-85A4-E197920009BF';
      var habitacion16 = '1730150A-0A2A-4A50-BBB0-D01CB5966B38';
      var habitacion17 = 'E10F073A-52E2-4435-9329-904E2CFD5BA5';
      var habitacion18 = '45D73B97-B069-4255-A440-EC3890F1DC06';
      var habitacion19 = 'FF0AEC41-376B-49D3-8231-D728F400A3E0';
      var habitacion20 = '6DE738C0-3863-4BAD-99DC-A68359186081';
      var habitacion21 = '5FAA6EE5-8FBD-4C82-9C38-E9BF7789E46F';
      var habitacion22 = 'B9407F30-F5F8-466E-AFF9-25556B57FE6D';
      var habitacion2324 = 'F6CE6C6D-860B-4247-A370-A32C5421802D';
      var habitacion2526 = '65F3BC6C-F5BF-46DF-A58B-8CB3E449FB9C';
      var habitacion69 = 'F98881F6-EBD5-4E8D-9016-736C4A777BAC';
      
      // if ((beacon.uuid === habitacion1.toLowerCase() || beacon.uuid === habitacion1) && beacon.proximity === 'ProximityNear') // Morado
      if (beacon.uuid === habitacion1.toLowerCase() || beacon.uuid === habitacion1) // Morado
      {
        tipoEstimote = "Sencilla 1";
      }
      // if ((beacon.uuid === habitacion2.toLowerCase() || beacon.uuid === habitacion2) && beacon.proximity === 'ProximityNear' ) // Morado
      if (beacon.uuid === habitacion2.toLowerCase() || beacon.uuid === habitacion2) // Morado
      {
        tipoEstimote = "Sencilla 2";
      }
      // if ((beacon.uuid === habitacion3.toLowerCase() || beacon.uuid === habitacion3) && beacon.proximity === 'ProximityNear') // Morado
      if (beacon.uuid === habitacion3.toLowerCase() || beacon.uuid === habitacion3) // Morado
      {
        tipoEstimote = "Sencilla 3";
      }
      // if ((beacon.uuid === habitacion4.toLowerCase() || beacon.uuid === habitacion4) && beacon.proximity === 'ProximityNear') // Morado
      if (beacon.uuid === habitacion4.toLowerCase() || beacon.uuid === habitacion4) // Morado
      {
        tipoEstimote = "Sencilla 4";
      }
      // if ((beacon.uuid === habitacion5.toLowerCase() || beacon.uuid === habitacion5) && beacon.proximity === 'ProximityNear') // Morado
      if (beacon.uuid === habitacion5.toLowerCase() || beacon.uuid === habitacion5) // Morado
      {
        tipoEstimote = "Sencilla 5";
      }
      // if ((beacon.uuid === habitacion6.toLowerCase() || beacon.uuid === habitacion6) && beacon.proximity === 'ProximityNear') // Morado
      if (beacon.uuid === habitacion6.toLowerCase() || beacon.uuid === habitacion6) // Morado
      {
        tipoEstimote = "Sencilla 6";
      }
      
      if (beacon.uuid === habitacion7.toLowerCase() || beacon.uuid === habitacion7) // Morado
      {
        tipoEstimote = "Sencilla 7";
      }

      if (beacon.uuid === habitacion8.toLowerCase() || beacon.uuid === habitacion8) // Morado
      {
        tipoEstimote = "Sencilla 8";
      }
      
      if (beacon.uuid === habitacion9.toLowerCase() || beacon.uuid === habitacion9) // Morado
      {
        tipoEstimote = "Jacuzzi 9";
      }
      if (beacon.uuid === habitacion10.toLowerCase() || beacon.uuid === habitacion10) // Morado
      {
        tipoEstimote = "Jacuzzi 10";
      }
      if (beacon.uuid === habitacion11.toLowerCase() || beacon.uuid === habitacion11) // Morado
      {
        tipoEstimote = "Sencilla 11";
      }
      if (beacon.uuid === habitacion12.toLowerCase() || beacon.uuid === habitacion12) // Morado
      {
        tipoEstimote = "Jacuzzi 12";
      }
      if (beacon.uuid === habitacion14.toLowerCase() || beacon.uuid === habitacion14) // Morado
      {
        tipoEstimote = "Jacuzzi 14";
      }
      if (beacon.uuid === habitacion15.toLowerCase() || beacon.uuid === habitacion15) // Morado
      {
        tipoEstimote = "Sencilla 15";
      }
      if (beacon.uuid === habitacion16.toLowerCase() || beacon.uuid === habitacion16) // Morado
      {
        tipoEstimote = "Sencilla 16";
      }
      if (beacon.uuid === habitacion17.toLowerCase() || beacon.uuid === habitacion17) // Morado
      {
        tipoEstimote = "Sencilla 17";
      }
      if (beacon.uuid === habitacion18.toLowerCase() || beacon.uuid === habitacion18) // Morado
      {
        tipoEstimote = "Sencilla 18";
      }
      if (beacon.uuid === habitacion19.toLowerCase() || beacon.uuid === habitacion19) // Morado
      {
        tipoEstimote = "Sencilla 19";
      }
      if (beacon.uuid === habitacion20.toLowerCase() || beacon.uuid === habitacion20) // Morado
      {
        tipoEstimote = "Sencilla 20";
      }
      if (beacon.uuid === habitacion21.toLowerCase() || beacon.uuid === habitacion21) // Morado
      {
        tipoEstimote = "Sencilla 21";
      }
      if (beacon.uuid === habitacion22.toLowerCase() || beacon.uuid === habitacion22) // Morado
      {
        tipoEstimote = "Sencilla 22";
      }
      if (beacon.uuid === habitacion2324.toLowerCase() || beacon.uuid === habitacion2324) // Morado
      {
        tipoEstimote = "Peatonal 23 o 24";
      }
      if (beacon.uuid === habitacion2526.toLowerCase() || beacon.uuid === habitacion2526) // Morado
      {
        tipoEstimote = "Peatonal 25 o 26";
      }
      if (beacon.uuid === habitacion69.toLowerCase() || beacon.uuid === habitacion69) // Morado
      {
        tipoEstimote = "Fiestera 69";
      }
      localStorage.setItem("tipoEstimote",tipoEstimote);
      localStorage.setItem("puntaje",puntaje);

      $$('#warning').html("Gracias por hospedarse en nuestra habitacion: " + tipoEstimote + "<br><br> Le hemos otorgado:  " + puntaje + " Puntos");
      $$('.capa-premio-ganado').show(); 
    }
  });
  // listaEstimotes.appendItems(element);
}