/*global define, dojo, window, $*/
define([
 'dojo/_base/declare',
 'jimu/BaseWidget',
 'jimu/ConfigManager',
 'jimu/MapManager',
 'esri/urlUtils',
 'dojo/_base/array',
 'dojo/_base/query',
 'dojo/_base/connect',
 'esri/layers/ArcGISDynamicMapServiceLayer',
 'esri/layers/ArcGISTiledMapServiceLayer',
 'esri/layers/FeatureLayer',
 'esri/layers/ImageParameters',
 'esri/dijit/BasemapGallery',
 'esri/dijit/BasemapLayer',
 'esri/dijit/Basemap',
 'esri/basemaps',
 'esri/dijit/PopupTemplate',
 'dojo/_base/html',
 'dojo/on',
 'dojo/dom',
 'dojo/_base/lang',
 'dijit/form/Select'
  ],
  function (
    declare,
    BaseWidget,
    ConfigManager,
    MapManager,
    urlUtils,
    array,
    query,
    connect,
    ArcGISDynamicMapServiceLayer,
    ArcGISTiledMapServiceLayer,
    FeatureLayer,
    ImageParameters,
    BasemapGallery,
    BasemapLayer,
    Basemap,
    esriBasemaps,
    PopupTemplate,
    html,
    on,
    dom,
    lang) {
    var defExp = '',
      defExp2 = null,
      defExp3 = null,
      fromDate = null,
      toDate = null,
      crimeDate = null,
      filterLayer = null;

    var clazz = declare([BaseWidget], {
      baseClass: 'definition_query',

      //this property is set by the framework when widget is loaded.
      name: 'LocalLayer_filter',

      constructor: function () {
        this._originalWebMap = null;
        defExp = 'crime =\'Larceny/Theft\'';
        defExp2 = '';
        defExp3 = '';
      },

      postCreate: function () {
        this.inherited(arguments);
      },

      onClose: function () {
        if (query('.jimu-popup.widget-setting-popup', window.parent.document).length === 0) {
          var _currentExtent = dojo.clone(this.map.extent);
          var _changedData = {
            itemId: this._originalWebMap
          };
          var _newBasemap = connect.subscribe('mapChanged', function (_map) {
            _newBasemap.remove();
            _map.setExtent(_currentExtent);
          });
          MapManager.getInstance().onAppConfigChanged(ConfigManager.getConfig(), 'mapChange', _changedData);
        }
      },

      initSelects: function() {
        //setup change event for selects
        query('select').forEach(lang.hitch(this, function (node) {
          on(node, 'change', lang.hitch(this, function (e) {
            var target = e.target || e.srcElement;
            this.applyFilter(target.value);
          }));
        }));
      },

      applyFilter: function(selValue) {
        switch (selValue) {
        case '0':
          defExp = 'crime =\'Larceny/Theft\'';
          break;
        case '1':
          defExp = 'crime =\'Vehicle Theft\'';
          break;
        case '2':
          defExp = 'crime =\'Assult\'';
          break;
        case '6':
          defExp = 'crime =\'Other\'';
          break;
        case '7':
          defExp = 'crime =\'DUII\'';
          break;
        case '8':
          defExp = 'crime =\'Fraud\'';
          break;
        case '9':
          defExp = 'crime =\'Burglary\'';
          break;
        case '10':
          defExp = 'crime =\'Traffic Stop\'';
          break;
        case 'Clear':
          defExp = '';
          break;
        case '103':
          defExp2 = 'Month=\'August\'';
          break;
        case '104':
          defExp2 = 'Month=\'July\'';
          break;
        case '105':
          defExp2 = 'Month=\'December\'';
          break;
        case '106':
          defExp2 = crimeDate;
          break;
        case '107':
          if(fromDate && toDate){
            defExp2 = 'Date >=\'' + fromDate + '\' AND Date <= \'' + toDate + '\'';
          } else {
            defExp2 = '';
          }
          break;
        case 'Clear2':
          defExp2 = '';
          break;
        case '010':
          defExp3 = 'Time_1 >= \'06:00\' AND Time_1 <= \'20:00\'';
          break;
        case '011':
          defExp3 = 'NOT Time BETWEEN \'00:00:00\' AND \'06:59:59\' AND NOT Time BETWEEN \'10:00:00\' AND \'16:59:59\' AND NOT Time BETWEEN \'20;00;00\' AND \'24:59:59\'';
          break;
        case '012':
          defExp3 = 'NOT Time BETWEEN \'07:00:00\' AND \'19:59:59\'';
          break;
        case '013':
          defExp3 = 'NOT Time BETWEEN \'03:00:00\' AND \'21:00\'';
          break;
        case 'Clear3':
          defExp3 = '';
          break;
        }

        var defArr = [];
        if (defExp !== '') {
          defArr.push(defExp);
        }
        if (defExp2 !== '') {
          defArr.push(defExp2);
        }
        if (defExp3 !== '') {
          defArr.push(defExp3);
        }
        filterLayer.setDefinitionExpression(defArr.join(' AND '));
        console.info(defArr.join(' AND '));
      },

      startup: function () {
          
          
     //--------hide date picker--------------------      
 $("#date").change(function () {
        var selected = $(this).val();

        if (selected != '') {
            var values = $.map($('#date>option'), function (e) {
                return e.value;
            });

            values.forEach(function (item) {
                if (item != '') {
                    if (selected == item) {
                        $('.' + item).show();
                    } else {
                        $('.' + item).hide();
                    }
                } else {
                    //Show all rows
                }
            });
        } else {
            $('table tr').show();
        }
    });
      
        //--------date picker--------------------
        $(function () {
          $('#from').datepicker({
            // minDate: -90,
            maxDate: '+0D',
            defaultDate: '+1w',
            changeMonth: true,
            numberOfMonths: 2,
            changeYear: true,
            onClose: function (selectedDate) {
              $('#to').datepicker('option', 'minDate', selectedDate);
              fromDate = selectedDate;
              if(fromDate && toDate){
                var defArr = [];
                if (defExp !== '') {
                  defArr.push(defExp);
                }
                defArr.push('Date >=\'' + fromDate + '\' AND Date <= \'' + toDate + '\'');
                if (defExp3 !== '') {
                  defArr.push(defExp3);
                }
                filterLayer.setDefinitionExpression(defArr.join(' AND '));
              }
            }
          });
          $('#to').datepicker({
            maxDate: '+0D',
            defaultDate: '+1w',
            changeMonth: true,
            numberOfMonths: 2,
            changeYear: true,
            onClose: function (selectedDate) {
              $('#from').datepicker('option', 'maxDate', selectedDate);
              toDate = selectedDate;
              if(fromDate && toDate){
                var defArr = [];
                if (defExp !== '') {
                  defArr.push(defExp);
                }
                defArr.push('Date >=\'' + fromDate + '\' AND Date <= \'' + toDate + '\'');
                if (defExp3 !== '') {
                  defArr.push(defExp3);
                }
                filterLayer.setDefinitionExpression(defArr.join(' AND '));
              }
            }
          });
        });
        //------------end date picker---------------
        this.initSelects();
        //-----------------------------------------------local Layer--------------------------------------------------------------
        this._originalWebMap = this.map.webMapResponse.itemInfo.item.id;

        if (this.config.useProxy) {
          urlUtils.addProxyRule({
            urlPrefix: this.config.proxyPrefix,
            proxyUrl: this.config.proxyAddress
          });
        }

        crimeDate = this.config.crimes;
        this.config.layers.layer.forEach(function (layer) {
          var lLayer;
          var lOptions = {};
          if (layer.hasOwnProperty('opacity')) {
            lOptions.opacity = layer.opacity;
          }
          if (layer.hasOwnProperty('visible') && !layer.visible) {
            lOptions.visible = false;
          } else {
            lOptions.visible = true;
          }
          if (layer.name) {
            lOptions.id = layer.name;
          }
          if (layer.type.toUpperCase() === 'DYNAMIC') {
            if (layer.imageformat) {
              var ip = new ImageParameters();
              ip.format = layer.imageformat;
              if (layer.hasOwnProperty('imagedpi')) {
                ip.dpi = layer.imagedpi;
              }
              lOptions.imageParameters = ip;
            }
            lLayer = new ArcGISDynamicMapServiceLayer(layer.url, lOptions);
            if (layer.popup) {
              var finalInfoTemp = {};
              array.forEach(layer.popup.infoTemplates, function (_infoTemp) {
                var popupInfo = {};
                popupInfo.title = _infoTemp.title;
                if (_infoTemp.description) {
                  popupInfo.description = _infoTemp.description;
                } else {
                  popupInfo.description = null;
                }
                if (_infoTemp.fieldInfos) {
                  popupInfo.fieldInfos = _infoTemp.fieldInfos;
                }
                var _popupTemplate1 = new PopupTemplate(popupInfo);
                finalInfoTemp[_infoTemp.layerId] = {
                  infoTemplate: _popupTemplate1
                };
              });
              lLayer.setInfoTemplates(finalInfoTemp);
            }
            if (layer.disableclientcaching) {
              lLayer.setDisableClientCaching(true);
            }
            lLayer.on('load', function (evt) {
              var removeLayers = [];
              array.forEach(evt.layer.visibleLayers, function (layer) {
                //remove any grouplayers
                if (evt.layer.layerInfos[layer].subLayerIds) {
                  removeLayers.push(layer);
                } else {
                  var _layerCheck = dojo.clone(layer);
                  while (evt.layer.layerInfos[_layerCheck].parentLayerId > -1) {
                    if (evt.layer.visibleLayers.indexOf(evt.layer.layerInfos[_layerCheck].parentLayerId) == -1) {
                      removeLayers.push(layer);
                    }
                    _layerCheck = dojo.clone(evt.layer.layerInfos[_layerCheck].parentLayerId);
                  }
                }
              });
              array.forEach(removeLayers, function (layerId) {
                evt.layer.visibleLayers.splice(evt.layer.visibleLayers.indexOf(layerId), 1);
              });
            });
            this._viewerMap.addLayer(lLayer);
            this._viewerMap.setInfoWindowOnClick(true);
          } else if (layer.type.toUpperCase() === 'FEATURE') {
            var _popupTemplate;
            if (layer.popup) {
              _popupTemplate = new PopupTemplate(layer.popup);
              lOptions.infoTemplate = _popupTemplate;
            }
            if (layer.hasOwnProperty('mode')) {
              var lmode;
              if (layer.mode === 'ondemand') {
                lmode = 1;
              } else if (layer.mode === 'snapshot') {
                lmode = 0;
              } else if (layer.mode === 'selection') {
                lmode = 2;
              }
              lOptions.mode = lmode;
            }
            lOptions.outFields = ['*'];
            if (layer.hasOwnProperty('autorefresh')) {
              lOptions.refreshInterval = layer.autorefresh;
            }
            if (layer.hasOwnProperty('showLabels')) {
              lOptions.showLabels = true;
            }
            lLayer = new FeatureLayer(layer.url, lOptions);
            lLayer.on('load', function (evt) {
              evt.layer.name = lOptions.id;
            });
            this._viewerMap.addLayer(lLayer);
            //-----------------------------------------------Apply Initial Filter-----------------------------------------------------
            filterLayer = lLayer;
            var defArr = [];
            if (defExp !== '') {
              defArr.push(defExp);
            }
            if (defExp2 !== '') {
              defArr.push(defExp2);
            }
            if (defExp3 !== '') {
              defArr.push(defExp3);
            }
            lLayer.setDefinitionExpression(defArr.join(' AND '));
            //----Number of Features---------------
            lLayer.on('update-end', function (evt) {
              dom.byId('featcount').innerHTML = ' ' + evt.target.graphics.length;
            });
            //-------------------
          } else if (layer.type.toUpperCase() === 'TILED') {
            if (layer.displayLevels) {
              lOptions.displayLevels = layer.displayLevels;
            }
            if (layer.hasOwnProperty('autorefresh')) {
              lOptions.refreshInterval = layer.autorefresh;
            }
            lLayer = new ArcGISTiledMapServiceLayer(layer.url, lOptions);
            if (layer.popup) {
              var finalInfoTemp2 = {};
              array.forEach(layer.popup.infoTemplates, function (_infoTemp) {
                var popupInfo = {};
                popupInfo.title = _infoTemp.title;
                if (_infoTemp.content) {
                  popupInfo.description = _infoTemp.content;
                } else {
                  popupInfo.description = null;
                }
                if (_infoTemp.fieldInfos) {
                  popupInfo.fieldInfos = _infoTemp.fieldInfos;
                }
                var _popupTemplate2 = new PopupTemplate(popupInfo);
                finalInfoTemp2[_infoTemp.layerId] = {
                  infoTemplate: _popupTemplate2
                };
              });
              lLayer.setInfoTemplates(finalInfoTemp2);
            }
            this._viewerMap.addLayer(lLayer);
          } else if (layer.type.toUpperCase() === 'BASEMAP') {
            var bmLayers = array.map(layer.layers.layer, function (bLayer) {
              var bmLayerObj = {
                url: bLayer.url,
                isReference: false
              };
              if (bLayer.displayLevels) {
                bmLayerObj.displayLevels = bLayer.displayLevels;
              }
              if (layer.hasOwnProperty('opacity')) {
                bmLayerObj.opacity = bLayer.opacity;
              }
              return new BasemapLayer(bmLayerObj);
            });
            var _newBasemap = new Basemap({
              id: 'defaultBasemap',
              title: layer.name,
              layers: bmLayers
            });
            var _basemapGallery = new BasemapGallery({
              showArcGISBasemaps: false,
              map: this._viewerMap
            }, '_tmpBasemapGallery');
            _basemapGallery.add(_newBasemap);
            _basemapGallery.select('defaultBasemap');
            _basemapGallery.destroy();
          }
        });
      }
    });
    return clazz;
  });
