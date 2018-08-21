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
  routes: routes,
});

serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";

$$('.open-login').on('click', function () {
  app.dialog.login('Ingresa tu nombre de usuario y contraseña', 'INICIAR SESION', function (username, password) {
    app.request.post(serviceURL + "login.php", { username: username, psswrd: password }, function (data) {
      app.dialog.alert(data, "Inicio de sesión");
      localStorage.setItem("PuntajeUsuario",data.Puntos);
        app.request.post(serviceURL + "consultarPuntaje.php", {
          username: username,
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
  // app.dialog.alert(vnombreRegistro, "Nombre de registro");
  app.request.post(serviceURL + "insertarUsuario.php", { username: vnombreRegistro, psswrd: vpassRegistro, email: vemaiRegistro }, function (data) {
    app.dialog.alert(data, "Registro de usuarios");
    app.popup.close(".demo-registro", true);
  });
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


var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
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
  app.request.post(serviceURL + "insertarPuntos.php", {
    IdUsuario: vIdUsuario,
    Puntos: vPuntos,
    Habitacion: vHabitacion
  }, function (data) {
    app.dialog.alert(data, "Canje de premio");
    // Tomamos los puntos de cuando inicio sesión, e incrementamos con vPuntos
    var puntajeActual = localStorage.getItem("PuntajeUsuario");
    localStorage.setItem("PuntajeUsuario", parseInt(puntajeActual) + parseInt(vPuntos));
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
    console.log("Estos son los datos que llegan de insertarPedido.php");
    console.log(data);
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
      text: "Actualmente usted cuenta con " + PuntajeUsuario + " puntos, por lo que no son suficientes para agregar este permio a su canje.",
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

function ultimoPedido()
{
  // Devolvemos true si el usuario ha efectuado un pedio de canje de premio hoy.
  return false;
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
    app.virtualList.create({
      el: elList,
      items: conversion,
      itemTemplate: 
      '<div class="card demo-card-header-pic" style="background-color: #ffffff;">' +
        '<div style="background-image:url(http://chocolateboutiquemotel.com/demoapp/images/{{imgPremio}})" class="card-header align-items-flex-end"></div>' +
        '<div class="card-content card-content-padding">' +
        '<div class="row" style="margin-top: -35px;">' +
        '<div class="col-50 tablet-50"><img src="" alt="" title="" width="99%"/>' +
        '<p style="text-transform: uppercase; color:#000000;">{{Premio}}</p>' +
        '</div>' +
        '<div class="col-50 tablet-50"><img src="" alt="" title="" width="99%"/>' +
        '<p class="date" style="font-weight: bold; font-size: 14px; color: orange; letter-spacing: -1.2px;">Valor: {{Puntos}} Puntos</p>' +
        '</div>' +
        '</div>' +
        '<div class="row" style="margin-top: -35px;">' +
        '<div class="col-50 tablet-50"><img src="" alt="" title="" width="99%"/>' +
        '</div>' +
        '</div>' +
        '<div class="col-50 tablet-50" style="margin-top: 3px;"><img src="" alt="" title="" width="99%"/>' +
        '<a href="/detallePremio/Id/{{IdPremio}}/TipoPremio/{{TipoPremio}}/" class="button button-small button-fill button-raised color-green link" @click="showToastCenter">Agregar a pedido</a>' +
        '</div>' + 
        '</div>' +
        '</div>' +
        '</div>' 
    });
  }); 
}

function limpiarListaPedido(Lista)
{ 
  var lista= app.virtualList.get(Lista);
  lista.deleteAllItems();
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
    {
      uuid: 'F98881F6-EBD5-4E8D-9016-736C4A777BAC'
    }, // Azul Jacuzzi 12
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
  actualizarListadoPremios('Habitacion', '.habitaciones-list');
  // Cuando le dan clic al icono, construimos la lista virtual y mensajes segun sea el caso
  var PuntajeUsuario = localStorage.getItem("PuntajeUsuario");
  $$('.PuntajeUsuarioPedido').text(PuntajeUsuario);
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
            title: 'Acmule sus puntos',
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
  locationManager.requestAlwaysAuthorization();

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
  $('#found-beacons').empty();
  var timeNow = Date.now();
  $.each(beacons, function (key, beacon) {
    // Solo se muestran los estimotes que están en un rango de 60 segundos
    if (beacon.timeStamp + 240000 > timeNow) {
      var tipoEstimote="";
      var puntaje="";
      var estimote="";
      // Create tag to display beacon data.
      var habitacion1 = 'F98881F6-EBD5-4E8D-9016-736C4A777BAC';
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
      var habitacion13 = 'F98881F6-EBD5-4E8D-9016-736C4A777BAC';
      
      // if ((beacon.uuid === habitacion1.toLowerCase() || beacon.uuid === habitacion1) && beacon.proximity === 'ProximityNear') // Morado
      if (beacon.uuid === habitacion1.toLowerCase() || beacon.uuid === habitacion1) // Morado
      {
        tipoEstimote = "Sencilla 1";
        puntaje = beacon.rssi;
        estimote = habitacion1;
      }
      // if ((beacon.uuid === habitacion2.toLowerCase() || beacon.uuid === habitacion2) && beacon.proximity === 'ProximityNear' ) // Morado
      if (beacon.uuid === habitacion2.toLowerCase() || beacon.uuid === habitacion2) // Morado
      {
        tipoEstimote = "Sencilla 2";
        puntaje = beacon.rssi;
        estimote = habitacion2;
      }
      // if ((beacon.uuid === habitacion3.toLowerCase() || beacon.uuid === habitacion3) && beacon.proximity === 'ProximityNear') // Morado
      if (beacon.uuid === habitacion3.toLowerCase() || beacon.uuid === habitacion3) // Morado
      {
        tipoEstimote = "Sencilla 3";
        puntaje = beacon.rssi;
        estimote = habitacion3;
      }
      // if ((beacon.uuid === habitacion4.toLowerCase() || beacon.uuid === habitacion4) && beacon.proximity === 'ProximityNear') // Morado
      if (beacon.uuid === habitacion4.toLowerCase() || beacon.uuid === habitacion4) // Morado
      {
        tipoEstimote = "Sencilla 4";
        puntaje = beacon.rssi;
        estimote = habitacion4;
      }
      // if ((beacon.uuid === habitacion5.toLowerCase() || beacon.uuid === habitacion5) && beacon.proximity === 'ProximityNear') // Morado
      if (beacon.uuid === habitacion5.toLowerCase() || beacon.uuid === habitacion5) // Morado
      {
        tipoEstimote = "Sencilla 5";
        puntaje = beacon.rssi;
        estimote = habitacion5;
      }
      // if ((beacon.uuid === habitacion6.toLowerCase() || beacon.uuid === habitacion6) && beacon.proximity === 'ProximityNear') // Morado
      if (beacon.uuid === habitacion6.toLowerCase() || beacon.uuid === habitacion6) // Morado
      {
        tipoEstimote = "Sencilla 6";
        puntaje = beacon.rssi;
        estimote = habitacion6;
      }
      
      if (beacon.uuid === habitacion7.toLowerCase() || beacon.uuid === habitacion7) // Morado
      {
        tipoEstimote = "Sencilla 7";
        puntaje = beacon.rssi;
        estimote = habitacion7;
      }

      if (beacon.uuid === habitacion8.toLowerCase() || beacon.uuid === habitacion8) // Morado
      {
        tipoEstimote = "Sencilla 8";
        puntaje = beacon.rssi;
        estimote = habitacion8;
      }
      
      if (beacon.uuid === habitacion9.toLowerCase() || beacon.uuid === habitacion9) // Morado
      {
        tipoEstimote = "Jacuzzi 9";
        puntaje = beacon.rssi;
        estimote = habitacion9;
      }
      if (beacon.uuid === habitacion10.toLowerCase() || beacon.uuid === habitacion10) // Morado
      {
        tipoEstimote = "Jacuzzi 10";
        puntaje = beacon.rssi;
        estimote = habitacion10;
      }
      if (beacon.uuid === habitacion11.toLowerCase() || beacon.uuid === habitacion11) // Morado
      {
        tipoEstimote = "Sencilla 11";
        puntaje = beacon.rssi;
        estimote = habitacion11;
      }
      if (beacon.uuid === habitacion12.toLowerCase() || beacon.uuid === habitacion12) // Morado
      {
        tipoEstimote = "Jacuzzi 12";
        puntaje = beacon.rssi;
        estimote = habitacion12;
      }
      if (beacon.uuid === habitacion13.toLowerCase() || beacon.uuid === habitacion13) // Morado
      {
        tipoEstimote = "ICE";
        puntaje = beacon.rssi;
        estimote = habitacion13;
      }
      
      localStorage.setItem("tipoEstimote",tipoEstimote);
      localStorage.setItem("puntaje",puntaje);

      $('#warning').text("Gracias por hospedarse en nuestra habitacion: "+ tipoEstimote + ", le hemos otorgado: " + puntaje + " puntos con el estimote " + estimote);
      $('#capa-premio-ganado').show(); 
      app.preloader.hide();
    }
  });
  // listaEstimotes.appendItems(element);
}