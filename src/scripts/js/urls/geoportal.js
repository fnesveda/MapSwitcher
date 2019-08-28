// open Geoportal.gov.cz with the location specified in universal, open next to tab senderIndex
// this has to be called from a background script because it uses a CORS XHR
function geoportalToURL(universal, callback) {
	var lon = universal.lon;
	var lat = universal.lat;
	var zoom = universal.zoom;
	var alt = 0;
	
	// convert from WGS84 to S-JTSK
	var d2r = Math.PI/180;
	var a = 6378137.0;
	var f1 = 298.257223563;
	var dx = -570.69;
	var dy = -85.69;
	var dz = -462.84;
	var wx = 4.99821/3600*Math.PI/180;
	var wy = 1.58676/3600*Math.PI/180;
	var wz = 5.2611/3600*Math.PI/180;
	var m  = -3.543e-6;
	
	var B = lat*d2r;
	var L = lon*d2r;
	var H = alt;
	
	var e2 = 1 - Math.pow(1-1/f1, 2);
	var rho = a/Math.sqrt(1-e2*Math.pow(Math.sin(B), 2));
	var x1 = (rho+H) * Math.cos(B)*Math.cos(L);
	var y1 = (rho+H) * Math.cos(B)*Math.sin(L);
	var z1 = ((1-e2)*rho+H) * Math.sin(B);
	
	var x2 = dx + (1+m)*(x1 + wz*y1 - wy*z1);
	var y2 = dy + (1+m)*(-wz*x1 + y1 + wx*z1);
	var z2 = dz + (1+m)*(wy*x1 - wx*y1 + z1);
	
	a = 6377397.15508;
	f1 = 299.152812853;
	var ab = f1/(f1-1);
	var p = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2));
	e2 = 1-Math.pow(1-1/f1, 2);
	var th = Math.atan(z2*ab/p);
	var st = Math.sin(th);
	var ct = Math.cos(th);
	var t = (z2 + e2*ab*a*(st*st*st))/(p - e2*a*(ct*ct*ct));
	
	B = Math.atan(t);
	H = Math.sqrt(1+t*t) * (p-a/Math.sqrt(1+(1-e2)*t*t));
	L = 2*Math.atan(y2/(p+x2));
	
	a = 6377397.15508;
	var e = 0.081696831215303;
	var n = 0.97992470462083;
	var rho0 = 12310230.12797036;
	var sinUQ = 0.863499969506341;
	var cosUQ = 0.504348889819882;
	var sinVQ = 0.420215144586493;
	var cosVQ = 0.907424504992097;
	var alpha  = 1.000597498371542;
	var k2 = 1.00685001861538;
	
	var sinB = Math.sin(B);
	t = (1-e*sinB)/(1+e*sinB);
	t = Math.pow(1+sinB, 2)/(1-Math.pow(sinB, 2)) * Math.exp(e*Math.log(t));
	t = k2 * Math.exp(alpha*Math.log(t));
	
	var sinU = (t-1)/(t+1);
	var cosU = Math.sqrt(1-sinU*sinU);
	var V = alpha*L;
	var sinV = Math.sin(V);
	var cosV = Math.cos(V);
	var cosDV = cosVQ*cosV + sinVQ*sinV;
	var sinDV = sinVQ*cosV - cosVQ*sinV;
	var sinS = sinUQ*sinU + cosUQ*cosU*cosDV;
	var cosS = Math.sqrt(1-sinS*sinS);
	var sinD = sinDV*cosU/cosS;
	var cosD = Math.sqrt(1-sinD*sinD);
	
	var eps = n*Math.atan(sinD/cosD);
	rho = rho0*Math.exp(-n*Math.log((1+sinS)/cosS));
	
	var CX = rho*Math.sin(eps);
	var CY = rho*Math.cos(eps);
	
	// the final coordinates
	var X = (-1) * Math.abs(CX);
	var Y = (-1) * Math.abs(CY);
	var scale = 224 * Math.pow(2, 21 - zoom);
	
	// we need to asynchronously send a request to the geoportal.gov.cz server asking for a permalink to the map with that location displayed
	var xhr = new XMLHttpRequest();
	
	// GeoPortal can be slow to react sometimes, let's give it ample time to respond
	xhr.timeout = 5000; 
	
	// if we want to directly display the photomap from the 50's, this can't be made shorter, because the different map layers wouldn't work then
	var requestString = '{"data":{"scale":'+scale+',"projection":"epsg:5514","center":['+X+','+Y+'],"units":"m","maxExtent":{"left":-920000,"bottom":-1260700,"right":-230000,"top":-920000},"resolutions":null,"scales":[7741440,3870720,1935360,967680,483840,241920,120960,60480,30240,15120,7560,3780,1890,945],"layers":[{"className":"OpenLayers.Layer","origClassName":"OpenLayers.Layer.Image","name":"BaseLayer","visibility":true,"opacity":null,"index":0},{"className":"OpenLayers.Layer.Vector","origClassName":"OpenLayers.Layer.Vector","name":"Vector layer","visibility":true,"opacity":null,"index":1,"displayInLayerSwitcher":false,"attribution":null,"transitionEffect":null,"isBaseLayer":false,"minResolution":0.2500311149831979,"maxResolution":2048.2548939423573,"minScale":7741440,"maxScale":945,"metadata":{},"projection":"EPSG:5514","projections":[],"maxExtent":{"left":-920000,"bottom":-1260700,"right":-230000,"top":-920000},"features":{"type":"FeatureCollection","features":[]},"selectedFeatures":[]},{"className":"OpenLayers.Layer.Vector","origClassName":"OpenLayers.Layer.Vector","name":"Marker layer","visibility":true,"opacity":null,"index":2,"displayInLayerSwitcher":false,"attribution":null,"transitionEffect":null,"isBaseLayer":false,"minResolution":0.2500311149831979,"maxResolution":2048.2548939423573,"minScale":7741440,"maxScale":945,"metadata":{},"projection":"EPSG:5514","projections":[],"maxExtent":{"left":-920000,"bottom":-1260700,"right":-230000,"top":-920000},"features":{"type":"FeatureCollection","features":[]},"selectedFeatures":[]},{"className":"OpenLayers.Layer.Vector","origClassName":"OpenLayers.Layer.Vector","name":"User graphics","visibility":true,"opacity":null,"title":"Uživatelská grafika","index":3,"displayInLayerSwitcher":false,"attribution":null,"transitionEffect":null,"isBaseLayer":false,"minResolution":0.2500311149831979,"maxResolution":2048.2548939423573,"minScale":7741440,"maxScale":945,"metadata":{},"projection":"EPSG:5514","projections":[],"maxExtent":{"left":-920000,"bottom":-1260700,"right":-230000,"top":-920000},"features":{"type":"FeatureCollection","features":[]},"selectedFeatures":[]},{"className":"OpenLayers.Layer.Grid","origClassName":"OpenLayers.Layer.WMTS","name":"road_map","visibility":false,"opacity":null,"title":"Automapa","index":4},{"className":"OpenLayers.Layer.Grid","origClassName":"OpenLayers.Layer.WMTS","name":"military_raster","visibility":false,"opacity":null,"title":"Vojenské mapy (rastrové)","index":5},{"className":"OpenLayers.Layer.Grid","origClassName":"OpenLayers.Layer.WMTS","name":"military_IInd","visibility":false,"opacity":null,"title":"II. vojenské mapování","index":6},{"className":"OpenLayers.Layer.Grid","origClassName":"OpenLayers.Layer.WMTS","name":"military_IIInd","visibility":false,"opacity":null,"title":"III. vojenské mapování","index":7},{"className":"OpenLayers.Layer.Grid","origClassName":"OpenLayers.Layer.WMTS","name":"orto_cosmc","visibility":false,"opacity":null,"title":"Ortofotomapy ČÚZK (aktuální)","index":8},{"className":"OpenLayers.Layer.XYZ","origClassName":"HSLayers.Layer.ArcGISServer","name":"orto_50s","visibility":'+(universal.type=='satellite'?'true':'false')+',"opacity":null,"title":"Ortofotomapa (50. léta)","index":9,"wrapDateLine":false,"sphericalMercator":false},{"className":"OpenLayers.Layer.Grid","origClassName":"OpenLayers.Layer.WMTS","name":"dmu","visibility":false,"opacity":null,"title":"Digitální model území (DMÚ25)","index":10},{"className":"OpenLayers.Layer.Grid","origClassName":"OpenLayers.Layer.WMTS","name":"topo_cosmc","visibility":'+(universal.type=='satellite'?'false':'true')+',"opacity":null,"title":"Topografické mapy ČÚZK","index":11},{"className":"OpenLayers.Layer.WMS","origClassName":"OpenLayers.Layer.WMS","name":"zabaged","visibility":false,"opacity":null,"title":"Základní báze geografických dat ČR (ZABAGED&reg;)","index":12},{"className":"OpenLayers.Layer.WMS","origClassName":"OpenLayers.Layer.WMS","name":"Katastrální mapy/Pozemkový katastr","visibility":false,"opacity":null,"title":"Pozemkový katastr","index":13,"path":"Katastrální mapy"},{"className":"OpenLayers.Layer.WMS","origClassName":"OpenLayers.Layer.WMS","name":"Katastrální mapy/Definiční body parcel","visibility":false,"opacity":null,"title":"Definiční body parcel","index":14,"path":"Katastrální mapy"},{"className":"OpenLayers.Layer.WMS","origClassName":"OpenLayers.Layer.WMS","name":"Katastrální mapy/Katastr nemovitostí","visibility":'+(universal.type=='satellite'?'false':'true')+',"opacity":null,"title":"Katastr nemovitostí","index":15,"path":"Katastrální mapy"},{"className":"OpenLayers.Layer.Grid","origClassName":"OpenLayers.Layer.WMTS","name":"labels","visibility":'+(universal.type=='satellite'?'true':'false')+',"opacity":null,"title":"Popisky","index":16},{"className":"OpenLayers.Layer.Grid","origClassName":"OpenLayers.Layer.WMTS","name":"relief","visibility":'+(universal.type=='satellite'?'false':'true')+',"opacity":null,"title":"Stínování","index":17},{"className":"OpenLayers.Layer.Vector","origClassName":"HSLayers.Layer.SearchParser","name":"lokality","visibility":true,"opacity":null,"index":18,"strategies":[{"className":"OpenLayers.Strategy.Fixed"}],"protocol":{"className":"OpenLayers.Protocol.HTTP","options":{"format":{},"url":null},"format":{"className":"OpenLayers.Format.KML","options":{"extractStyles":false,"extractAttributes":true}}}},{"className":"OpenLayers.Layer.Vector","origClassName":"HSLayers.Layer.SearchParser","name":"adresy","visibility":true,"opacity":null,"index":19,"strategies":[{"className":"OpenLayers.Strategy.Fixed"}],"protocol":{"className":"OpenLayers.Protocol.HTTP","options":{"format":{},"url":null},"format":{"className":"OpenLayers.Format.KML","options":{"extractStyles":false,"extractAttributes":true}}}},{}]}}';
	
	xhr.open("POST", "https://geoportal.gov.cz/php/statusmanager/index.php?request=save&permalink=true", true);
	xhr.onload = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				// parse the permalink from the XHR response
				// return it to the content script via the callback
				var response = JSON.parse(xhr.responseText);
				var geoportalURL = "https://geoportal.gov.cz/web/guest/map?permalink=" + response.permalink;
				callback({success: true, result: geoportalURL});
			}
			else {
				callback({success: false, result: xhr.statusText});
				callback();
			}
		}
	};
	xhr.ontimeout = function() {
		callback({success: false, result: "The request to geoportal.gov.cz timed out."});
	}
	xhr.onerror = function() {
		callback({success: false, result: "The request to geoportal.gov.cz failed."});
	};
	xhr.send(requestString);
}