import RPi.GPIO as GPIO
import time
import paho.mqtt. client as mqtt
import sys

GPIO.setmode(GPIO.BCM)  

# Servo Pin Siegnaloutput
GPIO.setup(22, GPIO.OUT)
# GPIO 22 als PWM mit 50Hz
p = GPIO.PWM(22, 50)
# Initialisierung
p.start(0) 

#MQTT Websocket
#url = "diginet.mt.haw-hamburg.de"
url = "broker.mqttdashboard.com"
topic = "haw/dmi/mt/its/ss17"
sendtopic = "haw/dmi/mt/its/ss17"

#Variablen
connected = False
Wartezeit = 0
StarteZeitschalter = False
Abbruch = False
Motor = False 
ThermometerAuslesen = False 

#Mit Server verbinden
def on_connect(client, userdata, flags, rc):
    global connected
    connected = True
    client.subscribe(topic)
    
#Auf Abfrage des Servers warten
def on_message(client, userdata, msg):
    global Wartezeit
    global StarteZeitschalter
    global Abbruch

    payload = msg.payload.decode('utf-8')

    if payload == 'abbr':
        Abbruch = True
        return
    elif payload == 'Pfefferminztee':
        Wartezeit = 120
        StarteZeitschalter = True
        return
    elif payload == 'Schwarztee':
        Wartezeit = 230
        StarteZeitschalter = True
        return
    elif payload == 'Fruechtetee':
        Wartezeit = 420
        StarteZeitschalter = True
        return
    
#Motor nach unten    
def MotorRunter():
    Motor = True 
    if Motor == True : 
        print ("Motor runter")
        on = True
        GPIO.output(22, on)
        try:
            while on:
                for i in range (88, 75, -1):
                    p.ChangeDutyCycle(i/10)
                    time.sleep(0.1)
                p.ChangeDutyCycle(0) 
                time.sleep(0.1)
                on = False
                Motor = False
        except KeyboardInterrupt:
            p.stop()
            GPIO.cleanup()
    elif Motor == False : 
        print ("Mache nichts")
        GPIO.output(22, False)
    else:
        print ("unbekannter Befehl")  
        
#Motor nach oben
def MotorHoch():
    Motor2 = True
    if Motor2 == True :
        print ("Motor hoch")
        on = True
        GPIO.output(22, on)
        try:
            while on:
                for i in range (75, 88, +1):
                    p.ChangeDutyCycle(i/10)
                    time.sleep(0.1)
                p.ChangeDutyCycle(0) 
                time.sleep(0.1)       
                Motor2 = False
                on = False        
        except KeyboardInterrupt:
            p.stop()
            GPIO.cleanup()
    elif Motor2 == False : 
        print ("Mache nichts")
        GPIO.output(22, False)
    else:
        print ("unbekannter Befehl")

#Thermometer Daten auslesen 
def TemperaturAuslesen():
    global temperature 
    
    print("Temperatur")
    print("##########")

    file = open('/sys/bus/w1/devices/' + '10-0008032a18bc' + '/w1_slave')

    filecontent = file.read()
    file.close()
    stringvalue = filecontent.split("\n")[1].split(" ")[9]
    temperature = float(stringvalue[2:]) / 1000
    print("%5.3f °C" % temperature)
    return
    
    sys.exit(0)
           
#Hier gehts los
client = mqtt.Client()
client.username_pw_set('haw', password='schuh+-0')
client.on_connect = on_connect
client.on_message = on_message


client.connect(url, 1883, 60) #Connect


#Starten des Threads
client.loop_start()

#Wait for connect Anzeige
print("Waiting for connection ", end='')
while not connected:
    print(".", end='')
    time.sleep(0.1)
print("[CONNECTED]")

#Hauptschleife
while 1:
    while(not StarteZeitschalter):
        print(".")
        time.sleep(1)
    StarteZeitschalter = False
    print("Starte die Uhr")

    startzeit = time.time() 
    
    MotorRunter() 
    time.sleep(1)
    
    Abbruch = False
    
    while(time.time()-startzeit < Wartezeit):
        timestr = "%.1fs"%(Wartezeit - (time.time()-startzeit))
        #client.publish(sendtopic, timestr)
        print(timestr)
        if Abbruch:
            MotorHoch()
            time.sleep(2)
            break
        time.sleep(1)
    if not Abbruch:
        print("Fertig Gezogen")
        client.publish(sendtopic, "Fertig Gezogen")
        MotorHoch ()
        time.sleep(2)
        ThermometerAuslesen = True 
    Abbruch = False
    while ThermometerAuslesen == True:
        TemperaturAuslesen ()
        #client.publish(sendtopic, temperature)
        time.sleep(5)
        if temperature < 37:
            print("Tee trinkbereit")
            client.publish(sendtopic, "Tee trinkbereit")
            ThermometerAuslesen = False
        elif Abbruch:
            time.sleep(2)
            break 
        Abbruch = False 

#Stoppen des Event-Threads
client.loop_stop()