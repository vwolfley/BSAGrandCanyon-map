// Leaflet style map

// mapbox access Token
L.mapbox.accessToken = "pk.eyJ1IjoidndvbGZsZXkiLCJhIjoiY2lpdW40MjVuMDAyMnVna215anVtcWRsaCJ9.-Jn65V2EqkK-0SjT5N4kkQ";

var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>';
var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidndvbGZsZXkiLCJhIjoiY2lpdW40MjVuMDAyMnVna215anVtcWRsaCJ9.-Jn65V2EqkK-0SjT5N4kkQ.Y8bhBaUMqFiPrDRW9hieoQ';

var geoCodeSearch = "https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json?types=us,Arizona&access_token=pk.eyJ1IjoidndvbGZsZXkiLCJhIjoiY2lpdW40MjVuMDAyMnVna215anVtcWRsaCJ9.-Jn65V2EqkK-0SjT5N4kkQ";

var grayscale = L.tileLayer(mbUrl, {
    id: "mapbox.light",
    attribution: mbAttr,
    minZoom: 7,
    maxZoom: 18
});
var streets = L.tileLayer(mbUrl, {
    id: "mapbox.streets",
    attribution: mbAttr,
    minZoom: 7,
    maxZoom: 18
});
var satellite = L.tileLayer(mbUrl, {
    id: "mapbox.satellite",
    attribution: mbAttr,
    minZoom: 7,
    maxZoom: 18
});
var baseMaps = {
    "Gray": grayscale,
    "Streets": streets,
    "Ariel": satellite
};
var center = [34.1, -111.1];
var zoom = 7;
var map = L.map("mapDiv", {
    center: center,
    zoom: zoom,
    layers: [grayscale],
    zoomControl: false
});

// add the geocoder controller
var geocoderControl = L.mapbox.geocoderControl("mapbox.places", {
    keepOpen: true,
    autocomplete: true
});
geocoderControl.addTo(map);

// listen for the found event and add a marker
var geoMarker = "";
geocoderControl.on("select", function(object) {
    // remove the previous maker
    map.removeLayer(geoMarker);

    var coord = object.feature.geometry.coordinates;
    var place = object.feature.place_name;
    geoMarker = L.marker([coord[1], coord[0]], {
        title: place
    }).addTo(map);
    map.setView(new L.LatLng(coord[1], coord[0], 12));
    geoMarker.bindPopup(place);
    geoMarker.openPopup();
});

var sw = L.latLng(30.9, -116.2);
var ne = L.latLng(37.2, -105.8);
var bounds = L.latLngBounds(sw, ne);
map.setMaxBounds(bounds);


// custom zoom bar control that includes a Zoom Home function
L.Control.zoomHome = L.Control.extend({
    options: {
        position: "bottomright",
        zoomInText: "+",
        zoomInTitle: "Zoom in",
        zoomOutText: "-",
        zoomOutTitle: "Zoom out",
        zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>',
        zoomHomeTitle: "Zoom home"

    },

    onAdd: function(map) {
        var controlName = "gin-control-zoom",
            container = L.DomUtil.create("div", controlName + " leaflet-bar"),
            options = this.options;

        this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
            controlName + "-in", container, this._zoomIn);
        this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
            controlName + "-home", container, this._zoomHome);
        this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
            controlName + "-out", container, this._zoomOut);

        this._updateDisabled();
        map.on("zoomend zoomlevelschange", this._updateDisabled, this);

        return container;
    },

    onRemove: function(map) {
        map.off("zoomend zoomlevelschange", this._updateDisabled, this);
    },

    _zoomIn: function(e) {
        this._map.zoomIn(e.shiftKey ? 3 : 1);
    },

    _zoomOut: function(e) {
        this._map.zoomOut(e.shiftKey ? 3 : 1);
    },

    _zoomHome: function(e) {
        map.setView(center, zoom);
    },

    _createButton: function(html, title, className, container, fn) {
        var link = L.DomUtil.create("a", className, container);
        link.innerHTML = html;
        link.href = "#";
        link.title = title;

        L.DomEvent.on(link, "mousedown dblclick", L.DomEvent.stopPropagation)
            .on(link, "click", L.DomEvent.stop)
            .on(link, "click", fn, this)
            .on(link, "click", this._refocusOnMap, this);

        return link;
    },

    _updateDisabled: function() {
        var map = this._map,
            className = "leaflet-disabled";

        L.DomUtil.removeClass(this._zoomInButton, className);
        L.DomUtil.removeClass(this._zoomOutButton, className);

        if (map._zoom === map.getMinZoom()) {
            L.DomUtil.addClass(this._zoomOutButton, className);
        }
        if (map._zoom === map.getMaxZoom()) {
            L.DomUtil.addClass(this._zoomInButton, className);
        }
    }
});
// add the new control to the map
var zoomHome = new L.Control.zoomHome();
zoomHome.addTo(map);

// styles the polygons
function style(feature) {
    return {
        color: feature.properties.fill,
        weight: feature.properties.strokeWidth
    };
}

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: "#00ffbf",
        dashArray: "",
        fillOpacity: 0.35
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    districts.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onDistrictLayer(feature, layer) {
    layer.on({
        // mouseover: highlightFeature,
        // mouseout: resetHighlight,
        click: zoomToFeature
    });

    var f = feature;
    var info1 = f.properties.District;
    var info2 = f.properties.DE;
    var info3 = f.properties.Website;
    var popupContent = "<span class='title'>" + info1 + "</span><br><span class='de'>District Executive: " + info2 + "</span><br><a href='" + info3 + "'>Website</a>";
    layer.bindPopup(popupContent);
}

function onPointLayer(feature, layer) {
    var f = feature.properties;
    var popupPoint = "<p style='text-align:center;'><strong>" + f.Class + " " + f.Unit_Type + "</strong><br>" + f.Unit_Num; + "</p>"
    layer.bindPopup(popupPoint);
}


// =============================================================================================================>
// add districts layer
var districts = L.geoJson(dists, {
    style: style,
    onEachFeature: onDistrictLayer
}).addTo(map);

// add Community Packs
var cPacks = L.geoJson(cPacks, {
    onEachFeature: onPointLayer,
    pointToLayer: L.mapbox.marker.style,
    style: function(feature) {return feature.properties;}
}).addTo(map);

// add Community Troops
var cTroops = L.geoJson(cTroops, {
    onEachFeature: onPointLayer,
    pointToLayer: L.mapbox.marker.style,
    style: function(feature) {return feature.properties;}
}).addTo(map);

// add Community Troops
var cCrews = L.geoJson(cCrews, {
    onEachFeature: onPointLayer,
    pointToLayer: L.mapbox.marker.style,
    style: function(feature) {return feature.properties;}
}).addTo(map);



// =============================================================================================================>
var overLays = {
    "Districts": districts,
    "Community Packs": cPacks,
    "Community Troops": cTroops,
    "Community Crews": cCrews
};
L.control.layers(baseMaps, overLays).addTo(map);
L.control.locate({
    position: "bottomright"

}).addTo(map);



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