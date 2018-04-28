// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

var map, heatmap, directionsService, directionsDisplay, line, lineSymbol, constructionZone, constructionZoneCoords, modifier;
var progress
var userPoints = 0.0;
var points = 1;
// var driving = false;
var safeDriving = false;
var tripleZone = false;
var userPointsIndicator = document.querySelector('#placePoints');
var safeDrivingIndicator = document.querySelector('#safeDrivingIndicator');
console.log(userPointsIndicator);
console.log(safeDrivingIndicator);

// userPointsIndicator.innerHTML = points;
// safeDrivingIndicator.style.background = 'red';

// var start =  new google.maps.LatLng(36.841164, -75.974391);
// var end =  new google.maps.LatLng(36.849041, -75.975550);

var start = "36.841164, -75.974391";
var end = "36.849041, -75.975550";

var navVisible = false;

function initMap() {
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {
      lat: 36.848092,  //36.848562,  //36.8581819275,
      lng: -75.979129  //-75.979376  //-75.9790104736
    },
    mapTypeId: 'satellite'
    // mapTypeId: 'roadmap'
  });
  
  directionsDisplay.setMap(map);

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    radius: 20
  });
  
  constructionZoneCoords = [
          {lat: 36.844559, lng: -75.975533},
          {lat: 36.844639, lng: -75.975209},
          {lat: 36.847327, lng: -75.976371},
          {lat: 36.847343, lng: -75.975890}
        ];

  constructionZone = new google.maps.Polygon({paths: constructionZoneCoords});

//   // Define the symbol, using one of the predefined paths ('FORWARD_CLOSED_ARROW')
//   // supplied by the Google Maps JavaScript API.
//   lineSymbol = {
//     path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
//     scale: 6,
//     strokeColor: '#4885ed'
//   };

//   // Create the polyline and add the symbol to it via the 'icons' property.
//   line = new google.maps.Polyline({
//     // path: [{lat: 22.291, lng: 153.027}, {lat: 18.291, lng: 153.027}],
//     path: [{lat: 36.841164, lng: -75.974391},
//            {lat: 36.849035, lng: -75.976522},
//            {lat: 36.849194, lng: -75.975558}],
//     icons: [{
//       icon: lineSymbol,
//       offset: '100%'
//     }],
//     map: map
//   });

  // document.getElementById('toggleNav').addEventListener('click', animateArrow(line));

  createArrow();
  //animateArrow();
}

function increasePoints() {
  points = points * modifier; 
  
  userPoints = userPoints + points;
}

function decreasePoints() {
  points = points * modifier; 

  userPoints = userPoints - points;
}

function increasePointsModifier() {
  if (tripleZone) {
    modifier = 2.5;
  } else {
    modifier = 1.5;
  }  
}

function pointsLogic() {
  // if (driving) {
    if (safeDriving) {
      increasePoints();
      // safeDrivingIndicator.style.background = 'green';
    } else {
      decreasePoints();
      // safeDrivingIndicator.style.background = 'red';
    }
  
    userPointsIndicator.innerHTML = userPoints;
  // }
}

const routePercentage = [7.26, 12.11, 22.70, 23.57, 30.93, 31.24, 41.99, 44.25, 45.81, 47.82, 55.43, 57.76, 68.32, 69.57, 79.19, 82.86, 90.22];
const constructionPercentage = [39.29, 72.05];

function zoneCheck(offset){
  
  offset = parseFloat(offset);
  
  var i;
  for (i = 0; i < routePercentage.length; i++) {
    var distance = Math.pow((routePercentage[i] - offset), 2); 
    
        if (i = 8 && distance <= .36)
        {
          tripleZone = true;
        } else {
          tripleZone = false;
        }

    if (distance <= .36)
    {
      increasePointsModifier();
    } else {
      modifier = 1;
    }
  }

  // if (offset >= constructionPercentage[0] && offset <= constructionPercentage[1]){
    // DO construction zone things
  // }
  
  

  // pointsLogic();
}

function createArrow() {
  lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 6,
    strokeColor: '#4885ed'
  };

  // Create the polyline and add the symbol to it via the 'icons' property.
  line = new google.maps.Polyline({
    // path: [{lat: 22.291, lng: 153.027}, {lat: 18.291, lng: 153.027}],
    path: [{lat: 36.841164, lng: -75.974391},
           {lat: 36.849035, lng: -75.976522},
           {lat: 36.849194, lng: -75.975558}],
    icons: [{
      icon: lineSymbol,
      offset: '100%'
    }],
  });
}

// Use the DOM setInterval() function to change the offset of the symbol
// at fixed intervals.
function animateArrow() {
  var count = 0;
  // driving = true;
  
  window.setInterval(function() {      
    count = (count + 1) % 200;
    
    if (count == 0)
      userPoints = 0.0;

    var icons = line.get('icons');
    icons[0].offset = (count / 2) + '%';
    line.set('icons', icons);
    
    // console.log(icons[0].offset);

    progress = icons[0].offset;
    zoneCheck(progress);
  }, 20);
}



function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: '36.841176, -75.974362',  //document.getElementById('start').value,
      destination: '36.849041, -75.975550',  //document.getElementById('end').value,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  //var route = response.routes[0];
  }

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function toggleSafeDriving() {
  safeDriving = !safeDriving;
}

function toggleRoute() {
  calculateAndDisplayRoute(directionsService, directionsDisplay);
}

function toggleNavigation() {
  // Define the symbol, using one of the predefined paths ('FORWARD_CLOSED_ARROW')
  // supplied by the Google Maps JavaScript API.
  
  navVisible = !navVisible;
  
  if (navVisible)
    line.setMap(map);
  else
    line.setMap(null);
}

// Heatmap data: 500 Points
function getPoints() {
  return [
    new google.maps.LatLng(36.8581819275, -75.9790104736),
    new google.maps.LatLng(36.8376497271, -75.9771314756),
    new google.maps.LatLng(36.8432289545, -75.9749940638),
    new google.maps.LatLng(36.8477323813, -75.9839999682),
    new google.maps.LatLng(36.8572030307, -75.9776142419),
    new google.maps.LatLng(36.8571801565, -75.9787423481),
    new google.maps.LatLng(36.8417991243, -75.9746056565),
    new google.maps.LatLng(36.845162496, -75.9755272786),
    new google.maps.LatLng(36.8404059133, -75.9742227361),
    new google.maps.LatLng(36.8422251192, -75.9747217925),
    new google.maps.LatLng(36.8471972811, -75.9760620645),
    new google.maps.LatLng(36.8610506909, -75.9797950963),
    new google.maps.LatLng(36.8534754247, -75.9765743001),
    new google.maps.LatLng(36.8484895758, -75.9803396649),
    new google.maps.LatLng(36.8422330697, -75.9747239332),
    new google.maps.LatLng(36.8473955153, -75.9859291785),
    new google.maps.LatLng(36.8570778019, -75.9775797332),
    new google.maps.LatLng(36.8461938379, -75.9757922483),
    new google.maps.LatLng(36.8431489162, -75.9749720649),
    new google.maps.LatLng(36.8590097583, -75.979801133),
    new google.maps.LatLng(36.8489558393, -75.9765406986),
    new google.maps.LatLng(36.8494451555, -75.9766674715),
    new google.maps.LatLng(36.8532035636, -75.9776548287),
    new google.maps.LatLng(36.8497722952, -75.9767582903),
    new google.maps.LatLng(36.8487155162, -75.9783807097),
    new google.maps.LatLng(36.8520138661, -75.9773682625),
    new google.maps.LatLng(36.8489696484, -75.9765444724),
    new google.maps.LatLng(36.8424096415, -75.9734821488),
    new google.maps.LatLng(36.8450282707, -75.9754893589),
    new google.maps.LatLng(36.852071256, -75.9773838402),
    new google.maps.LatLng(36.8450077645, -75.9761743099),
    new google.maps.LatLng(36.8504068334, -75.9769317056),
    new google.maps.LatLng(36.8334527159, -75.9723330563),
    new google.maps.LatLng(36.8386734913, -75.9724549442),
    new google.maps.LatLng(36.8519816723, -75.9773595255),
    new google.maps.LatLng(36.8601590872, -75.9795484073),
    new google.maps.LatLng(36.8471187047, -75.9760405481),
    new google.maps.LatLng(36.8467968064, -75.9778615939),
    new google.maps.LatLng(36.8523011838, -75.9774418579),
    new google.maps.LatLng(36.8431460068, -75.9749712654),
    new google.maps.LatLng(36.8453010717, -75.9755625931),
    new google.maps.LatLng(36.856236969, -75.9784915959),
    new google.maps.LatLng(36.8486889122, -75.9785359619),
    new google.maps.LatLng(36.8438242593, -75.975153609),
    new google.maps.LatLng(36.844162952, -75.9752459855),
    new google.maps.LatLng(36.8520824545, -75.9773868783),
    new google.maps.LatLng(36.8399449249, -75.9727902125),
    new google.maps.LatLng(36.8451263936, -75.9755131642),
    new google.maps.LatLng(36.8483273469, -75.9763766923),
    new google.maps.LatLng(36.8563009189, -75.978513337),
    new google.maps.LatLng(36.8383631498, -75.9736853001),
    new google.maps.LatLng(36.8448370144, -75.975433551),
    new google.maps.LatLng(36.8462139103, -75.9745089034),
    new google.maps.LatLng(36.8396950497, -75.9727260638),
    new google.maps.LatLng(36.8587567527, -75.9812244992),
    new google.maps.LatLng(36.8392470648, -75.9739037974),
    new google.maps.LatLng(36.8377119965, -75.9813395671),
    new google.maps.LatLng(36.8509165091, -75.9770828759),
    new google.maps.LatLng(36.8479967411, -75.9762879369),
    new google.maps.LatLng(36.8504072202, -75.9769435184),
    new google.maps.LatLng(36.8451131517, -75.9755896935),
    new google.maps.LatLng(36.8486601071, -75.9843601558),
    new google.maps.LatLng(36.845997226, -75.9757432048),
    new google.maps.LatLng(36.8510267094, -75.977112479),
    new google.maps.LatLng(36.8496230629, -75.9789079426),
    new google.maps.LatLng(36.8485055185, -75.9803440918),
    new google.maps.LatLng(36.8489680116, -75.9827835326),
    new google.maps.LatLng(36.8570332768, -75.977567464),
    new google.maps.LatLng(36.8382738261, -75.973663101),
    new google.maps.LatLng(36.847208013, -75.9760773808),
    new google.maps.LatLng(36.8376986384, -75.9804335595),
    new google.maps.LatLng(36.8619352321, -75.9800418393),
    new google.maps.LatLng(36.8451789822, -75.9742133595),
    new google.maps.LatLng(36.8519403832, -75.9773650879),
    new google.maps.LatLng(36.8532111894, -75.9776532396),
    new google.maps.LatLng(36.8487226357, -75.9841952871),
    new google.maps.LatLng(36.8520254017, -75.9773896083),
    new google.maps.LatLng(36.8580851496, -75.9789976133),
    new google.maps.LatLng(36.8574878363, -75.9776910712)
  ];
}

/* Hotspots along Pacific Ave from 9th St/Norfolk Ave to 35th St.*/
const risk_areas = [
    { point: [36.862409,-75.980093], weight: 2 },
    { point: [36.861079,-75.979793], weight: 2 },
    { point: [36.861027,-75.979578], weight: 2 },
    { point: [36.858619,-75.979063], weight: 5 },
    { point: [36.857191,-75.978774], weight: 2 },
    { point: [36.856283,-75.978484], weight: 5 },
    { point: [36.853302,-75.977679], weight: 5 },
    { point: [36.851937,-75.977336], weight: 10 },
    { point: [36.850949,-75.977143], weight: 5 },
    { point: [36.850357,-75.976917], weight: 5 },
    { point: [36.849593,-75.976714], weight: 2 },
    { point: [36.849035,-75.976574], weight: 5 },
    { point: [36.848056,-75.976306], weight: 2 },
    { point: [36.847095,-75.976048], weight: 10 },
    { point: [36.846142,-75.975759], weight: 2 },
    { point: [36.845120,-75.975523], weight: 15 },
    { point: [36.843952,-75.975201], weight: 2 },
    { point: [36.843231,-75.974954], weight: 10 },
    { point: [36.842321,-75.974772], weight: 5 },
    { point: [36.840346,-75.974182], weight: 2 },
    { point: [36.839359,-75.973967], weight: 2 },
    { point: [36.838345,-75.973688], weight: 5 }
];

const variance = 0.00000004;

function get_weight(lat,lng) {
    let weight = 1;

    for (const area of risk_areas) {
        let d = Math.pow(area.point[0]-lat, 2) + Math.pow(area.point[1]-lng,2);

        if (d <= variance)
            weight = Math.max(weight, area.weight)
    }

    return weight;
}


function showNewUserModal() {
  let newUserModal = document.querySelector('.modal');
  let closeModalButton = document.querySelector('.modal__close');
  let gotItButton = document.querySelector('.modal__button');
  
  closeModalButton.addEventListener('click', closeModal);
  gotItButton.addEventListener('click', closeModal);
  document.addEventListener('keypress', keypressHandler)
  
  function closeModal() {
    newUserModal.classList.add('modal--dismissed');
  }
  
  function keypressHandler(event) {
    if (event.keyCode == 27) {
      closeModal();
    }
  }
}

// document.addEventListener('DOMContentLoaded', function() {
//   showNewUserModal();
// });