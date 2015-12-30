 require([
         "dojo/dom-construct",
         "dojo/on",
         "dojo/dom",
         "esri/map",
         "esri/dijit/HomeButton",
         "esri/dijit/BasemapToggle",
         "esri/dijit/Popup",
         "esri/dijit/PopupTemplate",
         "esri/InfoTemplate",
         "dojo/_base/Color",
         "esri/symbols/SimpleMarkerSymbol",
         "esri/symbols/SimpleFillSymbol",
         "esri/symbols/SimpleLineSymbol",
         "esri/dijit/Search",
         "esri/tasks/locator",
         "esri/geometry/Extent",

         "./vendor/geojsonlayer.js",
         "dojo/domReady!"
     ],
     function(dc, on, dom, Map, HomeButton, BasemapToggle, Popup, PopupTemplate, InfoTemplate, Color, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, Search, Locator, Extent, GeoJsonLayer) {

         // create a popup to replace the map's info window
         var fillSymbol3 = new SimpleFillSymbol(SimpleFillSymbol.STYLE_BACKWARD_DIAGONAL,
             new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                 new Color([0, 255, 255]), 2),
             new Color([0, 255, 255, 0.25]));
         var pointSymbol = new SimpleMarkerSymbol("circle", 26, null,
             new Color([0, 0, 0, 0.25]));

         var popup = new Popup({
             fillSymbol: fillSymbol3,
             // lineSymbol:
             markerSymbol: pointSymbol,
             visibleWhenEmpty: false,
             hideDelay: -1
         }, dc.create("div"));

         // Create map
         var map = new Map("mapDiv", {
             basemap: "gray",
             center: [-112.5, 33.5],
             minZoom: 7,
             maxZoom: 19,
             showAttribution: false,
             sliderPosition: "bottom-right",
             scrollWheelZoom: true,
             infoWindow: popup
         });

         map.on("load", function() {
             addGeoJsonLayer("./data/gccDistricts.json");
         });

         // create div for homebutton
         var homeButton = new HomeButton({
             map: map,
             visible: true //show the button
         }, dc.create("div", {
             id: "HomeButton"
         }, "mapDiv", "last"));
         homeButton._homeNode.title = "Original Extent";
         homeButton.startup();

         //create toggleBasemap
         var toggle = new BasemapToggle({
             map: map,
             visible: true,
             basemap: "satellite"
         }, dc.create("div", {
             id: "BasemapToggle"
         }, "mapDiv", "last"));
         toggle.startup();

         var search = new Search({
             map: map
                 // sources: [],
         }, "search");
         search.startup();

         // var sources = [{
         //     locator: new Locator("//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"),
         //     singleLineFieldName: "SingleLine",
         //     autoNavigate: true,
         //     enableInfoWindow: true,
         //     enableHighlight: false,
         //     autoSelect: false,
         //     showInfoWindowOnSelect: true,
         //     name: "Address",
         //     countryCode: "US",
         //     searchExtent: new Extent({
         //         "xmin": -114.68,
         //         "ymin": 31.29,
         //         "xmax": -109.06,
         //         "ymax": 36.99
         //     }),
         // }];


         var infoTemplate = new InfoTemplate();
         infoTemplate.setTitle("Districts");
         infoTemplate.setContent("<t1>${District}</t1><br>" + "District Executive: ${DE}<br>" + "<a href='${Website}'>Website Link</a>");

         // Add the layer
         function addGeoJsonLayer(url) {
             // Create the layer
             var geoJsonLayer = new GeoJsonLayer({
                 url: url,
                 outFields: ["*"],
                 infoTemplate: infoTemplate
             });
             // Zoom to layer
             geoJsonLayer.on("update-end", function(e) {
                 map.setExtent(e.target.extent.expand(1.2));
             });
             // Add to map
             map.addLayer(geoJsonLayer);
         }

     });

 // Bindings
 //=================================================================================>
 //
 $(document).ready(function() {
     //*** About modal binding
     $("#aboutInfo").load("views/about.html");
     //*** Legal Disclaimer modal binding
     $("#legalDisclaimer").load("views/legalDisclaimer.html");

     // // add version and date to about.html
     // var version = "v1.0.1 | 12/30/2015";
     // dom.byId("version").innerHTML = version;

 });