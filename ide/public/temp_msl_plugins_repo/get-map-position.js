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

            if(question.type !== "empty-question") return;
            if(question.getMapPosition !== "true") return;

            document.querySelector("#question-page-submit-button").disabled = true;

            const emptyQuestionSpace = questionDiv.querySelector("div.empty-question-space");

            const mapDiv = document.createElement("div");
            mapDiv.classList.add("map");
            emptyQuestionSpace.appendChild(mapDiv);
            //we need to set the width and height right now, so that the google map api can decide how to render based on the dimension of mapDiv.
            mapDiv.style.height = "400px";
            mapDiv.style.width = "100%";
            const mapControls = initMap(mapDiv, toggleTooFarWarning, question.id);

            const infoDiv = document.createElement("div");
            const resetAnchor = document.createElement("a");
            resetAnchor.onclick = function(evt){
                mapControls.resetToCenter();
                document.querySelector("#question-page-submit-button").disabled = false;
                evt.preventDefault();
            };
            resetAnchor.appendChild(document.createTextNode("Click here to reset the map"));
            infoDiv.appendChild(resetAnchor);

            const tooLongInfoSpan = document.createElement("span");
            tooLongInfoSpan.appendChild(document.createTextNode("Wooow, please choose a place near Rise office!"));
            tooLongInfoSpan.style.display = "none";
            function toggleTooFarWarning(isTooFar){
                tooLongInfoSpan.style.display = isTooFar ? "inline" : "none";
                document.querySelector("#question-page-submit-button").disabled = isTooFar;
            }
            infoDiv.appendChild(tooLongInfoSpan);

            emptyQuestionSpace.appendChild(infoDiv);

            relatedQuestionIds.add(question.id);
        }

        function questionUnload(action) {
            const question = action.question;
            const questionDiv = action.questionDiv;

            if(question.getMapPosition !== "true") return;

            const emptyQuestionSpace = questionDiv.querySelector("div.empty-question-space");
            while(emptyQuestionSpace.lastChild) emptyQuestionSpace.removeChild(emptyQuestionSpace.lastChild);

            relatedQuestionIds.delete(question.id);
        }

        function initMap(containerDiv, toggleTooLongWarning, questionId) {
            const riseOfficeLocation = {lat: 35.6115, lng: 139.6284};

            const map  = new google.maps.Map(containerDiv, {
                center: riseOfficeLocation,
                zoom: 15,
                //so user need to ctrl + scroll to zoom
                gestureHandling: 'cooperative'
            });

            const marker = new google.maps.Marker({
                position: riseOfficeLocation,
                map: map,
                draggable: true
            });

            google.maps.event.addListener(marker, 'dragend', function(evt){
                const pos = evt.latLng;
                const distance = getDistance(pos.lat(), pos.lng(), riseOfficeLocation.lat, riseOfficeLocation.lng);
                if(distance > 2000) {
                    toggleTooLongWarning(true);
                } else {
                    toggleTooLongWarning(false);
                    window.pluginManager.updateForm(questionId, "coordinate", {lat: pos.lat(), lng: pos.lng()});
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

            function resetToCenter(){
                map.panTo(riseOfficeLocation);
                marker.setPosition(riseOfficeLocation);
            }

            //return controls
            return {
                resetToCenter
            }
        }
    }

    window.pluginManager.registerPlugins(getMapPosition, "getMapPosition");
})();


