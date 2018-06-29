routes = [
  {
    path: '/',
    url: './index.html'
  },

  {
    path: '/about/',
    url: './pages/about.html'
  },

  {
    path: '/carrito/',
    url: './pages/pedidos.html'
  },

  {
    path: '/premios/',
    name: 'premios',
    componentUrl: './pages/premios.html',
    on: {
      pageInit: function (event, page) {
        if (page.route.name=='premios')
        {
          actualizarListadoPremios('Habitacion', '.habitaciones-list');
          actualizarListadoPremios('Barra', '.snack-list');
          actualizarListadoPremios('Cocina', '.cocina-list');
          actualizarListadoPremios('SexShop', '.sexshop-list');
        }
      }
    }
  },
  // Agregar un elemento a la lista de pedidos
  {
    path: '/detallePremio/IdPremio/:IdPremio/TipoPremio/:TipoPremio/',
    name: 'pedido' ,
    on: {
      pageInit: function (event, page) {
         if (page.route.name == 'pedido') {
           var vIdPremio = localStorage.getItem("IdPremioGlobal");
           var vTipoPremio = localStorage.getItem("TipoPremioGlobal");
           // Hacemos la consulta al server para recibior de que premio se trata, cuantos puntos se requieren, 
           var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
           app.request.post(serviceURL + "detallePremio.php", { IdPremio: vIdPremio, TipoPremio: vTipoPremio}, function (data) {
            var info = JSON.parse(data);
            var elemento =[];
            var Premio1 = localStorage.getItem("Premio1");
            var Puntaje1 = localStorage.getItem("Puntaje1");
            var Premio2 = localStorage.getItem("Premio2");
            var Puntaje2 = localStorage.getItem("Puntaje2");

            if (Premio1 == "" && Premio2 == "")
            { // Como está vacias esas variables, significa que es el primer elemento que eligen.
              localStorage.setItem("Premio1", info.Premio);
              localStorage.setItem("Puntaje1", info.Puntos);
              elemento.push({
                Premio: info.Premio,
                Puntos: info.Puntos
              })
            }
            else if (Premio1 != "" && Premio2 == "")
            {
              
              var PremioAnterior = localStorage.getItem("Premio1");
              var PuntajeAnterior = localStorage.getItem("Puntaje1");
              localStorage.setItem("Premio2", info.Premio);
              localStorage.setItem("Puntaje2", info.Puntos);
              
              elemento.push({
                Premio: PremioAnterior,
                Puntos: PuntajeAnterior
              })
              elemento.push({
                Premio: info.Premio,
                Puntos: info.Puntos
              })
            }
            else if(Premio1 != "" && Premio2!= "")
            {
              app.dialog.alert("No se puede agregar este elemento a la lista, solo se permiten 2 articulos como máximo");
              elemento.push({
                Premio: Premio1,
                Puntos: Puntaje1
              })
              elemento.push({
                Premio: Premio2,
                Puntos: Puntaje2
              })
            }      
            // Calculamos la suma de puntos de de ambos elementos
            var Premio1 = localStorage.getItem("Premio1");
            var Puntaje1 = localStorage.getItem("Puntaje1");
            var Premio2 = localStorage.getItem("Premio2");
            var Puntaje2 = localStorage.getItem("Puntaje2");
            if (Puntaje1 == "")
              Puntaje1 = 0;
            if (Puntaje2 == "")
              Puntaje2 = 0;
            var PuntajePedido = parseFloat(Puntaje1) + parseFloat(Puntaje2);
            $$('.SumaPuntos').text(PuntajePedido);
            app.virtualList.create({
              // List Element
              el: '.pedidos-list',
              // Pass array with items
              items: elemento,          
              // List item Template7 template
              itemTemplate: '<li>' +
                '<a href="#" class="item-link item-content">' +
                '<div class="item-inner">' +
                '<div class="item-title-row">' +
                '<div class="item-title">{{Premio}}</div>' +
                '</div>' +
                '<div class="item-subtitle">{{Puntos}}</div>' +
                '</div>' +
                '</a>' +
                '</li>',
              // Item height
              height: app.theme === 'ios' ? 63 : 73,
            });
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
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      var vIdPremio = routeTo.params.idPremio;
      var vTipoPremio = routeTo.params.TipoPremio;
      var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
      app.request.post(serviceURL + "detallePremio.php", {IdPremio: vIdPremio, TipoPremio : vTipoPremio } , function (data) { 
        var info = JSON.parse(data);
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
    path: '/favoritos/',
    url: './pages/pedidos.html'
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
