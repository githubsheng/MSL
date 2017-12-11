(function(){


    const relatedQuestionIds = new Set();

    function getMapPosition(action) {

        switch (action.type) {
            case "plugin_questionLoad":
                questionLoad(action);
                break;
            case "plugin_questionUnLoad":
                questionUnload(action);
                break;
            default:
            //nothing
        }

        function questionLoad(action) {
            const question = action.question;
            const questionDiv = action.questionDiv;

            if(question.type !== "empty") return;
            if(question.getMapPosition !== "true") return;


            relatedQuestionIds.add(question.id);
        }

        function questionUnload(action) {
            const question = action.question;
            const questionDiv = action.questionDiv;

            if(question.getMapPosition !== "true") return;
            //todo: unmount the map....

            relatedQuestionIds.delete(question.id);
        }

        function initMap(containerDiv) {
            const riseOfficeLocation = {lat: 35.6115, lng: 139.6284};

            const map  = new google.maps.Map(containerDiv, {
                center: riseOfficeLocation,
                zoom: 15
            });

            const marker = new google.maps.Marker({
                position: riseOfficeLocation,
                map: map,
                draggable: true
            });

            google.maps.event.addListener(marker, 'dragend', function(evt){
                const pos = evt.latLng;
                const distance = getDistance(pos.lat(), pos.lng(), riseOfficeLocation.lat, riseOfficeLocation.lng);
                if(distance > 5000) {
                    console.log("well, we don't expect you to take a lunch somewhere so far away..");
                }
            });

            function rad(x) {
                return x * Math.PI / 180;
            }

            function getDistance(p1Lat, p1Lng, p2Lat, p2Lng) {
                const R = 6378137; // Earth’s mean radius in meter
                const dLat = rad(p2Lat - p1Lat);
                const dLong = rad(p2Lng - p1Lng);
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(rad(p1Lat)) * Math.cos(rad(p2Lat)) *
                    Math.sin(dLong / 2) * Math.sin(dLong / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                // returns the distance in meter
                return R * c;
            }
        }
    }

    window.pluginManager.registerPlugins(getMapPosition, "getMapPosition");
})();


function initMap() {
    const riseOfficeLocation = {lat: 35.6115, lng: 139.6284};
    const map  = new google.maps.Map(document.getElementById('map'), {
        center: riseOfficeLocation,
        zoom: 15
    });
    const marker = new google.maps.Marker({
        position: riseOfficeLocation,
        map: map,
        draggable: true
    });
    google.maps.event.addListener(marker, 'dragend', function(evt){
        const pos = evt.latLng;
        const distance = getDistance(pos.lat(), pos.lng(), riseOfficeLocation.lat, riseOfficeLocation.lng);
        if(distance > 5000) {
            console.log("well, we don't expect you to take a lunch somewhere so far away..");
        }
    });
    function rad(x) {
        return x * Math.PI / 180;
    }
    function getDistance(p1Lat, p1Lng, p2Lat, p2Lng) {
        const R = 6378137; // Earth’s mean radius in meter
        const dLat = rad(p2Lat - p1Lat);
        const dLong = rad(p2Lng - p1Lng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1Lat)) * Math.cos(rad(p2Lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // returns the distance in meter
        return R * c;
    }
}

