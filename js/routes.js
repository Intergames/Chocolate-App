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
          // window.locationManager = cordova.plugins.locationManager;
          // startScan();
          // updateTimer = setInterval(displayBeaconList, 500);
          app.popup.open(".demo-login", false);
          $('#capa-premio-ganado').hide();
        }
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
          }
          else{
            $$('.msg-pedido-pendiente').text("No tiene ningun pedido pendiente");
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
        if (page.route.name == 'puntaje') {
          var PuntajeUsuario = localStorage.getItem("PuntajeUsuario");
          $$('.PuntajeUsuario').text(PuntajeUsuario);
        }
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
          var PuntajeUsuario = localStorage.getItem("PuntajeUsuario");
          if (posicion == 0) // Eliminaron el primer elemento de la lista
          {
            // vamos a pasar el premio2 al premio1 y limpiar premios2
            var Premio2 = localStorage.getItem("Premio2");
            var TipoPremio2 = localStorage.getItem("TipoPremio2");
            var Puntaje2 = localStorage.getItem("Puntaje2");
            var Cantidad2 = localStorage.getItem("Cantidad2");
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
          }
          actualizarBadge("menos");
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
         actualizarListadoPremios('Habitacion', '.habitaciones-list');
         actualizarListadoPremios('Barra', '.snack-list');
         actualizarListadoPremios('Cocina', '.cocina-list');
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
           var PedidoHoy = ultimoPedido();
           if (!PedidoHoy)
           { 
            var vIdPremio = localStorage.getItem("IdPremioGlobal");
            var vTipoPremio = localStorage.getItem("TipoPremioGlobal");
            var vPuntajeUsuario = localStorage.getItem("PuntajeUsuario");
            var Cantidad = app.stepper.getValue('.stepper-pedido');
            $$('.PuntajeUsuarioPedido').text(vPuntajeUsuario);
            // Hacemos la consulta al server para recibior de que premio se trata, cuantos puntos se requieren, 
            var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
            app.request.post(serviceURL + "detallePremio.php", { IdPremio: vIdPremio, TipoPremio: vTipoPremio}, function (data) {
            var info = JSON.parse(data);
            var elemento =[];
            var Premio1 = localStorage.getItem("Premio1");
            var TipoPremio1 = localStorage.getItem("TipoPremio1");
            var Puntaje1 = parseInt(localStorage.getItem("Puntaje1"));
            var Cantidad1 = parseInt(localStorage.getItem("Cantidad1"));
            var Premio2 = localStorage.getItem("Premio2");
            var TipoPremio2 = localStorage.getItem("TipoPremio2");
            var Puntaje2 = parseInt(localStorage.getItem("Puntaje2"));
            var Cantidad2 = parseInt(localStorage.getItem("Cantidad2"));
            // Verificamos que se pueda agrear el elemento actual elegido por el usuario
            if ((Cantidad1 + Cantidad) > 2)
            {
              app.dialog.alert("No se puede agregar este elemento a la lista, solo se permiten 2 articulos como máximo", "Advertencia");
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
              localStorage.setItem("TipoPremio1", vTipoPremio);
              localStorage.setItem("Puntaje1", info.Puntos);
              localStorage.setItem("Cantidad1", Cantidad);
              elemento.push({
                Premio: Cantidad + " x " + info.Premio,
                Puntos: Cantidad * info.Puntos
              })
            }
            else if (Premio1 != "" && Premio2 == "") // Es el segudo elemento que insertan
            { 
              console.log("vTipoPremio");
              console.log(vTipoPremio);
              console.log("TipoPremio");
              console.log(TipoPremio1);
              if (vTipoPremio == "Habitacion" && TipoPremio1 == "Habitacion") //Rechazamos por que el  usuario no puede elegir 2 habitaciones como canje
              {
                app.dialog.alert("No pueden entregarse 2 habitaciones en un mismo canje, por favor elija un elemento diferente.", "Advertencia");
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
              app.dialog.alert("No se puede agregar este elemento a la lista, solo se permiten 2 articulos como máximo","Advertencia");
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

            app.virtualList.create({
              // List Element
              el: '.pedidos-list',
              items: elemento,          
              itemTemplate: 
              '<li class="swipeout deleted-callback">' +
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
              // Item height
              // height: app.theme === 'ios' ? 63 : 73,
            });
            
            $$('.deleted-callback').on('swipeout:deleted', function (e) {
              // Vamos a actualizar los puntos del canje y el mensaje de alerta (Si es el caso)
              var posicion = e.target.f7VirtualListIndex;
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

              $$('.SumaPuntos').text(PuntajePedido);
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
              }
              actualizarBadge("menos");
            });

            $$('.pedido-canje').on('click', function () {
              console.log("Clic en pedir caje");
              realizarPedido('premios');
              $$('.pedido-canje').addClass("disabled");
            });
          
          });
          }
          else
          {
            app.dialog.alert("Ya hiciste un pedido hoy, por favor intenta mañana");
          }
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
    path: '/settings/',
    url: './pages/settings.html'
  },
  // Page Loaders & Router
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
