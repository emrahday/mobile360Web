( function (window, $) {
    'use strict';
    let map;
    let markers = [];
    let app = {
        initMap: () => {
            map = new google.maps.Map(document.getElementById('map'), { zoom: 4, center: { lat: -25.344, lng: 131.036 } });
            app.init();
        },
        init: () => {

            $('#create').on('click', () => {
                const data = $('#lat-lng-form').serializeJSON({
                    skipFalsyValuesForTypes: ['string'],
                    parseNumbers: true
                });
                app.createItem(data);
            });

            $('#update').on('click', () => {
                const data = $('#update-form').serializeJSON({
                    skipFalsyValuesForTypes: ['string'],
                    parseNumbers: true
                });
                app.updateItem(data);
            });

            $('#get-items').on('click', () => {
                const data = $('#get-items-form').serializeJSON({
                    skipFalsyValuesForTypes: ['string'],
                    parseNumbers: true
                });
                app.getItems(data);
            });

            $('#get-items-in-circle').on('click', () => {
                const data = $('#get-in-circle-form').serializeJSON({
                    skipFalsyValuesForTypes: ['string'],
                    parseNumbers: true
                });
                app.getItemsInCircle(data);
            });

            $('#check-items-in-circle-btn').on('click', () => {
                const data = $('#check-in-circle-form').serializeJSON({
                    skipFalsyValuesForTypes: ['string'],
                    parseNumbers: true
                });
                app.checkItemsInCircle(data);
            });
        },

        addMarkers: async data => {
            for (let item of data){
                app.addMarker(item);
            }
        },

        addMarker: async ({ lat, lng, _id }) => {
            var marker = new google.maps.Marker({ position: { lat, lng }, map: map });
            marker.metadata = {
                _id
            };
            markers.push(marker);
            map.panTo({ lat, lng });
        },

        updateMarker: async ({ lat, lng, _id}) => {
            const marker = markers.find( (m) => {
                return m.metadata._id === _id;
            });
            var latlng = new google.maps.LatLng(lat, lng);
            marker.setPosition(latlng);
        }, 

        createItem: async data => {
            const json = await app.fetchAPI('POST', 'create/item', data);
            if (json._id) {
                $('#create-result').html(JSON.stringify(json));
            }
            app.addMarker(json);
        },
        updateItem: async data => {
            const json = await app.fetchAPI('POST', 'update/item', data);
            if (json._id) {
                $('#update-result').html(JSON.stringify(json));
            }
            app.updateMarker({
                lat: data.lat,
                lng: data.lng,
                _id: data._id
            });

        },
        getItems: async query => {
            const json = await app.fetchAPI('POST', 'get/items', query);
            $('#items').html(JSON.stringify(json));
            app.addMarkers(json);
        },
        getItemsInCircle: async query => {
            const json = await app.fetchAPI('POST', 'get/items/circle', query);
            $('#items-in-circle').html(JSON.stringify(json));
        },
        checkItemsInCircle: async query => {
            const json = await app.fetchAPI('POST', 'check/item/circle', query);
            $('#check-items-in-circle').html(JSON.stringify(json.inCircle));
        },

        fetchAPI: async (method, path, body) => {
            const result = await fetch(`http://localhost:3000/${path}`, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const json = await result.json();
            return json;
        }

    };


    $(document).ready(function () {
        window.mobile360 = app;
    });
})(window, $);
