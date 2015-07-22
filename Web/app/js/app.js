
/*!
 * 
 * Angle - Bootstrap Admin App + AngularJS
 * 
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: http://support.wrapbootstrap.com/knowledge_base/topics/usage-licenses
 * 
 */

if (typeof $ === 'undefined') { throw new Error('This application\'s JavaScript requires jQuery'); }

// APP START
// ----------------------------------- 

var App = angular.module('angle', [
    'ngRoute',
    'ngAnimate',
    'ngStorage',
    'ngCookies',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    'oc.lazyLoad',
    'cfp.loadingBar',
    'ngSanitize',
    'ngResource',
    'ui.utils'
]);

App.run(["$rootScope", "$state", "$stateParams", '$window', '$templateCache', function ($rootScope, $state, $stateParams, $window, $templateCache) {

    // Set reference to access them from any scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$storage = $window.localStorage;

    // Uncomment this to disable template cache
    /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (typeof(toState) !== 'undefined'){
          $templateCache.remove(toState.templateUrl);
        }
    });*/

    // Scope Globals
    // ----------------------------------- 
    $rootScope.app = {
        name: 'iWork',
        description: 'iWork - Manage your daily works!',
        year: ((new Date()).getFullYear()),
        layout: {
            isFixed: true,
            isCollapsed: true,
            isBoxed: false,
            isRTL: false,
            horizontal: false,
            isFloat: false,
            asideHover: false,
            theme: null
        },
        useFullLayout: false,
        hiddenFooter: false,
        viewAnimation: 'ng-fadeInUp'
    };
    $rootScope.user = {
        name: 'John',
        job: 'ng-developer',
        //picture: 'app/img/user/02.jpg'
    };

}]);

/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
    'use strict';

    // Set the following to true to enable the HTML5 Mode
    // You may have to set <base> tag in index and a routing configuration in your server
    $locationProvider.html5Mode(false);

    // default route
    $urlRouterProvider.otherwise('/app/singleview');

    // 
    // Application Routes
    // -----------------------------------   
    $stateProvider
      .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: helper.basepath('app.html'),
          controller: 'AppController',
          resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'loaders.css', 'spinkit','moment')
      })
      .state('app.singleview', {
          url: '/singleview',
          title: 'Single View',
          templateUrl: helper.basepath('singleview.html')
      })
      .state('app.submenu', {
          url: '/submenu',
          title: 'Submenu',
          templateUrl: helper.basepath('submenu.html')
      })
    // 
    // CUSTOM RESOLVES
    //   Add your own resolves properties
    //   following this object extend
    //   method
    // ----------------------------------- 
    // .state('app.someroute', {
    //   url: '/some_url',
    //   templateUrl: 'path_to_template.html',
    //   controller: 'someController',
    //   resolve: angular.extend(
    //     helper.resolveFor(), {
    //     // YOUR RESOLVES GO HERE
    //     }
    //   )
    // })
    ;


}]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
    'use strict';

    // Lazy Load modules configuration
    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: APP_REQUIRES.modules
    });

}]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
        'use strict';
        // registering components after bootstrap
        App.controller = $controllerProvider.register;
        App.directive = $compileProvider.directive;
        App.filter = $filterProvider.register;
        App.factory = $provide.factory;
        App.service = $provide.service;
        App.constant = $provide.constant;
        App.value = $provide.value;

    }]).config(['$translateProvider', function ($translateProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'app/i18n/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLocalStorage();
        $translateProvider.usePostCompiling(true);

    }]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 500;
        cfpLoadingBarProvider.parentSelector = '.wrapper > section';
    }]).config(['$tooltipProvider', function ($tooltipProvider) {

        $tooltipProvider.options({ appendToBody: true });

    }])
;

/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/
App
  .constant('APP_COLORS', {
      'primary': '#5d9cec',
      'success': '#27c24c',
      'info': '#23b7e5',
      'warning': '#ff902b',
      'danger': '#f05050',
      'inverse': '#131e26',
      'green': '#37bc9b',
      'pink': '#f532e5',
      'purple': '#7266ba',
      'dark': '#3a3f51',
      'yellow': '#fad732',
      'gray-darker': '#232735',
      'gray-dark': '#3a3f51',
      'gray': '#dde6e9',
      'gray-light': '#e4eaec',
      'gray-lighter': '#edf1f2'
  })
  .constant('APP_MEDIAQUERY', {
      'desktopLG': 1200,
      'desktop': 992,
      'tablet': 768,
      'mobile': 480
  })
  .constant('APP_REQUIRES', {
      // jQuery based and standalone scripts
      scripts: {
          'whirl': ['vendor/whirl/dist/whirl.css'],
          'classyloader': ['vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
          'animo': ['vendor/animo.js/animo.js'],
          'fastclick': ['vendor/fastclick/lib/fastclick.js'],
          'modernizr': ['vendor/modernizr/modernizr.js'],
          'animate': ['vendor/animate.css/animate.min.css'],
          'icons': ['vendor/skycons/skycons.js',
                                 'vendor/fontawesome/css/font-awesome.min.css',
                                 'vendor/simple-line-icons/css/simple-line-icons.css',
                                 'vendor/weather-icons/css/weather-icons.min.css'],
          'sparklines': ['vendor/sparklines/jquery.sparkline.min.js'],
          'wysiwyg': ['vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                                 'vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
          'slimscroll': ['vendor/slimScroll/jquery.slimscroll.min.js'],
          'screenfull': ['vendor/screenfull/dist/screenfull.js'],
          'vector-map': ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
                                 'vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'],
          'vector-map-maps': ['vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
                                 'vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js'],
          'loadGoogleMapsJS': ['vendor/gmap/load-google-maps.js'],
          'flot-chart': ['vendor/Flot/jquery.flot.js'],
          'flot-chart-plugins': ['vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                                 'vendor/Flot/jquery.flot.resize.js',
                                 'vendor/Flot/jquery.flot.pie.js',
                                 'vendor/Flot/jquery.flot.time.js',
                                 'vendor/Flot/jquery.flot.categories.js',
                                 'vendor/flot-spline/js/jquery.flot.spline.min.js'],
          // jquery core and widgets
          'jquery-ui': ['vendor/jquery-ui/ui/core.js',
                                 'vendor/jquery-ui/ui/widget.js'],
          // loads only jquery required modules and touch support
          'jquery-ui-widgets': ['vendor/jquery-ui/ui/core.js',
                                 'vendor/jquery-ui/ui/widget.js',
                                 'vendor/jquery-ui/ui/mouse.js',
                                 'vendor/jquery-ui/ui/draggable.js',
                                 'vendor/jquery-ui/ui/droppable.js',
                                 'vendor/jquery-ui/ui/sortable.js',
                                 'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'],
          'moment': ['vendor/moment/min/moment-with-locales.min.js'],
          'inputmask': ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js'],
          'flatdoc': ['vendor/flatdoc/flatdoc.js'],
          'codemirror': ['vendor/codemirror/lib/codemirror.js',
                                 'vendor/codemirror/lib/codemirror.css'],
          // modes for common web files
          'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
                                   'vendor/codemirror/mode/xml/xml.js',
                                   'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                                   'vendor/codemirror/mode/css/css.js'],
          'taginput': ['vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                                 'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'],
          'filestyle': ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
          'parsley': ['vendor/parsleyjs/dist/parsley.min.js'],
          'fullcalendar': ['vendor/fullcalendar/dist/fullcalendar.min.js',
                                 'vendor/fullcalendar/dist/fullcalendar.css'],
          'gcal': ['vendor/fullcalendar/dist/gcal.js'],
          'chartjs': ['vendor/Chart.js/Chart.js'],
          'morris': ['vendor/raphael/raphael.js',
                                 'vendor/morris.js/morris.js',
                                 'vendor/morris.js/morris.css'],
          'loaders.css': ['vendor/loaders.css/loaders.css'],
          'spinkit': ['vendor/spinkit/css/spinkit.css']
      },
      // Angular based script (use the right module name)
      modules: [
        {
            name: 'toaster', files: ['vendor/angularjs-toaster/toaster.js',
                                                      'vendor/angularjs-toaster/toaster.css']
        },
        {
            name: 'localytics.directives', files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js',
                                                      'vendor/chosen_v1.2.0/chosen.min.css',
                                                      'vendor/angular-chosen-localytics/chosen.js']
        },
        {
            name: 'ngDialog', files: ['vendor/ngDialog/js/ngDialog.min.js',
                                                      'vendor/ngDialog/css/ngDialog.min.css',
                                                      'vendor/ngDialog/css/ngDialog-theme-default.min.css']
        },
        { name: 'ngWig', files: ['vendor/ngWig/dist/ng-wig.min.js'] },
        {
            name: 'ngTable', files: ['vendor/ng-table/dist/ng-table.min.js',
                                                       'vendor/ng-table/dist/ng-table.min.css']
        },
        { name: 'ngTableExport', files: ['vendor/ng-table-export/ng-table-export.js'] },
        {
            name: 'angularBootstrapNavTree', files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                                                       'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']
        },
        {
            name: 'htmlSortable', files: ['vendor/html.sortable/dist/html.sortable.js',
                                                       'vendor/html.sortable/dist/html.sortable.angular.js']
        },
        {
            name: 'xeditable', files: ['vendor/angular-xeditable/dist/js/xeditable.js',
                                                       'vendor/angular-xeditable/dist/css/xeditable.css']
        },
        { name: 'angularFileUpload', files: ['vendor/angular-file-upload/angular-file-upload.js'] },
        {
            name: 'ngImgCrop', files: ['vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                                                       'vendor/ng-img-crop/compile/unminified/ng-img-crop.css']
        },
        {
            name: 'ui.select', files: ['vendor/angular-ui-select/dist/select.js',
                                                       'vendor/angular-ui-select/dist/select.css']
        },
        { name: 'ui.codemirror', files: ['vendor/angular-ui-codemirror/ui-codemirror.js'] },
        {
            name: 'angular-carousel', files: ['vendor/angular-carousel/dist/angular-carousel.css',
                                                       'vendor/angular-carousel/dist/angular-carousel.js']
        },
        {
            name: 'ngGrid', files: ['vendor/ng-grid/build/ng-grid.min.js',
                                                       'vendor/ng-grid/ng-grid.css']
        },
        { name: 'infinite-scroll', files: ['vendor/ngInfiniteScroll/build/ng-infinite-scroll.js'] },
        {
            name: 'ui.bootstrap-slider', files: ['vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                                                       'vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
                                                       'vendor/angular-bootstrap-slider/slider.js']
        },
        {
            name: 'ui.grid', files: ['vendor/angular-ui-grid/ui-grid.min.css',
                                                       'vendor/angular-ui-grid/ui-grid.min.js']
        },
        { name: 'textAngularSetup', files: ['vendor/textAngular/src/textAngularSetup.js'] },
        {
            name: 'textAngular', files: ['vendor/textAngular/dist/textAngular-rangy.min.js',
                                                       'vendor/textAngular/src/textAngular.js',
                                                       'vendor/textAngular/src/textAngularSetup.js',
                                                       'vendor/textAngular/src/textAngular.css'], serie: true
        },
        {
            name: 'angular-rickshaw', files: ['vendor/d3/d3.min.js',
                                                       'vendor/rickshaw/rickshaw.js',
                                                       'vendor/rickshaw/rickshaw.min.css',
                                                       'vendor/angular-rickshaw/rickshaw.js'], serie: true
        },
        {
            name: 'angular-chartist', files: ['vendor/chartist/dist/chartist.min.css',
                                                       'vendor/chartist/dist/chartist.js',
                                                       'vendor/angular-chartist.js/dist/angular-chartist.js'], serie: true
        },
        { name: 'ui.map', files: ['vendor/angular-ui-map/ui-map.js'] },
        {
            name: 'datatables', files: ['vendor/datatables/media/css/jquery.dataTables.css',
                                                       'vendor/datatables/media/js/jquery.dataTables.js',
                                                       'vendor/angular-datatables/dist/angular-datatables.js'], serie: true
        },
        {
            name: 'angular-jqcloud', files: ['vendor/jqcloud2/dist/jqcloud.css',
                                                       'vendor/jqcloud2/dist/jqcloud.js',
                                                       'vendor/angular-jqcloud/angular-jqcloud.js']
        },
        {
            name: 'angularGrid', files: ['vendor/ag-grid/dist/angular-grid.css',
                                                       'vendor/ag-grid/dist/angular-grid.js',
                                                       'vendor/ag-grid/dist/theme-dark.css',
                                                       'vendor/ag-grid/dist/theme-fresh.css']
        },
        {
            name: 'ng-nestable', files: ['vendor/ng-nestable/src/angular-nestable.js',
                                                       'vendor/nestable/jquery.nestable.js']
        },
        { name: 'akoenig.deckgrid', files: ['vendor/angular-deckgrid/angular-deckgrid.js'] }
      ]
  })
;
/**=========================================================
 * Module: main.js
 * Main Application Controller
 =========================================================*/

App.controller('AppController',
  ['$rootScope', '$scope', '$state', '$translate', '$window', '$localStorage', '$timeout', 'toggleStateService', 'colors', 'browser', 'cfpLoadingBar',
  function ($rootScope, $scope, $state, $translate, $window, $localStorage, $timeout, toggle, colors, browser, cfpLoadingBar) {
      "use strict";

      // Setup the layout mode
      $rootScope.app.layout.horizontal = ($rootScope.$stateParams.layout == 'app-h');

      // Loading bar transition
      // ----------------------------------- 
      var thBar;
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
          if ($('.wrapper > section').length) // check if bar container exists
              thBar = $timeout(function () {
                  cfpLoadingBar.start();
              }, 0); // sets a latency Threshold
      });
      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
          event.targetScope.$watch("$viewContentLoaded", function () {
              $timeout.cancel(thBar);
              cfpLoadingBar.complete();
          });
      });


      // Hook not found
      $rootScope.$on('$stateNotFound',
        function (event, unfoundState, fromState, fromParams) {
            console.log(unfoundState.to); // "lazy.state"
            console.log(unfoundState.toParams); // {a:1, b:2}
            console.log(unfoundState.options); // {inherit:false} + default options
        });
      // Hook error
      $rootScope.$on('$stateChangeError',
        function (event, toState, toParams, fromState, fromParams, error) {
            console.log(error);
        });
      // Hook success
      $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            // display new view from top
            $window.scrollTo(0, 0);
            // Save the route title
            $rootScope.currTitle = $state.current.title;
        });

      $rootScope.currTitle = $state.current.title;
      $rootScope.pageTitle = function () {
          var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
          document.title = title;
          return title;
      };

      // iPad may presents ghost click issues
      // if( ! browser.ipad )
      // FastClick.attach(document.body);

      // Close submenu when sidebar change from collapsed to normal
      $rootScope.$watch('app.layout.isCollapsed', function (newValue, oldValue) {
          if (newValue === false)
              $rootScope.$broadcast('closeSidebarMenu');
      });

      // Restore layout settings
      if (angular.isDefined($localStorage.layout))
          $scope.app.layout = $localStorage.layout;
      else
          $localStorage.layout = $scope.app.layout;

      $rootScope.$watch("app.layout", function () {
          $localStorage.layout = $scope.app.layout;
      }, true);


      // Allows to use branding color with interpolation
      // {{ colorByName('primary') }}
      $scope.colorByName = colors.byName;

      // Internationalization
      // ----------------------

      $scope.language = {
          // Handles language dropdown
          listIsOpen: false,
          // list of available languages
          available: {
              'en': 'English',
              'es_AR': 'Español'
          },
          // display always the current ui language
          init: function () {
              var proposedLanguage = $translate.proposedLanguage() || $translate.use();
              var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
              $scope.language.selected = $scope.language.available[(proposedLanguage || preferredLanguage)];
          },
          set: function (localeId, ev) {
              // Set the new idiom
              $translate.use(localeId);
              // save a reference for the current language
              $scope.language.selected = $scope.language.available[localeId];
              // finally toggle dropdown
              $scope.language.listIsOpen = !$scope.language.listIsOpen;
          }
      };

      $scope.language.init();

      // Restore application classes state
      toggle.restoreState($(document.body));

      // cancel click event easily
      $rootScope.cancel = function ($event) {
          $event.stopPropagation();
      };

  }]);

/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

App.controller('SidebarController', ['$rootScope', '$scope', '$state', '$http', '$timeout', 'Utils',
  function ($rootScope, $scope, $state, $http, $timeout, Utils) {

      var collapseList = [];

      // demo: when switch from collapse to hover, close all items
      $rootScope.$watch('app.layout.asideHover', function (oldVal, newVal) {
          if (newVal === false && oldVal === true) {
              closeAllBut(-1);
          }
      });

      // Check item and children active state
      var isActive = function (item) {

          if (!item) return;

          if (!item.sref || item.sref == '#') {
              var foundActive = false;
              angular.forEach(item.submenu, function (value, key) {
                  if (isActive(value)) foundActive = true;
              });
              return foundActive;
          }
          else
              return $state.is(item.sref) || $state.includes(item.sref);
      };

      // Load menu from json file
      // ----------------------------------- 

      $scope.getMenuItemPropClasses = function (item) {
          return (item.heading ? 'nav-heading' : '') +
                 (isActive(item) ? ' active' : '');
      };

      $scope.loadSidebarMenu = function () {

          var menuJson = 'app/js/sidebar-menu.json',
              menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache
          $http.get(menuURL)
            .success(function (items) {
                $scope.menuItems = items;
            })
            .error(function (data, status, headers, config) {
                alert('Failure loading menu');
            });
      };

      $scope.loadSidebarMenu();

      // Handle sidebar collapse items
      // ----------------------------------- 

      $scope.addCollapse = function ($index, item) {
          collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
      };

      $scope.isCollapse = function ($index) {
          return (collapseList[$index]);
      };

      $scope.toggleCollapse = function ($index, isParentItem) {


          // collapsed sidebar doesn't toggle drodopwn
          if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) return true;

          // make sure the item index exists
          if (angular.isDefined(collapseList[$index])) {
              if (!$scope.lastEventFromChild) {
                  collapseList[$index] = !collapseList[$index];
                  closeAllBut($index);
              }
          }
          else if (isParentItem) {
              closeAllBut(-1);
          }

          $scope.lastEventFromChild = isChild($index);

          return true;

      };

      function closeAllBut(index) {
          index += '';
          for (var i in collapseList) {
              if (index < 0 || index.indexOf(i) < 0)
                  collapseList[i] = true;
          }
      }

      function isChild($index) {
          return (typeof $index === 'string') && !($index.indexOf('-') < 0);
      }

  }]);

/**=========================================================
 * Module: navbar-search.js
 * Navbar search toggler * Auto dismiss on ESC key
 =========================================================*/

App.directive('searchOpen', ['navSearch', function (navSearch) {
    'use strict';

    return {
        restrict: 'A',
        controller: ["$scope", "$element", function ($scope, $element) {
            $element
              .on('click', function (e) { e.stopPropagation(); })
              .on('click', navSearch.toggle);
        }]
    };

}]).directive('searchDismiss', ['navSearch', function (navSearch) {
    'use strict';

    var inputSelector = '.navbar-form input[type="text"]';

    return {
        restrict: 'A',
        controller: ["$scope", "$element", function ($scope, $element) {

            $(inputSelector)
              .on('click', function (e) { e.stopPropagation(); })
              .on('keyup', function (e) {
                  if (e.keyCode == 27) // ESC
                      navSearch.dismiss();
              });

            // click anywhere closes the search
            $(document).on('click', navSearch.dismiss);
            // dismissable options
            $element
              .on('click', function (e) { e.stopPropagation(); })
              .on('click', navSearch.dismiss);
        }]
    };

}]);


/**=========================================================
 * Module: sidebar.js
 * Wraps the sidebar and handles collapsed state
 =========================================================*/

App.directive('sidebar', ['$rootScope', '$window', 'Utils', function ($rootScope, $window, Utils) {

    var $win = $($window);
    var $body = $('body');
    var $scope;
    var $sidebar;
    var currentState = $rootScope.$state.current.name;

    return {
        restrict: 'EA',
        template: '<nav class="sidebar" ng-transclude></nav>',
        transclude: true,
        replace: true,
        link: function (scope, element, attrs) {

            $scope = scope;
            $sidebar = element;

            var eventName = Utils.isTouch() ? 'click' : 'mouseenter';
            var subNav = $();
            $sidebar.on(eventName, '.nav > li', function () {

                if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) {

                    subNav.trigger('mouseleave');
                    subNav = toggleMenuItem($(this));

                    // Used to detect click and touch events outside the sidebar          
                    sidebarAddBackdrop();

                }

            });

            scope.$on('closeSidebarMenu', function () {
                removeFloatingNav();
            });

            // Normalize state when resize to mobile
            $win.on('resize', function () {
                if (!Utils.isMobile())
                    $body.removeClass('aside-toggled');
            });

            // Adjustment on route changes
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                currentState = toState.name;
                // Hide sidebar automatically on mobile
                $('body.aside-toggled').removeClass('aside-toggled');

                $rootScope.$broadcast('closeSidebarMenu');
            });

            // Allows to close
            if (angular.isDefined(attrs.sidebarAnyclickClose)) {

                $('.wrapper').on('click.sidebar', function (e) {
                    // don't check if sidebar not visible
                    if (!$body.hasClass('aside-toggled')) return;

                    // if not child of sidebar
                    if (!$(e.target).parents('.aside').length) {
                        $body.removeClass('aside-toggled');
                    }

                });
            }

        }
    };

    function sidebarAddBackdrop() {
        var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop' });
        $backdrop.insertAfter('.aside-inner').on("click mouseenter", function () {
            removeFloatingNav();
        });
    }

    // Open the collapse sidebar submenu items when on touch devices 
    // - desktop only opens on hover
    function toggleTouchItem($element) {
        $element
          .siblings('li')
          .removeClass('open')
          .end()
          .toggleClass('open');
    }

    // Handles hover to open items under collapsed menu
    // ----------------------------------- 
    function toggleMenuItem($listItem) {

        removeFloatingNav();

        var ul = $listItem.children('ul');

        if (!ul.length) return $();
        if ($listItem.hasClass('open')) {
            toggleTouchItem($listItem);
            return $();
        }

        var $aside = $('.aside');
        var $asideInner = $('.aside-inner'); // for top offset calculation
        // float aside uses extra padding on aside
        var mar = parseInt($asideInner.css('padding-top'), 0) + parseInt($aside.css('padding-top'), 0);
        var subNav = ul.clone().appendTo($aside);

        toggleTouchItem($listItem);

        var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
        var vwHeight = $win.height();

        subNav
          .addClass('nav-floating')
          .css({
              position: $scope.app.layout.isFixed ? 'fixed' : 'absolute',
              top: itemTop,
              bottom: (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
          });

        subNav.on('mouseleave', function () {
            toggleTouchItem($listItem);
            subNav.remove();
        });

        return subNav;
    }

    function removeFloatingNav() {
        $('.dropdown-backdrop').remove();
        $('.sidebar-subnav.nav-floating').remove();
        $('.sidebar li.open').removeClass('open');
    }

}]);
/**=========================================================
 * Module: toggle-state.js
 * Toggle a classname from the BODY Useful to change a state that 
 * affects globally the entire layout or more than one item 
 * Targeted elements must have [toggle-state="CLASS-NAME-TO-TOGGLE"]
 * User no-persist to avoid saving the sate in browser storage
 =========================================================*/

App.directive('toggleState', ['toggleStateService', function (toggle) {
    'use strict';

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var $body = $('body');

            $(element)
              .on('click', function (e) {
                  e.preventDefault();
                  var classname = attrs.toggleState;

                  if (classname) {
                      if ($body.hasClass(classname)) {
                          $body.removeClass(classname);
                          if (!attrs.noPersist)
                              toggle.removeState(classname);
                      }
                      else {
                          $body.addClass(classname);
                          if (!attrs.noPersist)
                              toggle.addState(classname);
                      }

                  }

              });
        }
    };

}]);

/**=========================================================
 * Module: browser.js
 * Browser detection
 =========================================================*/

App.service('browser', function () {
    "use strict";

    var matched, browser;

    var uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(opr)[\/]([\w.]+)/.exec(ua) ||
          /(chrome)[ \/]([\w.]+)/.exec(ua) ||
          /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
          /(webkit)[ \/]([\w.]+)/.exec(ua) ||
          /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
          /(msie) ([\w.]+)/.exec(ua) ||
          ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
          ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
          [];

        var platform_match = /(ipad)/.exec(ua) ||
          /(iphone)/.exec(ua) ||
          /(android)/.exec(ua) ||
          /(windows phone)/.exec(ua) ||
          /(win)/.exec(ua) ||
          /(mac)/.exec(ua) ||
          /(linux)/.exec(ua) ||
          /(cros)/i.exec(ua) ||
          [];

        return {
            browser: match[3] || match[1] || "",
            version: match[2] || "0",
            platform: platform_match[0] || ""
        };
    };

    matched = uaMatch(window.navigator.userAgent);
    browser = {};

    if (matched.browser) {
        browser[matched.browser] = true;
        browser.version = matched.version;
        browser.versionNumber = parseInt(matched.version);
    }

    if (matched.platform) {
        browser[matched.platform] = true;
    }

    // These are all considered mobile platforms, meaning they run a mobile browser
    if (browser.android || browser.ipad || browser.iphone || browser["windows phone"]) {
        browser.mobile = true;
    }

    // These are all considered desktop platforms, meaning they run a desktop browser
    if (browser.cros || browser.mac || browser.linux || browser.win) {
        browser.desktop = true;
    }

    // Chrome, Opera 15+ and Safari are webkit based browsers
    if (browser.chrome || browser.opr || browser.safari) {
        browser.webkit = true;
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    if (browser.rv) {
        var ie = "msie";

        matched.browser = ie;
        browser[ie] = true;
    }

    // Opera 15+ are identified as opr
    if (browser.opr) {
        var opera = "opera";

        matched.browser = opera;
        browser[opera] = true;
    }

    // Stock Android browsers are marked as Safari on Android.
    if (browser.safari && browser.android) {
        var android = "android";

        matched.browser = android;
        browser[android] = true;
    }

    // Assign the name and platform variable
    browser.name = matched.browser;
    browser.platform = matched.platform;


    return browser;

});
/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/

App.factory('colors', ['APP_COLORS', function (colors) {

    return {
        byName: function (name) {
            return (colors[name] || '#fff');
        }
    };

}]);

/**=========================================================
 * Module: nav-search.js
 * Services to share navbar search functions
 =========================================================*/

App.service('navSearch', function () {
    var navbarFormSelector = 'form.navbar-form';
    return {
        toggle: function () {

            var navbarForm = $(navbarFormSelector);

            navbarForm.toggleClass('open');

            var isOpen = navbarForm.hasClass('open');

            navbarForm.find('input')[isOpen ? 'focus' : 'blur']();

        },

        dismiss: function () {
            $(navbarFormSelector)
              .removeClass('open')      // Close control
              .find('input[type="text"]').blur() // remove focus
              .val('')                    // Empty input
            ;
        }
    };

});
/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

App.provider('RouteHelpers', ['APP_REQUIRES', function (appRequires) {
    "use strict";

    // Set here the base of the relative path
    // for all app views
    this.basepath = function (uri) {
        return 'iview/' + uri;
    };

    // Generates a resolve object by passing script names
    // previously configured in constant.APP_REQUIRES
    this.resolveFor = function () {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad', '$q', function ($ocLL, $q) {
                // Creates a promise chain for each argument
                var promise = $q.when(1); // empty promise
                for (var i = 0, len = _args.length; i < len; i++) {
                    promise = andThen(_args[i]);
                }
                return promise;

                // creates promise to chain dynamically
                function andThen(_arg) {
                    // also support a function that returns a promise
                    if (typeof _arg == 'function')
                        return promise.then(_arg);
                    else
                        return promise.then(function () {
                            // if is a module, pass the name. If not, pass the array
                            var whatToLoad = getRequired(_arg);
                            // simple error check
                            if (!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                            // finally, return a promise
                            return $ocLL.load(whatToLoad);
                        });
                }
                // check and returns required data
                // analyze module items with the form [name: '', files: []]
                // and also simple array of script files (for not angular js)
                function getRequired(name) {
                    if (appRequires.modules)
                        for (var m in appRequires.modules)
                            if (appRequires.modules[m].name && appRequires.modules[m].name === name)
                                return appRequires.modules[m];
                    return appRequires.scripts && appRequires.scripts[name];
                }

            }]
        };
    }; // resolveFor

    // not necessary, only used in config block for routes
    this.$get = function () { };

}]);


/**=========================================================
 * Module: toggle-state.js
 * Services to share toggle state functionality
 =========================================================*/

App.service('toggleStateService', ['$rootScope', function ($rootScope) {

    var storageKeyName = 'toggleState';

    // Helper object to check for words in a phrase //
    var WordChecker = {
        hasWord: function (phrase, word) {
            return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
        },
        addWord: function (phrase, word) {
            if (!this.hasWord(phrase, word)) {
                return (phrase + (phrase ? ' ' : '') + word);
            }
        },
        removeWord: function (phrase, word) {
            if (this.hasWord(phrase, word)) {
                return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
            }
        }
    };

    // Return service public methods
    return {
        // Add a state to the browser storage to be restored later
        addState: function (classname) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);

            if (!data) {
                data = classname;
            }
            else {
                data = WordChecker.addWord(data, classname);
            }

            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },

        // Remove a state from the browser storage
        removeState: function (classname) {
            var data = $rootScope.$storage[storageKeyName];
            // nothing to remove
            if (!data) return;

            data = WordChecker.removeWord(data, classname);

            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },

        // Load the state string and restore the classlist
        restoreState: function ($elem) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);

            // nothing to restore
            if (!data) return;
            $elem.addClass(data);
        }

    };

}]);
/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

App.service('Utils', ["$window", "APP_MEDIAQUERY", function ($window, APP_MEDIAQUERY) {
    'use strict';

    var $html = angular.element("html"),
        $win = angular.element($window),
        $body = angular.element('body');

    return {
        // DETECTION
        support: {
            transition: (function () {
                var transitionEnd = (function () {

                    var element = document.body || document.documentElement,
                        transEndEventNames = {
                            WebkitTransition: 'webkitTransitionEnd',
                            MozTransition: 'transitionend',
                            OTransition: 'oTransitionEnd otransitionend',
                            transition: 'transitionend'
                        }, name;

                    for (name in transEndEventNames) {
                        if (element.style[name] !== undefined) return transEndEventNames[name];
                    }
                }());

                return transitionEnd && { end: transitionEnd };
            })(),
            animation: (function () {

                var animationEnd = (function () {

                    var element = document.body || document.documentElement,
                        animEndEventNames = {
                            WebkitAnimation: 'webkitAnimationEnd',
                            MozAnimation: 'animationend',
                            OAnimation: 'oAnimationEnd oanimationend',
                            animation: 'animationend'
                        }, name;

                    for (name in animEndEventNames) {
                        if (element.style[name] !== undefined) return animEndEventNames[name];
                    }
                }());

                return animationEnd && { end: animationEnd };
            })(),
            requestAnimationFrame: window.requestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame ||
                                   window.msRequestAnimationFrame ||
                                   window.oRequestAnimationFrame ||
                                   function (callback) { window.setTimeout(callback, 1000 / 60); },
            touch: (
                ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
                (window.DocumentTouch && document instanceof window.DocumentTouch) ||
                (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
                (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
                false
            ),
            mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
        },
        // UTILITIES
        isInView: function (element, options) {

            var $element = $(element);

            if (!$element.is(':visible')) {
                return false;
            }

            var window_left = $win.scrollLeft(),
                window_top = $win.scrollTop(),
                offset = $element.offset(),
                left = offset.left,
                top = offset.top;

            options = $.extend({ topoffset: 0, leftoffset: 0 }, options);

            if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
                return true;
            } else {
                return false;
            }
        },
        langdirection: $html.attr("dir") == "rtl" ? "right" : "left",
        isTouch: function () {
            return $html.hasClass('touch');
        },
        isSidebarCollapsed: function () {
            return $body.hasClass('aside-collapsed');
        },
        isSidebarToggled: function () {
            return $body.hasClass('aside-toggled');
        },
        isMobile: function () {
            return $win.width() < APP_MEDIAQUERY.tablet;
        }
    };
}]);
// To run this code, edit file 
// index.html or index.jade and change
// html data-ng-app attribute from
// angle to myAppName
// ----------------------------------- 

var myApp = angular.module('myAppName', ['angle']);

myApp.run(["$log", function ($log) {

    $log.log('I\'m a line from custom.js');

}]);

myApp.config(["RouteHelpersProvider", function (RouteHelpersProvider) {

    // Custom Route definition

}]);

myApp.controller('oneOfMyOwnController', ["$scope", function ($scope) {
    /* controller code */
}]);

myApp.directive('oneOfMyOwnDirectives', function () {
    /*directive code*/
});

myApp.config(["$stateProvider", function ($stateProvider /* ... */) {
    /* specific routes here (see file config.js) */
}]);
