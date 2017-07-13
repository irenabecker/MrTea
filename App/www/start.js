//Using the HiveMQ public Broker, with a random client Id
 var client = new Messaging.Client("broker.mqttdashboard.com", 8000, "myclientid_" + parseInt(Math.random() * 100, 10));

 //Gets  called if the websocket/mqtt connection gets disconnected for any reason
 client.onConnectionLost = function (responseObject) {
     //Depending on your scenario you could implement a reconnect logic here
    //alert("connection lost: " + responseObject.errorMessage);
 };

 //Gets called whenever you receive a message for your subscriptions
 
 //Connect Options
 var options = {
     timeout: 3,
     //Gets Called if the connection has sucessfully been established
    onSuccess: function () {
         //console.log("Connected");
			//Do something with the push message you received
			//$('#messages').append('<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>');
		setTimeout(function() {
			client.subscribe('haw/dmi/mt/its/ss17', {qos: 2});	//your code to be executed after 1 second
		}, delayMillis);
	},
     //Gets Called if the connection could not be established
    onFailure: function (message) {
		//alert("Connection failed: " + message.errorMessage);
     }
 };
//client.connect(options);

 //Creates a new Messaging.Message Object and sends it to the HiveMQ MQTT Broker
 var publish = function (payload, topic, qos) {
     //Send your message (also possible to serialize it as JSON or protobuf or just use a string, no limitations)
     var message = new Messaging.Message(payload);
     message.destinationName = topic;
     message.qos = qos;
     client.send(message);
 }
 
 var delayMillis = 20; // Millisekunden
 
 var frucht = function(){
//	 client.connect(options);
	 setTimeout(function() {
		client.subscribe('haw/dmi/mt/its/ss17', {qos: 2}); //your code to be executed after 1 second
	}, delayMillis);
	 setTimeout(function() {
		 publish('Fruechtetee','haw/dmi/mt/its/ss17',2); //your code to be executed after 1 second
	}, delayMillis);	
	setTimeout(function() {
		 window.location.replace('frucht.html'); //your code to be executed after 1 second
	}, delayMillis);
}
 var schwarz = function(){
//	 client.connect(options);
	 setTimeout(function() {
		client.subscribe('haw/dmi/mt/its/ss17', {qos: 2}); //your code to be executed after 1 second
	}, delayMillis);
	 setTimeout(function() {
		 publish('Schwarztee','haw/dmi/mt/its/ss17',2); //your code to be executed after 1 second
	}, delayMillis);	
	setTimeout(function() {
		 window.location.replace('schwarz.html'); //your code to be executed after 1 second
	}, delayMillis);
	
}
 var pfefferminz = function(){
	//client.disconnect();


	setTimeout(function() {
//		client.connect(options); 	//your code to be executed after 1 second
	}, delayMillis);
	//setTimeout(function() {
		//client.subscribe('haw/dmi/mt/its/ss17', {qos: 2}); //your code to be executed after 1 second
	//}, delayMillis);
	setTimeout(function() {
		publish('Pfefferminztee','haw/dmi/mt/its/ss17',2); //your code to be executed after 1 second
	}, delayMillis);	
	setTimeout(function() {
		//window.location.replace(message.payloadString);
		window.location.replace('pfefferminz.html'); //your code to be executed after 1 second
	}, delayMillis);
}


var waitingPeppermint = function(){
	
	//client.connect(options); 	//your code to be executed after 1 second
	
	setTimeout(function() {
		//publish('warte','haw/dmi/mt/its/ss17',2);
		client.onMessageArrived = function (message) {
			if (message.payloadString == "Fertig Gezogen"){
				//alert("es lebt");
				window.location.replace('carefulPeppermint.html');
			}
			if (message.payloadString == "Tee trinkbereit"){
				//alert("es lebt");
				window.location.replace('enjoyPeppermint.html');
			}
		}
	}, delayMillis);
}
var waitingFruit = function(){
	
	//client.connect(options); 	//your code to be executed after 1 second
	
	setTimeout(function() {
		//publish('warte','haw/dmi/mt/its/ss17',2);
		client.onMessageArrived = function (message) {
			if (message.payloadString == "Fertig Gezogen"){
				//alert("es lebt");
				window.location.replace('carefulFruit.html');
			}
			if (message.payloadString == "Tee trinkbereit"){
				//alert("es lebt");
				window.location.replace('enjoyFruit.html');
			}
		}
	}, delayMillis);
}

var waitingBlack = function(){
	
	//client.connect(options); 	//your code to be executed after 1 second
	
	setTimeout(function() {
		//publish('warte','haw/dmi/mt/its/ss17',2);
		client.onMessageArrived = function (message) {
			if (message.payloadString == "Fertig Gezogen"){
				//alert("es lebt");
				window.location.replace('carefulBlack.html');
			}
			if (message.payloadString == "Tee trinkbereit"){
				//alert("es lebt");
				window.location.replace('enjoyBlack.html');
			}
		}
	}, delayMillis);
}


var exit = function(){
	 //client.connect(options);
	 setTimeout(function() {
		client.subscribe('haw/dmi/mt/its/ss17', {qos: 2}); //your code to be executed after 1 second
	}, delayMillis);
	 setTimeout(function() {
		 publish('abbr','haw/dmi/mt/its/ss17',2); //your code to be executed after 1 second
	}, delayMillis);	
	setTimeout(function() {
		 	client.disconnect();//your code to be executed after 1 second
	}, delayMillis);
	setTimeout(function() {
		 window.location.replace('index.html'); //your code to be executed after 1 second
	}, delayMillis);
}

