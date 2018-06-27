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
    path: '/premios/',
    name: 'premios',
    componentUrl: './pages/premios.html',
    on: {
      pageInit: function (event, page) {
        console.log(page);
        if (page.route.name=='Premios')
        {
          console.log("Se cargo la lista de premios");
        }
      }
    }
  },
  {
    path: '/detallePremio/pedidos/:IdPedido/',
    name: 'pedido' ,
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      var vIdPedido = routeTo.params.IdPedido;
      app.preloader.show();
      console.log("Se cargo la página de los pedidos: ");
       var user = {
         "firstName": "Vladimir",
         "lastName": "putaminof",
         "userId": vIdPedido,
         "about": "Hello, i am creator of Framework7! Hope you like it!"
       };
      resolve({
        componentUrl: './pages/pedidos.html'
      }, {
        context: {
          user: user
        }
      })
      app.preloader.hide();
    }, 
    on: {
      pageInit: function (event, page) {
        console.log("Se acaba a Pedidos");
      }
    }
  },
  {
    path: '/detallePremio/Id/:idPremio/TipoPremio/:TipoPremio/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      var vIdPremio = routeTo.params.idPremio;
      var vTipoPremio = routeTo.params.TipoPremio;
      console.log("TipoPremio: " + vTipoPremio);
      console.log("IdPremio: " + vIdPremio);
      var serviceURL = "http://www.chocolateboutiquemotel.com/sistema/app/servicios/";
      app.request.post(serviceURL + "detallePremio.php", {IdPremio: vIdPremio, TipoPremio : vTipoPremio } , function (data) { 
        console.log("Esto es lo que llega del server: " + data);
        var algo = JSON.parse(data);
        var user = algo;
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/detallePremio.html'
          },
          {
            context: {
              user: user
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
    componentUrl: './pages/favoritos.html'
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
