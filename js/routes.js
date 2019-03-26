routes = [
  {
    path: '/',
    url: './index.html',
    name: 'principal', 
    on:{
      pageInit: function (event,page) {
        if (page.route.name == 'principal')
        {
          limpiarLocalStorage();
          var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
          app.request.post(serviceURL + "avisoPrivacidad.php", function (data) {
            $$('.contenido-aviso-privacidad').html(data);
          });

          app.request.post(serviceURL + "terminos.php", function (data) {
            $$('.contenido-terminos').html(data);
          });
          // window.locationManager = cordova.plugins.locationManager;
          // startScan();
          updateTimer = setInterval(displayBeaconList, 500);
          app.popup.open(".demo-login", false);
          $$('#capa-premio-ganado').hide();
          // Llenamos el aviso de privacidad
        }
      }
    }
  },
  {
    path: '/consumos/',
    name: 'consumos',
    url: './pages/consumos.html',
    on: {
      pageInit: function (event, page) {
        var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
        var vId = localStorage.getItem("IdUsuario");
        console.log("Este el el id del usuario consulta desde pedido pendiente: " + vId)
        app.request.post(serviceURL + "consumosUsuario.php", {
          Id: vId,
        }, function (data) {
          $$('.consumos-usuario').html(data);
        });
      }
    }
  },
  {
    path: '/pedido-pendiente/',
    name: 'pedido-pendiente',
    url: './pages/pedidoPendiente.html',
    on: {
      pageInit: function (event, page) {
        var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
        var vId = localStorage.getItem("IdUsuario");
        app.request.post(serviceURL + "consultarCanjePendiente.php", {
          Id: vId,
        }, function (data) {
          var info = JSON.parse(data);
          if (info.Folio!="") {
            $$('#PedidoPendiente').text(info.Folio);
            $$('.msg-fecha-pedido-pendiente').text("El día: "+info.Fecha);
          }
          else{
            $$('.msg-pedido-pendiente').text("No tiene ningun pedido pendiente");
            $$('.msg-pedido-pendiente').text("");
          }
          console.log(info);
        });
      }
    }
  },
  {
    path: '/puntaje/',
    name: 'puntaje',
    url: './pages/puntaje.html',
    on: {
      pageInit: function (event, page) {
        var vId = localStorage.getItem("IdUsuario");
        app.request.post(serviceURL + "consultaPuntos.php", {
          IdUsuario: vId,
        }, function (data) {
          var info = JSON.parse(data);
          var PuntajeUsuario = info.Puntos;
          localStorage.setItem("PuntajeUsuario", info.Puntos);
          console.log("Este el puntaje traido del server " + PuntajeUsuario);
          if (PuntajeUsuario != "" || PuntajeUsuario != undefined || PuntajeUsuario != null )
          $$('.PuntajeUsuario').text(PuntajeUsuario);
          else
          $$('.PuntajeUsuario').text("Se requiere una conexión a internet para poder consultar su puntaje.");
        });  
        }
      }
  },
  {
    path: '/aviso-privacidad/',
    name: 'aviso-privacidad',
    url: './pages/avisoPrivacidad.html',
    on: {
      pageInit: function (event, page) {
        var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
        app.request.post(serviceURL + "avisoPrivacidad.php", function (data) {
          $$('.aviso-privacidad').html(data);
        });
      }
    }
  },
  {
    path: '/terminos/',
    name: 'terminos',
    url: './pages/terminos.html',
    on: {
      pageInit: function (event, page) {
        var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
        app.request.post(serviceURL + "terminos.php", function (data) {
          $$('.terminos-y-condiciones').html(data);
        });
      }
    }
  },
  {
    path: '/carrito/',
    name: 'carrito',
    componentUrl: './pages/carrito.html',
    on:{
      pageInit: function (e,page) {
        $$('.carrito-list').on('swipeout:deleted', function (e) {
          // Vamos a actualizar los puntos del canje y el mensaje de alerta (Si es el caso)
          var posicion = e.target.f7VirtualListIndex;
          // app.dialog.alert("Eliminaste el elemento " + posicion);
          
          if (posicion == 0) // Eliminaron el primer elemento de la lista
          {
            var PuntajeUsuario = localStorage.getItem("PuntajeUsuario");
            var Premio2 = localStorage.getItem("Premio2");
            var TipoPremio2 = localStorage.getItem("TipoPremio2");
            var Puntaje2 = localStorage.getItem("Puntaje2");
            var Cantidad2 = localStorage.getItem("Cantidad2");
            // vamos a pasar el premio2 al premio1 y limpiar premios2
            localStorage.setItem("Premio1", Premio2);
            localStorage.setItem("TipoPremio1", TipoPremio2);
            localStorage.setItem("Puntaje1", Puntaje2);
            localStorage.setItem("Cantidad1", Cantidad2);
            localStorage.setItem("Premio2", "");
            localStorage.setItem("TipoPremio2", "");
            localStorage.setItem("Puntaje2", "");
            localStorage.setItem("Cantidad2", "");
          } 
          else //Eliminaros el segundo elemento de la lista
          {
            localStorage.setItem("Premio2", "");
            localStorage.setItem("TipoPremio2", "");
            localStorage.setItem("Puntaje2", "");
            localStorage.setItem("Cantidad2", "");
          }
          var PuntajePedido = calcularPuntajePedido();
          $$('.SumaPuntosCarrito').text(PuntajePedido);

          if (PuntajePedido > PuntajeUsuario) {
            $$('.AlertaPedido').text("No tienes puntos suficientes para este canje.");
            $$('.carrito-canje').addClass("disabled");
          } else {
            $$('.carrito-canje').removeClass("disabled");
            $$('.AlertaPedido').text("");
          }
          if (PuntajePedido == 0) {
            $$('.carrito-canje').addClass("disabled");
            $$('.capa-boton-limipiar').hide();
          }
          actualizarBadge("menos");
        });

        $$('.carrito-canje').on('click', function () {
          realizarPedido('carrito');
          limpiarListaPedido('.carrito-list');
          $$('.carrito-canje').addClass("disabled");
          $$('.alerta-carrito').text("");
          $$('.capa-boton-limipiar').hide();
        });
        $$('#btn-limpiar-carrito').on('click', function () {
          // app.dialog.alert("Borrando pedido");
          limpiarLocalStorage();
          limpiarListaPedido('.carrito-list');
          $$('.capa-boton-limipiar').hide();
        });
     }
    }
  },
  {
    path: '/premios/',
    name: 'premios',
    componentUrl: './pages/premios.html',
    on: {
      pageInit: function (event, page) {
        actualizarListadoPremios('Barra', '.snack-list');
        actualizarListadoPremios('Cocina', '.cocina-list');
        actualizarListadoPremios('Habitacion', '.habitaciones-list');
        actualizarListadoPremios('SexShop', '.sexshop-list');         
      }
    }
  },
  // Agregar un elemento a la lista de pedidos
  {
    path: '/detallePremio/IdPremio/:IdPremio/TipoPremio/:TipoPremio/',
    name: 'pedido',
    on: {
      pageInit: function (event, page) {
        if (page.route.name == 'pedido') {
          var vPuntajeUsuario = localStorage.getItem("PuntajeUsuario");
          $$('#PuntajeUsuarioPedido').text(vPuntajeUsuario);
           serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
           var fechaActual = fechaHoy();
           var vIdUsuario = localStorage.getItem('IdUsuario');
          //  app.dialog.alert("La fecha de hoy: " + fechaActual);
           app.request.post(serviceURL + "ultimoPedido.php", {
             fecha: fechaActual,
             IdUsuario: vIdUsuario
            }, function (data) {
              var respuesta = data;
              if (respuesta!="1")
            { 
              var vIdPremio = localStorage.getItem("IdPremioGlobal");
              var vTipoPremio = localStorage.getItem("TipoPremioGlobal");
              var Cantidad = app.stepper.getValue('.stepper-pedido');
              // Hacemos la consulta al server para recibior de que premio se trata, cuantos puntos se requieren, 
              var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
              app.request.post(serviceURL + "detallePremio.php", { IdPremio: vIdPremio, TipoPremio: vTipoPremio}, function (data) {
                var info = JSON.parse(data);
                console.log("Esta es la info:");
                console.log(info);
                var elemento =[];
                var Premio1 = localStorage.getItem("Premio1");
                var TipoPremio1 = localStorage.getItem("TipoPremio1");
                var Puntaje1 = parseInt(localStorage.getItem("Puntaje1"));
                var Cantidad1 = parseInt(localStorage.getItem("Cantidad1"));
                var Premio2 = localStorage.getItem("Premio2");
                var TipoPremio2 = localStorage.getItem("TipoPremio2");
                var Puntaje2 = parseInt(localStorage.getItem("Puntaje2"));
                var Cantidad2 = parseInt(localStorage.getItem("Cantidad2"));
                // Si no tiene elementos en la lista, entonces ocultamos el botón
              // Verificamos que se pueda agrear el elemento actual elegido por el usuario
              if ((Cantidad1 + Cantidad) > 2)
              {
                app.dialog.alert("No se puede agregar este elemento a la lista, solo se permiten 2 artículos como máximo", "Advertencia");
                if (Premio1!= "")
                {
                  elemento.push({
                    Premio: Cantidad1 + " x " + Premio1,
                    Puntos: Cantidad1 * Puntaje1
                  })
                }
                if (Premio2 != "")
                {
                  elemento.push({
                    Premio: Cantidad2 + " x " + Premio2,
                    Puntos: Cantidad2 * Puntaje2
                  })
                }
              }
              else if (Premio1 == "" && Premio2 == "")  // Como está vacias esas variables, significa que es el primer elemento que eligen.
              { 
                $$('.iconito').text("1");
                localStorage.setItem("Premio1", info.Premio);
                console.log("Guardamos el Premio1:");
                console.log(info.Premio);
                localStorage.setItem("TipoPremio1", vTipoPremio);
                localStorage.setItem("Puntaje1", info.Puntos);
                localStorage.setItem("Cantidad1", Cantidad);
                localStorage.setItem("Cantidad1", Cantidad);
                elemento.push({
                  Premio: Cantidad + " x " + info.Premio,
                  Puntos: Cantidad * info.Puntos
                })
              }
              else if (Premio1 != "" && Premio2 == "") // Es el segudo elemento que insertan
              { 
                if ((vTipoPremio == "Habitacion" && TipoPremio1 == "Habitacion") || (vTipoPremio == "Cocina" && TipoPremio1 == "Cocina")) //Rechazamos por que el  usuario no puede elegir 2 habitaciones como canje
                {
                  app.dialog.alert("No pueden entregarse 2 habitaciónes en un mismo canje o dos productos de cocina, por favor elija un elemento diferente.", "Advertencia");
                  // Mostrarmos el elemento anterior en la lista.
                  var PremioAnterior = localStorage.getItem("Premio1");
                  var PuntajeAnterior = localStorage.getItem("Puntaje1");
                  var CantidadAnterior = localStorage.getItem("Cantidad1");
                  elemento.push({
                    Premio: CantidadAnterior + " x " + PremioAnterior,
                    Puntos: CantidadAnterior * PuntajeAnterior
                  })
                } 
                else 
                {
                  $$('.iconito').text("2");
                  var PremioAnterior = localStorage.getItem("Premio1");
                  var PuntajeAnterior = localStorage.getItem("Puntaje1");
                  var CantidadAnterior = localStorage.getItem("Cantidad1");
                  localStorage.setItem("Premio2", info.Premio);
                  localStorage.setItem("TipoPremio2", vTipoPremio);
                  localStorage.setItem("Puntaje2", info.Puntos);
                  localStorage.setItem("Cantidad2", Cantidad);
                  elemento.push({
                    Premio: CantidadAnterior + " x " + PremioAnterior,
                    Puntos: CantidadAnterior * PuntajeAnterior
                  })
                  elemento.push({
                    Premio: Cantidad + " x " + info.Premio,
                    Puntos: Cantidad * info.Puntos
                  })
                }
              }
              else if (Premio1 != "" && Premio2!= "")
              {
                app.dialog.alert("No se puede agregar este elemento a la lista, solo se permiten 2 artículos como máximo","Advertencia");
                elemento.push({
                  Premio: Cantidad1 + " x " + Premio1,
                  Puntos: Cantidad1 * Puntaje1
                })
                elemento.push({
                  Premio: Cantidad2 + " x " + Premio2,
                  Puntos: Cantidad2 * Puntaje2
                })
              }
              
              // Calculamos la suma de puntos de de ambos elementos            
              var PuntajePedido = calcularPuntajePedido();
              $$('.SumaPuntos').text(PuntajePedido);
              if (PuntajePedido == 0 )
              {
                $$('.pedido-canje').addClass("disabled");
              }
              if (PuntajePedido > vPuntajeUsuario)
              {
                $$('.AlertaPedido').text("No tienes puntos suficientes para este canje.");
                $$('.pedido-canje').addClass("disabled");
              }
              else
              {
                $$('.pedido-canje').removeClass("disabled");
              } 
              console.log("Revistamos los elementos que se insertan en la lista virtual");
              console.log(elemento); 
              if (Premio1 != "")
              $$('.capa-boton-limipiar').show();
              
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
                
              // Si eliminan un elemento de la lista.
              $$('.pedidos-list').on('swipeout:deleted', function (e) {
                // Vamos a actualizar los puntos del canje y el mensaje de alerta (Si es el caso)
                var posicion = e.target.f7VirtualListIndex;
                // app.dialog.alert("Eliminaste el elemento de la vista de pedido: " + posicion);
                if (posicion == 0) // Eliminaron el primer elemento de la lista
                {
                  // vamos a pasar el premio2 al premio1 y limpiar premios2
                  var Premio2 = localStorage.getItem("Premio2");
                  var TipoPremio2 = localStorage.getItem("TipoPremio2");
                  var Puntaje2 = localStorage.getItem("Puntaje2");
                  var Cantidad2 = localStorage.getItem("Cantidad2");
                  localStorage.setItem("Premio1",Premio2); 
                  localStorage.setItem("TipoPremio1",TipoPremio2); 
                  localStorage.setItem("Puntaje1",Puntaje2); 
                  localStorage.setItem("Cantidad1",Cantidad2); 
                  localStorage.setItem("Premio2",""); 
                  localStorage.setItem("TipoPremio2",""); 
                  localStorage.setItem("Puntaje2",""); 
                  localStorage.setItem("Cantidad2",""); 
                }
                else //Eliminaros el segundo elemento de la lista
                {
                  localStorage.setItem("Premio2", "");
                  localStorage.setItem("TipoPremio2", "");
                  localStorage.setItem("Puntaje2", "");
                  localStorage.setItem("Cantidad2", "");
                }
                var PuntajePedido = calcularPuntajePedido();
                
                $$('.SumaPuntos').text(PuntajePedido.toLocaleString('es-ES'));
                if (PuntajePedido > vPuntajeUsuario) {
                  $$('.AlertaPedido').text("No tienes puntos suficientes para este canje.");
                  $$('.pedido-canje').addClass("disabled");
                } else {
                  $$('.pedido-canje').removeClass("disabled");
                  $$('.AlertaPedido').text("");
                }
                if (PuntajePedido == 0)
                {
                  $$('.pedido-canje').addClass("disabled");
                  $$('.capa-boton-limipiar').hide();
                  $$('.AlertaPedido').text("");
                }
                actualizarBadge("menos");
              });
              
              $$('.pedido-canje').on('click', function () {
                realizarPedido('premios');
                $$('.pedido-canje').addClass("disabled");
                $$('.capa-boton-limipiar').hide();
              });
              
              $$('#btn-limpiar-pedido').on('click', function () {
                limpiarLocalStorage();
                limpiarListaPedido('.pedidos-list');
                $$('.capa-boton-limipiar').hide();
              });
            });
          }
          else
          {
              app.dialog.alert("Sólo se permite un pedido por dia, incluso si tiene puntos suficientes. Gracias Por su compresión");
              $$('.pedido-canje').addClass("disabled");
              $$('.SumaPuntos').text("0");
              $$('.capa-boton-limipiar').hide();
            }
          });
        }
      }
    },
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      // Recibimos las variables
      var vIdPremio = routeTo.params.IdPremio;
      var vTipoPremio = routeTo.params.TipoPremio;
      localStorage.setItem("IdPremioGlobal",vIdPremio);
      localStorage.setItem("TipoPremioGlobal",vTipoPremio);
      app.preloader.hide();
      resolve({
        componentUrl: './pages/pedidos.html'
      }) 
    } // Fin de funcion asyncrona
  },
  {
    path: '/detallePremio/Id/:idPremio/TipoPremio/:TipoPremio/',
    on:{
      // Cambiamos el puntaje que se muestra en el detalle del premio en base a la cantidad elegida por el usuario
      pageInit: function (e){
        $$('.stepper-pedido').on('stepper:change', function (e) {
          validarPuntajePremioActual();  
        });
      }
    },
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      var vIdPremio = routeTo.params.idPremio;
      var vTipoPremio = routeTo.params.TipoPremio;
      var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
      app.request.post(serviceURL + "detallePremio.php", {IdPremio: vIdPremio, TipoPremio : vTipoPremio } , function (data) { 
        var info = JSON.parse(data);
        localStorage.setItem("PuntosPremioActual",info.Puntos);
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/detallePremio.html'
          },
          {
            context: {
              premio: info
            }
          }
        )
      });  
    },
  },
  {
    path: '/cambiarpass/',
    componentUrl: './pages/cambiarpass.html'
  },
  {
    path: '/product/:id/',
    componentUrl: './pages/product.html'
  },
  {
    path: '/ayuda/',
    on: {
      // Cambiamos el puntaje que se muestra en el detalle del premio en base a la cantidad elegida por el usuario
      pageInit: function (e) {
        var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
        app.request.post(serviceURL + "ayuda.php", function (data) {
          $$('.contenido-ayuda').html(data);
        });
      }
    },
    url: './pages/ayuda.html'
  },
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html'
  },

  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html'
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html'
  },
];
