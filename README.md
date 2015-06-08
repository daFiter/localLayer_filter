LocalLayer_filter Widget 0.1
==

<a href="http://gis.ashland.or.us/demo3/" target="_blank">Demo</a>

<img src="http://gis.ashland.or.us/demo3/images/widget.PNG" alt="Widget">

:exclamation: IMPORTANT: Most of this widget was taken from Adam Drackley's LocalLayer Widget. 
Rickey Fite, Stan McShinsky, and Robert Scheitlin have been the major contribitors. 


The LocalLayer Widget for ArcGIS Web AppBuilder is intended to allow the direct addition of ArcGIS for Server Mapservices to an ArcGIS Web AppBuilder application and filter the attributes, without needing to wrap the desired services in an ArcGIS Online/Portal Web Map.  The Legend, LayerList, and AttributeTable widgets should continue to work with your local layers.

:bulb: In addition to the setup steps below, Rebecca Strauch generously provides and updates a living document of Tips and Tricks for implementing and using this widget.  Please find it on her GeoNet blog located [here](https://geonet.esri.com/blogs/myAlaskaGIS/2015/02/04/tips-for-using-the-custom-locallayer-widget-with-wab-dev-edition).


###Setting up the Widget

 
To add a layer change the filter and layer you need to change 3 documents: 
1. The configs\LocalLayer_filter\config_local Layer Widget Filter.json file.
```json
Example:
	"layers": {
    "layer": [
      {
        "type": "Feature",
        "url": "http://yoururl/arcgis/rest/services/sandbox/crimeloc/MapServer/2",
        "name": "crimeloc_filter",
        "opacity": 0.59,
        "visible": true,
        "showLabels": true,
        "popup": {
          "title": "Crime",
          "fieldInfos": [
            {
              "fieldName": "crime",
              "label": "crime",
              "visible": true
            }     
            ],
          "showAttachments": true,
          "tr": null
        },
        "autorefresh": 0,
        "mode": "ondemand"
      }
    ]
  }
```
2. Change the \widgets\LocalLayer_filter\widget.js file starting at line 48.

:exclamation: IMPORTANT: There are 3 major places in widget.js that need to be update for this to work. 

Make sure that you have enough defExp to match the number of filters you want. 

```
var defExp = '',
      defExp2 = null,
      defExp3 = null,
      fromDate = null,
      toDate = null,
      crimeDate = null,
      filterLayer = null;
```
      
Change the definition to one that works with your layer and  make sure that you have enough defExp to match the number of filters you want.   


  ```
  constructor: function () {
        this._originalWebMap = null;
        defExp = 'crime =\'Larceny/Theft\'';//change this
        defExp2 = '';
        defExp3 = '';
      },    
  ```
  
  Change the filter options that you want displayed. Keep track of the numbers that the filter corresponds with.
  
  
``` 
 applyFilter: function(selValue) {
        switch (selValue) {
        case '0':
          defExp = 'crime =\'Larceny/Theft\'';
          break;
        case '1':
          defExp = 'crime =\'Vehicle Theft\'';
          break;
        case 'Clear':
          defExp = '';
          break;
```
  
  3. Change the \widgets\LocalLayer_filter\widget.html.
  
  The value needs to match the value in widget.js. It does not matter what your label is. 


``` 
    <select data-dojo-attach-point="s122" data-dojo-type="dijit/form/Select">
          <option value="0" selected="selected">Larceny/Theft</option>
          <option value="1">Vehicle Theft</option>
          <option value="2">Assult</option>
          <option value="6">Other</option>
          <option value="7">DUII</option>
          <option value="8">Fraud</option>
          <option value="9">Burglary</option>
          <option value="10">Traffic Stop</option>
          <option value="" disabled="true">----------</option>
          <option value="Clear">All</option>
     </select>     
```  
        
  
  
