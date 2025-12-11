// ---- Variables Globales
var road2UrlPriv = "https://data.geopf.fr/private/navigation/itineraire?";
var road2UrlProd = "https://data.geopf.fr/navigation/itineraire?";

var map;
var clickedStartPoint = new Array();
var clickedEndPoint = new Array();
var clickedIntPoint = new Array();

var reqs = 0;

var loader = document.getElementById("loading");
loader.classList.add("not_displayed");

// -- Variables par défaut que l'utilisateur peut modifier
var defaultResource = "bdtopo-osrm";
var defaultProfile = "car";
var defaultOptimization = "fastest";
var defaultGraphName = "Voiture";
var defaultMethod = "time";
// --

// -- Variables pour la carte

// Vecteurs qui vont contenir les éléments de l'itinéraire sur la carte
var vectorRoad = new ol.source.Vector();
var vectorRoadOther = new ol.source.Vector();
var vectorStartPoint = new ol.source.Vector();
var vectorEndPoint = new ol.source.Vector();
var vectorIntPoint = new ol.source.Vector();

// Couches de la carte qui vont afficher l'itinéraire
var vectorRoadLayer = new ol.layer.Vector({
  source: vectorRoad,
});

var vectorRoadOtherLayer = new ol.layer.Vector({
  source: vectorRoadOther,
});

var vectorStartPointLayer = new ol.layer.Vector({
  source: vectorStartPoint,
});

var vectorEndPointLayer = new ol.layer.Vector({
  source: vectorEndPoint,
});

var vectorIntPointLayer = new ol.layer.Vector({
  source: vectorIntPoint,
});

// Styles pour les marqueurs
var styles = {
  routePolyline: new ol.style.Style({
    stroke: new ol.style.Stroke({
      width: 6,
      color: [200, 40, 40, 0.8],
    }),
  }),
  routeWkt: new ol.style.Style({
    stroke: new ol.style.Stroke({
      width: 6,
      color: [40, 40, 40, 0.8],
    }),
  }),
  icon: new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAsCAYAAAAATWqyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABB5JREFUeNq8WFtLVFEUXkdNpwsVmhVGlGGaJihU2lMgRj1I2KO9SQ9JEZSh0R8IgsSHEtLsN1RaEUE95JOalCYVSCbdENIeEo0ya7W+s2f2Po7O2ec4M37wMXvOXpfv7NmXNduhEGDmQvmoEx4R7hfuEq6Pds8JPwrfCPuEjxzHmaBUQZI7whPC5xwez6O+ji2PYxFRKR+3hIc9D4mGh4kGBog+fCCanlbPt2wh2rOHqLqaqFLcnEWh+4VnZYSGVzISzcJ5/W6fPjFfusS8fTuk+BM2sIWPAWI1hxGQKbyt3WdnVdDsbLuAeMIHvohhgNiZQeZDt3YZHWXeuze8gHgiBmIZdPvOG+ls1aZ9fcybNiUvIkbEQkyD1kQiqoQLrsnISGpFeMUgtgJyVcWLyBC+dLtnZpiLilIvIkbERg4F5MzwCmnQA3bhQvpExIgcBg16H5EvL+TjIE3IRlhcTLSwYF9eO3cS1dcre2BsjKinh+jzZ7tvVpayL8RGTUOyvxyCiDKt7eJF+9tEIswdHfILLyzdR/EMfbCxxUEugzIIaXGbf/8yb93q75yTEz/zlwdsYOsXC7mQU6EFQnrd5tCQ/S2uXw9+ysDWFg85FXohZNxtdnX5O23ezPz7d3AhsIWPX0zkVBjH0ilwJ9D79/4T7OhRouzs4IcVbOHjB5OzAEIibnNmxt9JzfBwsPmYnBGzmWzY4O80OxteiM3HkxNCfritvDx/p5GR8EJsPibnDwgZd5ulpf5O/f1qEwoK2MLHDybnOOnaY2pKDmbHf5YfO+Zd+4kBG9j6xUIu5IzWKBBySgeoqrKv/dOnpdaaTywCfbCxxUEug1MQslH4U5Ur3cEOrYoK5rt3mX/9MqHQxjP0BYnRresv5N4YO33v6LfZvTv4KYozpaREMcj5EiNymFG94y0DpEjgP+7j+/fTXwYghwJyFsUXR+16mBsb0ycCsQ3alysV1wnHdOWejiqtuNhb0SPXukR160H9Ew0OMq9ZkzoRiGVOW0yQA7a/FFf0wF27ljohiGVwOcgfLBTSz1zzf/+Ya2qSF1Fbq2IpPF1UMFvE7BB+d92+fGHOzV25iLw85q9fYyKmhQVh//ue1AN5797KhcDXoH6lVxKdOsSZM+FFNDV5RXQmczeCJf3ODTM3x7xvX3ARpaWyef+MiXgrXJvsRU0lKlA33KtX9uo8Vu3DNlq9CitSdWvUrAe4rc0upL3d+5M0U6oQva54okMfP55YBPoMHge5tgorZpvwmxt+cpI5P3+pCDxDnwJst1E6IIHr9Ls+eLC4okP74UPvaNRROiEJbupU588bIWgb3KB0Q5JIBcSvdVVWXq5oqjX0RWg1IInKIUPfs5n7MTwrp9WEJDy3TOl8jlYb0SV9FWVUlFeTWar/BRgA8G9p83hisDUAAAAASUVORK5CYII=",
    }),
  }),
  icon2: new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAsCAYAAAAATWqyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABVBJREFUeNq8WAtMllUYfv4f1F9IS8xkeMumCy8orKLLREudGc2ctWxGONiPLW2rtRnaBWaZtZIuS51autpct7VuNhYtnUEbK5NSK82FWglOU0wDRUD5e95zzvdfgP/7/g9+eLZ35/Kdc97nO5f3fc/xwAUCgcBYJndTplMmUcZQks3n85S/KL9RqijlHo/nKOIFKvdQ5lEqA+5Rafp6nPR4HEhkMtlIuSWsEqjjTx/9GTj9N9B0RtdfkQJcPRoYmwWM5GR5Iob+nrKUM7TXNRGSeILJy5R+quLf48DOLcDuz4D/Ttn/3uBhQPYCYFYRMCTNqm2jrCCZ12MiQgIJZhaWqIqWC8CXZcC37wCX2tytayL/4fZCYN5yYECSVfu2mZ3LUYmYtXyLUqQqjh8CNjH7Tw/33DXc449wNtOut2pYwMMkE4hG5Ekmr6hC7Q/AhgKguTE+u37gIODRd4FxN1s1xSSythMRkshmUk1JQP1BoOze+JEIJ7P8U2DEBCnJ0txGMrul4DUkJN2kSFxsYm5J/EkIZEwZW3SILpaMbk2EWEjJUrntnK1Tf6LXIGNvD65IltGtl4asfmRyo7ILpTSa7ZecB5RjOfVOYPh1unzyCLDva33MneBNBJ6v0nYH2MPluUms5kRjloGPV2lbYYd+A4D7Smjk8zlgQuS3di571Tbgk9W0Gi3244iNuX+VVZokS5Ord2s7jdXnDnahP/D4+7QNBZ1JqD9N0N+kjbS1g+gSnRq5XuPAgGO/Ao2n7TvPLw4/ftEhbaStHUSX6NSY7jVelH7zF/uOSYOBO/yxb0ppK33sENKpliYtuJvtkJ6jTbYb8y59nE6QRpoQ8QXPuB30DncHpz4hnT5vsNKXbN+p5bx7Ik59wnQKkXMqlzzEvlPdAfdEnPqEdJ4TIodVNnWcfacjP2mjFSukrfSxQ0jnYSFSo49cdseoqkOgwjP/UUn42e9ZW9ElOjVqhMiuYKg3Zqq9ggOVwDbah8s2LkC+SRtpawfRJTo1dgmRctm/qjgtz/lvqz8EXqIx3lvBiK01VC95qZNv0sYJIV3NKuI3Tk8cjF/9TSnPfsOx2PaB+J2UkTp/ps7Zv1gYOopO7zsGAolS2kqnV2QRkV1zUMyQ8qAb/ehVLN2qPTfnkTKBRGq9et94apmsU42kwa0Le4+EjK1JCNYZ3RGhooTZcu8YryL3F+bEP0CS2OXpCiui/4OSSSIXwiM0mIoH1XRJQ/8Gaw3jAxnLv94iIfeSRRaJCCKGzB4mJapwLY/XPcXxIyJjjZ5ilZ6lrhqnC5aQ+4YyU10v33gAOFTdMxLp0xgsfWAZzJ2UOSTS7njlJJkRTPZTUnD2BLB6Nu/6Z7tHQvxJ6Q7gyuFSaqBMIYlOga23a+vrqVd2RXBVKpBf1v3ZyF9rkRD4uyIRlYghIwHsZlXInAvk5LknkfOQ7quxmWN+0d1niSTjFNPRSkv84l3AidrYSKSOB575itZXxV1iLG8gkeaoNwzbxxN9vBZRWtF/oD7STtG5Fe3LUdUkWs1Rbba96ji+5OjHlZWqMIpx9vwVzkQWPKXbaqzkGPt69GLU4bmiQo6dqngzL7qbnzgDeOw9qyR9csOfH3pExJCRrS/x/zD1YiRHurEhstGgoTSHO/SLER0EJYMkTsYyvjdWImbAwuDT1OJXIyM6yS9+zSIhKIyVhCsihowEUetVIYMzMqMg9FHyGbPCvWp5r4YSXCIfZb96vGxrCQSem6lF8hryzYe+ABVNplxUaut/16IhdZPRl6DCZV088C5DX8O8SK+hNBlZE8sLczT8L8AAVPItU5uhvAwAAAAASUVORK5CYII=",
    }),
  }),
};

// --

// -- Creation de la carte à  la fin du chargement de la page
Gp.Services.getConfig({
  apiKey: "essentiels",
  onSuccess: createMap,
});
// --
// ----

// ---- Création d'un nouveau menu contextuel sur la carte

var contextMenuItems = [
  {
    text: "Définir point de départ",
    callback: defineStartPoint,
  },
  {
    text: "Définir point d'arrivée",
    callback: defineEndPoint,
  },
  {
    text: "Ajouter point intermédiaire",
    callback: addIntPoint,
  },
  {
    text: "Supprimer point intermédiaire",
    callback: deleteIntPoint,
  },
  {
    text: "Supprimer les données",
    callback: cancelUserData,
  },
];

const wmsLayer = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: "https://data-qua.priv.geopf.fr/wms-v?", // URL du serveur WMS
    params: {
      SERVICE: "WMS",
      VERSION: "1.3.0",
      REQUEST: "GetMap",
      LAYERS: "Transport_exceptionnel-WMSv", // Nom de la couche
      FORMAT: "image/png", // Format d'image
      TRANSPARENT: true, // Permet la transparence
      _t: Date.now(), // Ajoute un timestamp unique pour éviter le cache
    },
    serverType: "geoserver", // Adapter selon le serveur (geoserver, mapserver, qgis)
  }),
});
const wmtsLayer = new ol.layer.Tile({
  source: new ol.source.WMTS({
    url: "https://data.geopf.fr/wmts?",
    layer: "SECUROUTE.TE.ALL",
    style: "TOUS LES FRANCHISSEMENTS",
    format: "image/png",
    matrixSet: "PM",
    projection: "EPSG:3857",
    tileGrid: new ol.tilegrid.WMTS({
      origin: [-20037508.342789244, 20037508.342789244],
      resolutions: [
        156543.033928, 78271.516964, 39135.758482, 19567.879241, 9783.9396205,
        4891.96981025, 2445.98490513, 1222.99245256, 611.496226281,
        305.748113141, 152.87405657, 76.4370282852, 38.2185141426,
        19.1092570713, 9.55462853565, 4.77731426782, 2.38865713391,
        1.19432856696, 0.597164283478, 0.298582141739,
      ],
      matrixIds: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
      ],
    }),
    wrapX: true,
  }),
});

const reseauRoutierLayer = new ol.layer.Tile({
  source: new ol.source.WMTS({
    url: "https://data.geopf.fr/wmts?",
    layer: "SECUROUTE.TE.1TE",
    style: "RESEAU ROUTIER 1TE",
    format: "image/png",
    matrixSet: "PM",
    projection: "EPSG:3857",
    tileGrid: new ol.tilegrid.WMTS({
      origin: [-20037508.342789244, 20037508.342789244],
      resolutions: [
        156543.033928, 78271.516964, 39135.758482, 19567.879241, 9783.9396205,
        4891.96981025, 2445.98490513, 1222.99245256, 611.496226281,
        305.748113141, 152.87405657, 76.4370282852, 38.2185141426,
        19.1092570713, 9.55462853565, 4.77731426782, 2.38865713391,
        1.19432856696, 0.597164283478, 0.298582141739,
      ],
      matrixIds: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
      ],
    }),
    wrapX: true,
  }),
});

// Fonction pour créer la carte
function createMap() {
  map = new ol.Map({
    target: "map-itineraire",
    layers: [
      new ol.layer.GeoportalWMTS({
        layer: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2",
        olParams: {
          opacity: 1,
        },
      }),
      //wmsLayer,
      //reseauRoutierLayer,
      // wmtsLayer,
      vectorRoadLayer,
      vectorStartPointLayer,
      vectorEndPointLayer,
      vectorIntPointLayer,
    ],
    view: new ol.View({
      center: [261223, 6250240],
      zoom: 6,
      minZoom: 5,
      maxZoom: 18,
      projection: "EPSG:3857",
    }),
  });
  // Création du Layer Switcher
  var layerSwitcher = new ol.control.LayerSwitcher({
    layers: [
      {
        layer: vectorRoadLayer,
        config: {
          title: "Résultats du service GPF",
        },
      },
      ////{
      ///  layer: wmsLayer,
      //   config: {
      ///    title: "Tronçons exceptionnel",
      //   },
      //},
      {
        layer: wmtsLayer,
        config: {
          title: "Franchissements",
        },
      },

      {
        layer: vectorStartPointLayer,
        config: {
          title: "Point de départ",
        },
      },
      {
        layer: vectorEndPointLayer,
        config: {
          title: "Point d'arrivée",
        },
      },
      {
        layer: vectorIntPointLayer,
        config: {
          title: "Points intermédiaire",
        },
      },
    ],
    options: {
      collapsed: false,
    },
  });
  // Ajout du LayerSwitcher à la carte
  map.addControl(layerSwitcher);
  // Creation du controle
  var mpControl = new ol.control.GeoportalMousePosition({
    collapsed: true,
    displayAltitude: false,
    editCoordinates: true,
    systems: [
      {
        crs: "EPSG:2154",
        label: "Lambert 93",
        type: "Metric",
      },
      {
        crs: "EPSG:4326",
        label: "Géographiques",
        type: "Geographical",
      },
      ,
      {
        crs: "EPSG:3857",
        label: "PM",
        type: "Metric",
      },
    ],
    units: ["DEC", "M"],
  });
  // Ajout du controle à  la carte
  map.addControl(mpControl);

  // Ajout du menu contextuel à  la carte
  var contextmenu = new ContextMenu({
    width: 180,
    items: contextMenuItems,
  });
  map.addControl(contextmenu);
  hideLayers();
}

// Pour cacher les layers dans le layerswitcher (https://www.youtube.com/watch?v=jwMFYcXjTbQ)
function hideLayers() {
  let layers = document.getElementsByClassName("GPlayerSwitcher_layer");
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    console.log(layer.innerText);
    if (
      layer.innerText === "Points intermédiaires 100%" ||
      layer.innerText === "Point de départ 100%" ||
      layer.innerText === "Point d'arrivée 100%" ||
      layer.innerText === "Plan IGN v2 100%"
    ) {
      layer.style = "display: none";
    }
  }
}

// ---- Ajouter un point sur la carte
// Fonction utilisée lors d'un clic droit sur la carte
// Il s'agit d'afficher un marqueur et de stocker les coordonnées de ce point
// Et tout cela en intéragissant avec le formulaire des paramà¨tres de l'itinéraire
function defineStartPoint(evt) {
  // on récupère les coordonnées du point cliqué
  let clickedCoordinate = utils.to4326(evt.coordinate);

  if (clickedStartPoint.length !== 0) {
    clickedStartPoint = new Array();
    vectorStartPoint.clear();
  }

  // on stocke les coordonnées pour pouvoir lancer un itinéraire
  clickedStartPoint.push(clickedCoordinate);

  // on affiche ce point sur la carte
  utils.createFeature(clickedCoordinate, vectorStartPoint);

  if (clickedStartPoint.length !== 0 && clickedEndPoint.length !== 0) {
    // on lance le calcul d'itineraire
    cancelMap();
    computeRoad();
  }
  return true;
}

// ---- Ajouter un point sur la carte
// Fonction utilisée lors d'un clique droit sur la carte
// Il s'agit d'afficher un marqueur et de stocker les coordonnées de ce point
// Et tout cela en intéragissant avec le formulaire des paramètres de l'itinéraire
function defineEndPoint(evt) {
  // on récupà¨re les coordonnées du point cliqué
  let clickedCoordinate = utils.to4326(evt.coordinate);

  if (clickedEndPoint.length !== 0) {
    clickedEndPoint = new Array();
    vectorEndPoint.clear();
  }

  // on stocke les coordonnées pour pouvoir lancer un itinéraire
  clickedEndPoint.push(clickedCoordinate);

  // on affiche ce point sur la carte
  utils.createFeature(clickedCoordinate, vectorEndPoint, 1);

  if (clickedStartPoint.length !== 0 && clickedEndPoint.length !== 0) {
    // on lance le calcul d'itineraire
    cancelMap();
    computeRoad();
  }

  return true;
}

function addIntPoint(evt) {
  // on récupà¨re les coordonnées du point cliqué
  let clickedCoordinate = utils.to4326(evt.coordinate);

  // on stocke les coordonnées pour pouvoir lancer un itinéraire
  clickedIntPoint.push(clickedCoordinate[0] + "," + clickedCoordinate[1]);

  // on affiche ce point sur la carte quand on est certain que le formulaire est bien mis à jour
  utils.createFeature(clickedCoordinate, vectorIntPoint);

  // on lance le calcul d'itineraire
  cancelMap();
  computeRoad();

  return true;
}

function deleteIntPoint(evt) {
  // on récupère les coordonnées de la feature concernée
  let feature = vectorIntPoint.getClosestFeatureToCoordinate(evt.coordinate);
  let featureCoord = utils.to4326(feature.getGeometry().getCoordinates());
  let featureCoordStr = featureCoord[0] + "," + featureCoord[1];

  // on le supprime du tableau des points intermédiaires cliqués
  let pointIndice = clickedIntPoint.indexOf(featureCoordStr);
  clickedIntPoint.splice(pointIndice, 1);

  // on enlève ce point de la carte quand on est certain que le formulaire est bien mis à jour
  utils.deleteFeature(evt.coordinate, vectorIntPoint);

  // on lance le calcul d'itineraire
  cancelMap();
  computeRoad();

  return true;
}

// ----

// ---- Calculer un itinéraire
// Cette fonction est appelée lorsque l'on clique sur un des boutons du formulaire
function computeRoad() {
  // Déclarations
  let request = {};
  let intermediatesPointsStr = "";

  // on récupà¨re les valeurs
  request.finalStart = clickedStartPoint[0];
  request.finalEnd = clickedEndPoint[0];

  if (clickedIntPoint.length !== 0) {
    intermediatesPointsStr = clickedIntPoint[0];
    for (let i = 1; i < clickedIntPoint.length; i++) {
      intermediatesPointsStr =
        intermediatesPointsStr + "|" + clickedIntPoint[i];
    }
  }
  request.finalIntermediates = intermediatesPointsStr;

  // Gestion des points de l'utilisateur
  if (request.finalStart === "" || request.finalEnd === "") {
    // il n'y a pas assez de points pour faire un itinéraire
    return false;
  }

  // -- Gestion des paramètres de l'utilisateur
  // Si certains paramètres ne sont pas remplis dans le formulaire, il y a des valeurs par défaut

  loadUserParameter(request);

  // --
  let requestStr = "";
  // ---- Requete envoyée au nouveau service
  if (request.finalResource.includes("VALID")) {
    requestStr =
      road2UrlPriv +
      "resource=" +
      request.finalResource +
      "&profile=" +
      request.finalProfile +
      "&optimization=" +
      request.finalOptimization +
      "&start=" +
      request.finalStart +
      "&end=" +
      request.finalEnd +
      "&intermediates=" +
      request.finalIntermediates +
      "&constraints=" +
      request.finalConstraint +
      "&geometryFormat=polyline&getSteps=true&getBbox=true" +
      "&apikey=itineraire";
  } else {
    requestStr =
      road2UrlProd +
      "resource=" +
      request.finalResource +
      "&profile=" +
      request.finalProfile +
      "&optimization=" +
      request.finalOptimization +
      "&start=" +
      request.finalStart +
      "&end=" +
      request.finalEnd +
      "&intermediates=" +
      request.finalIntermediates +
      "&constraints=" +
      request.finalConstraint +
      "&geometryFormat=polyline&getSteps=true&getBbox=true";
  }
  console.log(requestStr);
  // On affiche la requete sur la page
  let requestDiv = document.getElementById("request");
  requestDiv.innerHTML =
    "<div class='card card-body'><a href='" +
    requestStr +
    "'>" +
    requestStr +
    "</a></div>";
  loader.classList.remove("not_displayed");
  loader.classList.add("displayed");

  // on calcule l'itinéraire
  reqs++;
  fetch(requestStr)
    .then(function (response) {
      return response.json();
    })
    .then(function (responseJSON) {
      utils.createRoute(responseJSON.geometry, "polyline", vectorRoad, "black");

      // ---- Ajout résumé itinéraire ----
      let distance = responseJSON.distance; // en mètres
      let duration = responseJSON.duration; // en secondes
      let speed = distance / 1000 / (duration / 3600); // km/h

      let summaryHtml =
        "<div class='card card-body mb-2'>" +
        "<b>Résumé itinéraire</b><br>" +
        "Distance : " +
        (distance / 1000).toFixed(1) +
        " km<br>" +
        "Durée : " +
        Math.floor(duration / 60) +
        " min<br>" +
        "Vitesse moyenne : " +
        speed.toFixed(1) +
        " km/h" +
        "</div>";

      // Résumé affiché à droite de la carte
      let summaryDiv = document.getElementById("summary");
      summaryDiv.innerHTML = summaryHtml;

      // On affiche la réponse sur la page
      let responseDiv = document.getElementById("response");
      responseDiv.innerHTML =
        "<div class='card card-body'><pre>" +
        JSON.stringify(responseJSON, undefined, 2) +
        "</pre></div>";

      reqs--;
      if (reqs === 0) {
        loader.classList.remove("displayed");
        loader.classList.add("not_displayed");
      }
    })
    .catch(() => {
      reqs--;
      if (reqs === 0) {
        loader.classList.remove("displayed");
        loader.classList.add("not_displayed");
      }
    });
  // ----

  // ---- Requete envoyée à  un autre service

  // computeOtherRoad(request);

  // ----

  return true;
}
// ----

// ---- Calculer un itinéraire sur un autre service

// ---- Charger les paramà¨tres de l'utilisateur

function loadUserParameter(request) {
  let constraintObject = {};

  // Resource
  request.finalResource = document.getElementById("userResource").value;

  // Profile
  request.finalProfile = document.getElementById("userProfile").value;

  // Optimization
  request.finalOptimization = document.getElementById("userOptimization").value;

  // Constraint
  let plural = false;
  request.finalConstraint = "";
  if (document.forms["route-form"].elements["banned-highway"].checked) {
    if (plural) {
      request.finalConstraint = request.finalConstraint + "|";
    } else {
      plural = true;
    }
    constraintObject.constraintType = "banned";
    constraintObject.key = "wayType";
    constraintObject.operator = "=";
    constraintObject.value = "autoroute";
    request.finalConstraint =
      request.finalConstraint + JSON.stringify(constraintObject);
  }
  if (document.forms["route-form"].elements["banned-tunnel"].checked) {
    if (plural) {
      request.finalConstraint = request.finalConstraint + "|";
    } else {
      plural = true;
    }
    constraintObject.constraintType = "banned";
    constraintObject.key = "wayType";
    constraintObject.operator = "=";
    constraintObject.value = "tunnel";
    request.finalConstraint =
      request.finalConstraint + JSON.stringify(constraintObject);
  }
  if (document.forms["route-form"].elements["banned-bridge"].checked) {
    if (plural) {
      request.finalConstraint = request.finalConstraint + "|";
    } else {
      plural = true;
    }
    constraintObject.constraintType = "banned";
    constraintObject.key = "wayType";
    constraintObject.operator = "=";
    constraintObject.value = "pont";
    request.finalConstraint =
      request.finalConstraint + JSON.stringify(constraintObject);
  }
  if (document.forms["route-form"].elements["pref-imp"].checked) {
    if (plural) {
      request.finalConstraint = request.finalConstraint + "|";
    } else {
      plural = true;
    }
    constraintObject.constraintType =
      document.getElementById("pref-ou-avoid-imp").value;
    constraintObject.key = "importance";
    constraintObject.operator = document.getElementById("operator-imp").value;
    constraintObject.value = parseInt(
      document.getElementById("importance").value
    );
    request.finalConstraint =
      request.finalConstraint + JSON.stringify(constraintObject);
  }
  if (document.forms["route-form"].elements["pref-classt"].checked) {
    if (plural) {
      request.finalConstraint = request.finalConstraint + "|";
    } else {
      plural = true;
    }
    constraintObject.constraintType =
      document.getElementById("pref-ou-avoid-imp").value;
    constraintObject.key = "cpx_classement_administratif";
    constraintObject.operator = "=";
    constraintObject.value = document.getElementById("classement").value;
    request.finalConstraint =
      request.finalConstraint + JSON.stringify(constraintObject);
  }
  if (document.forms["route-form"].elements["pref-iti-vert"].checked) {
    if (plural) {
      request.finalConstraint = request.finalConstraint + "|";
    } else {
      plural = true;
    }
    constraintObject.constraintType = "prefer";
    constraintObject.key = "itineraire_vert";
    constraintObject.operator = "=";
    constraintObject.value = "vrai";
    request.finalConstraint =
      request.finalConstraint + JSON.stringify(constraintObject);
  }
}

// ----

// ---- Faire le lien avec l'autre service
// ----

// ---- Supprimer les données de l'utilisateur
function cancelUserData() {
  cancelMap();
  cancelForm();
}

// ---- Supprimer l'itinéraire affiché sur la carte
function cancelMap() {
  // Nettoyage des vecteurs qui contiennent les données sur la map
  vectorRoad.clear();
  vectorRoadOther.clear();
  // Nettoyage des div qui concernent les itinéraires supprimés
  let currentDiv = document.getElementById("request");
  currentDiv.innerHTML = "";
  currentDiv = document.getElementById("response");
  currentDiv.innerHTML = "";
}
// ----

// ---- Supprimer les paramà¨tres du formulaire
function cancelForm() {
  // Nettoyage du formulaire
  document.getElementById("route-form").reset();

  // Nettoyage des tableaux qui contiennent les points
  clickedStartPoint = new Array();
  clickedEndPoint = new Array();
  clickedIntPoint = new Array();

  // Nettoyage du vecteur qui contient les données sur la map
  vectorStartPoint.clear();
  vectorEndPoint.clear();
  vectorIntPoint.clear();
}
// ----

var utils = {
  to4326: function (coord) {
    return ol.proj.transform(
      [parseFloat(coord[0]), parseFloat(coord[1])],
      "EPSG:3857",
      "EPSG:4326"
    );
  },

  createFeature: function (coord, vector, position = 0) {
    var feature = new ol.Feature({
      type: "place",
      geometry: new ol.geom.Point(ol.proj.fromLonLat(coord)),
    });
    if (position == 0) {
      feature.setStyle(styles.icon);
    } else {
      feature.setStyle(styles.icon2);
    }
    vector.addFeature(feature);
  },

  deleteFeature: function (coord, vector) {
    let feature = vector.getClosestFeatureToCoordinate(coord);
    vector.removeFeature(feature);
  },

  createRoute: function (geom, format, vector, style = "red") {
    let route = {};

    if (format === "polyline") {
      route = new ol.format.Polyline({
        factor: 1e5,
      }).readGeometry(geom, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      });
    } else if (format === "wkt") {
      route = new ol.format.WKT().readGeometry(geom, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      });
    } else {
      return false;
    }

    let feature = new ol.Feature({
      type: "route",
      geometry: route,
    });

    if (style === "red") {
      feature.setStyle(styles.routePolyline);
    } else {
      feature.setStyle(styles.routeWkt);
    }

    vector.addFeature(feature);
  },
};

// Pour le chargement au changement de formulaire
$(".selectpicker").on("change", function (e) {
  if (clickedStartPoint.length !== 0 && clickedEndPoint.length !== 0) {
    cancelMap();
    computeRoad();
  }
});

$("#userResource").on("change", function (e) {
  if (clickedStartPoint.length !== 0 && clickedEndPoint.length !== 0) {
    cancelMap();
    computeRoad();
  }
  if (document.getElementById("userResource").value == "bdtopo-osrm") {
    document.getElementById("pref-imp").disabled = true;
    document.getElementById("pref-imp").checked = false;
    document.getElementById("pref-classt").disabled = true;
    document.getElementById("pref-classt").checked = false;
    document.getElementById("pref-iti-vert").disabled = true;
    document.getElementById("pref-iti-vert").checked = false;
  } else {
    document.getElementById("pref-imp").disabled = false;
    document.getElementById("pref-classt").disabled = false;
    document.getElementById("pref-iti-vert").disabled = false;
  }
});

$(".constrChkBx").on("change", function (e) {
  if (clickedStartPoint.length !== 0 && clickedEndPoint.length !== 0) {
    cancelMap();
    computeRoad();
  }
});
