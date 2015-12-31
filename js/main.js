// Leaflet style map

var map = L.map('mapDiv').setView([34.1, -111.1], 7);

var sw = L.latLng(30.9, -116.2);
var ne = L.latLng(37.2, -105.8);
var bounds = L.latLngBounds(sw, ne);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
    minZoom: 7,
    maxZoom: 18,
    // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    //     '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    //     'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.light'
}).addTo(map);
map.setMaxBounds(bounds);

function style(feature) {
    return {
        color: feature.properties.fill
    }
}

function popup(feature, layer) {
    var info1 = feature.properties.District;
    var info2 = feature.properties.DE;
    var info3 = feature.properties.Website;
    layer.bindPopup("<b>" + info1 + "</b><br>District Executive: " + info2 + "<br><a href='" + info3 + "'>Website</a>");
}

var geojson;
geojson = L.geoJson(dists, {
    style: style,
    onEachFeature: popup
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