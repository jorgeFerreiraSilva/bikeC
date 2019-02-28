let map;
const markers = [];

window.onload = () => {
  const ironhackBCN = {
    lng: -46.634818,
    lat: -23.55274
  };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: ironhackBCN
  });

  const center = {
    lat: undefined,
    lng: undefined
  };

  getEvent();
};

const url = window.location.href;
const index = url.lastIndexOf('/');
const id = url.slice(index + 1);

function placeEvents(event) {
  console.log(event);
  // event.forEach((event) => {
  const center = {
    lat: event.location.coordinates[1],
    lng: event.location.coordinates[0]
  };
  const centerEnd = {
    lat: event.locationEnd.coordinates[1],
    lng: event.locationEnd.coordinates[0]
  };
  const pin = new google.maps.Marker({
    position: center,
    map,
    title: event.name
  });
  markers.push(pin);
  map.setCenter(center);
  const directionsService = new google.maps.DirectionsService();
  const directionsDisplay = new google.maps.DirectionsRenderer();

  const directionRequest = {
    origin: center,
    destination: centerEnd,
    travelMode: 'BICYCLING'
  };

  directionsService.route(directionRequest, (response, status) => {
    if (status === "OK") {

      directionsDisplay.setDirections(response);
    } else {    
      window.alert("Directions request failed due to " + status);
    }
  });

  directionsDisplay.setMap(map);
}

function getEvent() {
  axios
    .get(`/api/${id}`)
    .then((response) => {
      placeEvents(response.data.event);
    })
    .catch((error) => {
      console.log(error);
    });
}

const geocoder = new google.maps.Geocoder();

document.getElementById('formCreate').addEventListener('submit', (e) => {
  if (
    document.getElementById('latitude').value === ''
    && document.getElementById('latitudeEnd').value === ''
    && document.getElementById('longitude').value === ''
    && document.getElementById('longitudeEnd').value === ''
  ) {
    e.preventDefault();
    geocodeAddress(geocoder);
  }
});

function geocodeAddress(geocoder, resultsMap) {
  const address = document.getElementById('address').value;
  geocoder.geocode({ address }, (results, status) => {
    if (status === 'OK') {
      document.getElementById(
        'latitude'
      ).value = results[0].geometry.location.lat();
      document.getElementById(
        'longitude'
      ).value = results[0].geometry.location.lng();
      document.getElementById('formSubmit').click();
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
  const addressEnd = document.getElementById('addressEnd').value;
  geocoder.geocode({ address: addressEnd }, (results, status) => {
    if (status === 'OK') {
      document.getElementById(
        'latitudeEnd'
      ).value = results[0].geometry.location.lat();
      document.getElementById(
        'longitudeEnd'
      ).value = results[0].geometry.location.lng();
      document.getElementById('formSubmit').click();
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
