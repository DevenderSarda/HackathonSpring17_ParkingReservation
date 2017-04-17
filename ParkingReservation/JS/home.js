/**
 * Created by deven on 1/29/2017.
 */

parkingReservation.controller('homeController', ['$scope', '$location', '$timeout', '$http', '$window', '$compile', function($scope, $location, $timeout, $http, $window, $compile) {

    var homeController = this;
   //


    var map;
    var mapOptions;
    var infos = [];

    var maplabel = 'P';


    $scope.gFromPlace;

    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker();
    $('#datetimepicker3').datetimepicker();
    $('#datetimepicker4').datetimepicker();

    $scope.reserved = 'reserved';
    $scope.available = 'available';


    $window.document.title = "GoParking";

    homeController.userData = gUserData;

    if(gUserData === ''){
        homeController.fb_id = JSON.parse(gFbData).id;
        var loginUserImage = document.getElementById('login_user_image');
        loginUserImage.src  = '//graph.facebook.com/'+homeController.fb_id+'/picture?type=large';
    }
    else {
        var loginUserImage = document.getElementById('login_user_image');
        loginUserImage.src = gUserData.Picture;
    }
    var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true
    });
    var directionsService = new google.maps.DirectionsService();

    homeController.signOut = function () {
            $location.path("login");
    };


    $scope.initialize = function () {
        var pos = new google.maps.LatLng(0, 0);
        var mapOptions = {
            zoom: 5,
            center: pos
        };

        map = new google.maps.Map(document.getElementById('map-canvas'));

        map.setCenter(new google.maps.LatLng(41.850033, -87.6500523));
        map.setZoom(4);
    };

    $scope.initialize();


    $scope.calcRoute = function () {
        var end = document.getElementById('endlocation').value;
        var start = document.getElementById('startlocation').value;

        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                console.log(status);
            }

        });
    };

    $scope.getLocations = function () {

        //var fromDateTime = Math.round((new Date($("#datetimepicker1 input").val())).getTime()/1000);
        //var toDateTime = Math.round((new Date($("#datetimepicker2 input").val())).getTime()/1000);

        var lat = parseFloat(document.getElementById('fromcityLat').value);
        var long = parseFloat(document.getElementById('fromcityLng').value);

        var data ={};
        data.lat = lat;
        data.long = long;
        //data.fromDateTime = fromDateTime;
        //data.toDateTime = toDateTime;

        //$http.get('https://api.parkwhiz.com/search/?lat=' + parseFloat(lat) +'&lng=' + parseFloat(long) +'&start=' + parseFloat(fromDateTime) +'&end=' + parseFloat(toDateTime) +'&key=3d165e10e05dd27cfc52f102d687ff8944e127e6').then(function (response) {
        $http.get('https://api.parkwhiz.com/search/?lat=' + parseFloat(lat) +'&lng=' + parseFloat(long) +'&key=3d165e10e05dd27cfc52f102d687ff8944e127e6').then(function (response) {
            $("#data_container").css('visibility', 'visible');

            var data =  response.data;

            console.log(data);
            homeController.parkingData = '';

            homeController.parkingData = data;

            /**Binding Map**/
            var locations = [];

            for(var i=0; i< data.parking_listings.length; i++){
                var parking_list = [];
                parking_list.push(data.parking_listings[i].location_name, data.parking_listings[i].address, data.parking_listings[i].available_spots, data.parking_listings[i].reservation, data.parking_listings[i].price_formatted, data.parking_listings[i].lat, data.parking_listings[i].lng, i);
                locations.push(parking_list);
            }

            var image = {
                url: 'https://cdn2.iconfinder.com/data/icons/sport-items-2/512/racing_flag-512.png',
                // This marker is 20 pixels wide by 32 pixels high.
                size: new google.maps.Size(20, 32),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(0, 32)
            };

            for (var i = 0; i < locations.length; i++) {
                var location = locations[i];
                if(i===0) {
                    map.setCenter(new google.maps.LatLng(location[5], location[6]));
                    map.setZoom(16);
                }
                var marker = new google.maps.Marker({
                    position: {lat: parseFloat(location[5]), lng: parseFloat(location[6])},
                    map: map,
                    //icon: image,
                    //shape: shape,
                    title: location[0],
                    label: maplabel
                });

                var content = '<div><span class="col-md-12" style="font-weight: bold;color: red">Parking Location Details</span></div><div><span class="col-md-12" style="font-weight: bold">LocationName: '+ location[0] + '</span></div><div><span class="col-md-12" style="font-weight: bold">Location Address: ' + location[1] + '</span></div><div><span class="col-md-12" style="font-weight: bold">Available Parking Spots: ' + location[2] + '</span></div><div><span class="col-md-12" style="font-weight: bold">Reserved Parking Spots: ' + location[3] + '</span></div><div><span class="col-md-12" style="font-weight: bold">Price: ' + location[4] + '/hour</span></div><div><button style="float: right;" onclick="showParkingSpots(\'' + location + '\')" class="btn btn-success btn-sm">Reserve Parking Spot</button></div>';
                var infowindow = new google.maps.InfoWindow({
                    maxWidth: 500
                });
               // var htmlcontent = $('#loadhtml');
                //htmlcontent.load(content);
                   // $compile(htmlcontent.contents())($scope);
                   // $scope.myVal= content;
                google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){

                    return function() {
                        homeController.closeInfos();
                        infowindow.setContent(content);
                        infowindow.open(map,marker);
                        infos[0]=infowindow;

                    };
                })(marker,content,infowindow));
            }

            /**End Of BindingMap**/

/**Binding Location List**/

            var list_data = homeController.parkingData;
            document.getElementById("location_list").innerHTML=" ";
            var output = document.getElementById('location_list');
            for (var i = 0; i < list_data.parking_listings.length; i++) {
                var btn = document.createElement("div");
                btn.setAttribute("id","list"+i);
                var t = document.createTextNode(list_data.parking_listings[i].location_name.toUpperCase() +"\n"+
                    "Available Spots :"+list_data.parking_listings[i].available_spots+"\n"+
                    "Price :"+list_data.parking_listings[i].price_formatted +"/hour");
                btn.setAttribute("class", "button");
                btn.appendChild(t);
                output.appendChild(btn);
            }

            /**End Binding Location List**/

        });

    };

    //homeController.changeTab =function(view){
      //  $('#view').tab('show')
    //};

    homeController.closeInfos = function(){

        if(infos.length > 0){

            /* detach the info-window from the marker ... undocumented in the API docs */
            infos[0].set("marker", null);

            /* and close it */
            infos[0].close();

            /* blank the array */
            infos.length = 0;
        }
    };


    homeController.goToProfile = function () {


        console.log('inside Profile');
        var y= homeController.userData.email;
        console.log(y);

        var x=$http.get('http://127.0.0.1:8081/sign',{params: {email:homeController.userData.email}});
        x.then(function (data) {
            if(data!=null) {

                gProfileData=data.data;
                console.log('Inside home js Profile Data'+gProfileData);

                $location.path("profile");



            }
            if(data==null)
            {
                console.log('error');
            }
        });




    };

    homeController.showParkingSpots =function(response) {
        var data = response.split(',');
        homeController.parkingSpotDetails = [];
        homeController.parkingSpotDetails = data;
            homeController.spots = [];
            for(var i=0; i< parseInt(data[3]); i++){
                homeController.spots.push('reserved');
        }
        for(var i=0; i< parseInt(data[2]); i++){
            homeController.spots.push('available');
        }
        console.log(homeController.spots);
    };

    homeController.reserveParkingSpot = function ($event) {
        var a = (event.target.id).toString();
        if($("#" + a).hasClass('green')){
            $('.reserve-modal').modal('show');
    }
        else {
            $('.reserve-modal').modal('hide');
        }
    };

    homeController.insertReservation = function () {
        var data = {
            'email': gUserData.email,
            'name': gUserData.name,
            'LocationName': homeController.selectedParkingDetails.location_name,
            'LocationAddress': homeController.selectedParkingDetails.address,
            'Price': homeController.selectedParkingDetails.price_formatted,
            'FromDateTime': $("#datetimepicker3 input").val(),
            'ToDateTime': $("#datetimepicker4 input").val(),
            'VehicleRegistrationNo': $("#registration").val()
        };
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('http://127.0.0.1:8081/reserve',data).then(function (response) {
            var data = {};
            data.email = gUserData.email;
            data.content = '<div><span class="col-md-12" style="font-weight: bold;color: green">Parking Location Details</span></div><div><span class="col-md-12" style="font-weight: bold">LocationName: '+ homeController.selectedParkingDetails.location_name + '</span></div><div><span class="col-md-12" style="font-weight: bold">Location Address: ' + homeController.selectedParkingDetails.address + '</span></div><div><span class="col-md-12" style="font-weight: bold">From Date Time: ' + $("#datetimepicker3 input").val() + '</span></div><div><span class="col-md-12" style="font-weight: bold">To Date Time: ' + $("#datetimepicker4 input").val() + '</span></div><div><span class="col-md-12" style="font-weight: bold">Price: ' + homeController.selectedParkingDetails.price_formatted + '/hour</span></div><div><span class="col-md-12" style="font-weight: bold">Vehicle Registration Number: '+$("#registration").val()+'</span></div><div><span class="col-md-12" style="font-weight: bold">Reservation Status: Reserved</span></div>';
            $http.post('http://127.0.0.1:8081/push',data).then(function (response) {
                console.log(response.data);
            });
            console.log(response.data);
            $scope.message = response.data;
            $('.reserve-modal').modal('hide');
            $(".parking-modal").modal('hide');
            toastr.success('Parking Reservation Complete. An Email confirmation has been sent to your registered email id.');
            var k=localStorage.getItem("id");
            homeController.parkingData.parking_listings[k].reservation=homeController.parkingData.parking_listings[k].reservation+1;
            homeController.parkingData.parking_listings[k].available_spots=homeController.parkingData.parking_listings[k].available_spots-1;
        });

    };

    homeController.showParkingArea = function($event, flag) {

        document.getElementById("layout").innerHTML = " ";
        var lay = document.getElementById("layout");

        var data = homeController.parkingData;
        var a;
        if (flag === 'list'){
             a = (event.target.id).toString();
        a = a.substring(4);
    }
    else{
            a = $event;
        }
        localStorage.setItem("id",a);
        homeController.selectedParkingDetails = data.parking_listings[a];
        var r=data.parking_listings[a].reservation;
        var s=data.parking_listings[a].available_spots;
        var b=data.parking_listings[a].available_spots+data.parking_listings[a].reservation;

        for(var k=1;k<=b & k<=6;k++)
        {
            if(k<=r) {
                var btn1 = document.createElement("div");
                btn1.setAttribute("id", "p" + k);
                var t = document.createTextNode("P1- " + k);
                btn1.setAttribute("class", "dis");
                btn1.appendChild(t);
                lay.appendChild(btn1);
                var app=document.getElementById("p"+k);
                var itag=document.createElement("i");
                itag.setAttribute("id","par"+k);
                itag.setAttribute("class","fa fa-car red");
                app.appendChild(itag);
            }
            else
            {
                var btn1 = document.createElement("div");
                btn1.setAttribute("id", "p" + k);
                var t = document.createTextNode("P1- " + k);
                btn1.setAttribute("class", "dis");
                btn1.appendChild(t);
                lay.appendChild(btn1);
                var app=document.getElementById("p"+k);
                var itag=document.createElement("i");
                itag.setAttribute("id","par"+k);
                itag.setAttribute("class","fa fa-car green");
                app.appendChild(itag);
            }
        }
        document.getElementById("layout2").innerHTML=" ";
        var bw=document.getElementById("layout2");
        for(var k=7;k<=b;k++)
        {
            if(k<=r) {
                var btn2 = document.createElement("div");
                btn2.setAttribute("id", "p" + k);
                var t = document.createTextNode("P1- " + k);
                btn2.setAttribute("class", "dis");
                btn2.appendChild(t);
                bw.appendChild(btn2);
                var app=document.getElementById("p"+k);
                var itag=document.createElement("i");
                itag.setAttribute("id","par"+k);
                itag.setAttribute("class","fa fa-car red");
                app.appendChild(itag);
            }
            else
            {
                var btn2 = document.createElement("div");
                btn2.setAttribute("id", "p" + k);
                var t = document.createTextNode("P1- " + k);
                btn2.setAttribute("class", "dis");
                btn2.appendChild(t);
                bw.appendChild(btn2);
                var app=document.getElementById("p"+k);
                var itag=document.createElement("i");
                itag.setAttribute("id","par"+k);
                itag.setAttribute("class","fa fa-car green");
                app.appendChild(itag)
            }
        }

        $(".parking-modal").modal('show');
        //document.getElementById('whole').style.display = 'block';
    }

}]);
