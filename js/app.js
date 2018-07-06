// Dom7
var $$ = Dom7;
var app = new Framework7({
  root: '#app', 
  id: 'io.framework7.testapp', 
  name: 'Framework7', 
  theme: 'auto', 
  popup: {
    closeByBackdropClick: false,
  },
  routes: routes,
});

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
        });
    });
    // Consultamos y almacenamos los puntos acumulados por el usuario
  });
});

$$('.btn-registrar').on('click', function () {
  var vnombreRegistro = $$('.nombre_registro').val();
  var vemaiRegistro = $$('.email_registro').val();
  var vpassRegistro = $$('.pass_registro').val();
  app.dialog.alert(vnombreRegistro, "Nombre de registro");
  app.request.post(serviceURL + "insertarUsuario.php", { username: vnombreRegistro, psswrd: vpassRegistro, email: vemaiRegistro }, function (data) {
    app.dialog.alert(data, "Registro de usuarios");
  });
});

$$('.cerrar-sesion').on('click', function () {
  limpiarLocalStorage();
  app.popup.open(".demo-login", true);
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


var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";

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
      closeButtonText: 'Ni pedo',
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
  localStorage.setItem("Puntaje1", "");
  localStorage.setItem("Cantidad1", "");
  localStorage.setItem("Premio2", "");
  localStorage.setItem("Puntaje2", "");
  localStorage.setItem("Cantidad2", "");
  localStorage.setItem("PuntajeUsuario", "");
  localStorage.setItem("IdPremioGlobal", "");
  localStorage.setItem("TipoPremioGlobal","");
  localStorage.setItem("PuntosPremioActual", "");
  // console.log("Se limpiaron las variables globales");
  $$('.iconito').text("0");
}

function actualizarBadge(action)
{
 var cuantos = $$('.iconito').text();
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

// Specify your beacon 128bit UUIDs here.
var regions =
  [
    { uuid: '65F3BC6C-F5BF-46DF-A58B-8CB3E449FB9C' },  // ESTIMOTE MORADO
    { uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D' },  // ESTIMOTE AZUL HIELO
    { uuid: 'F6CE6C6D-860B-4247-A370-A32C5421802D' },  // ESTIMOTE AZUL VERDE
  ];

// Background detection.
var notificationID = 0;
var inBackground = false;

$$('.premios-icon').on('click', function () {
  actualizarListadoPremios('Habitacion', '.habitaciones-list');
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
  $$('.SumaPuntosCarrito').text(PuntajePedido);
  if (PuntajePedido > PuntajeUsuario) {
    $$('.AlertaCarrito').text("No tienes puntos suficientes para este canje.");
    $$('.carrito-canje').addClass("disabled");
  } else {
    $$('.carrito-canje').removeClass("disabled");
  }
  console.log("Vamos a inspeccionar los elementos del carrito");
  console.log(elemento);
  app.virtualList.create({
    // List Element
    el: '.carrito-list',
    // Pass array with items
    items: elemento,
    // List item Template7 template
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

  $$('.deleted-callback').on('swipeout:deleted', function (e) {
    // Vamos a actualizar los puntos del canje y el mensaje de alerta (Si es el caso)
    var posicion = e.target.f7VirtualListIndex;
    if (posicion == 0) // Eliminaron el primer elemento de la lista
    {
      // vamos a pasar el premio2 al premio1 y limpiar premios2
      var Premio2 = localStorage.getItem("Premio2");
      var Puntaje2 = localStorage.getItem("Puntaje2");
      var Cantidad2 = localStorage.getItem("Cantidad2");
      localStorage.setItem("Premio1", Premio2);
      localStorage.setItem("Puntaje1", Puntaje2);
      localStorage.setItem("Cantidad1", Cantidad2);
      localStorage.setItem("Premio2", "");
      localStorage.setItem("Puntaje2", "");
      localStorage.setItem("Cantidad2", "");
    } else //Eliminaros el segundo elemento de la lista
    {
      localStorage.setItem("Premio2", "");
      localStorage.setItem("Puntaje2", "");
      localStorage.setItem("Cantidad2", "");
    }
    var PuntajePedido = calcularPuntajePedido();
    $$('.SumaPuntos').text(PuntajePedido);
    if (PuntajePedido > PuntajeUsuario) {
      $$('.AlertaPedido').text("No tienes puntos suficientes para este canje.");
      $$('.pedido-canje').addClass("disabled");
    } else {
      $$('.pedido-canje').removeClass("disabled");
      $$('.AlertaPedido').text("");
    }
    if (PuntajePedido == 0) {
      $$('.pedido-canje').addClass("disabled");
    }
    actualizarBadge("menos");
  });
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
  window.locationManager = cordova.plugins.locationManager;
  // Start tracking beacons!
  startScan();
  
  // Display refresh timer.
  updateTimer = setInterval(displayBeaconList, 500);
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
            title: 'Beacon in range',
            text: 'iBeacon Scan detected a beacon, tap here to open app.'
          });
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

    // Start ranging.
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
  $('#found-beacons').empty();

  var timeNow = Date.now();

  // Update beacon list.
  $.each(beacons, function (key, beacon) {
    // Only show beacons that are updated during the last 60 seconds.
    if (beacon.timeStamp + 60000 > timeNow) {
      // Map the RSSI value to a width in percent for the indicator.
      var rssiWidth = 1; // Used when RSSI is zero or greater.
      if (beacon.rssi < -100) { rssiWidth = 100; }
      else if (beacon.rssi < 0) { rssiWidth = 100 + beacon.rssi; }
      var tipoEstimote;
      var puntaje;
      var mensaje;
      // Create tag to display beacon data.
      if (beacon.uuid == '65f3bc6c-f5bf-46df-a58b-8cb3e449fb9c') // Morado
      {
        tipoEstimote = "Fiestera";
        puntaje = 300;
        mensaje = "Que tenga una agradable fiesta";
      }
      if (beacon.uuid == 'b9407f30-f5f8-466e-aff9-25556b57fe6d') // Azul hielo
      {
        tipoEstimote = "Jacuzzi";
        puntaje = 200;
        mensaje = "Gracias por su preferencia";
      }
      if (beacon.uuid == 'f6ce6c6d-860b-4247-a370-a32c5421802d') // Verde
      {
        tipoEstimote = "Peatonal";
        puntaje = 100;
        mensaje = "Comodidad y discreción al alcance de su mano";
      }
      var element = $(
        '<li>'
        + '<strong>Habitacion: ' + tipoEstimote + '</strong><br />'
        + 'Puntaje: ' + puntaje + '<br />'
        + mensaje + '<br />'
        + '</li>'
      );

      $('#warning').remove();
      $('#found-beacons').append(element);
    }
  });
}