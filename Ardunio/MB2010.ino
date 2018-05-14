int sonicPin = 3;
int incomingByte;
long int sensor;
long mm, cm, inches;


void setup() {
  Serial.begin(9600);
  pinMode(sonicPin, INPUT);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
}

void readSensor () {
  sensor = pulseIn(sonicPin, HIGH);
  cm = sensor/58;
}

void loop() {
  incomingByte = Serial.read();
  readSensor();
  if (incomingByte == 'a' && cm > 100) {
    Serial.write(cm);
  }
}



//int getDistance(int trigPin, int echoPin) {// returns the distance (cm)
//
//  long duration, distance;
//
//  digitalWrite(trigPin, HIGH); // We send a 10us pulse
//  delayMicroseconds(10);
//  digitalWrite(trigPin, LOW);
//
//  duration = pulseIn(echoPin, HIGH, 20000); // We wait for the echo to come back, with a timeout of 20ms, which corresponds approximately to 3m
//
//  // pulseIn will only return 0 if it timed out. (or if echoPin was already to 1, but it should not happen)
//  if (duration == 0) { // If we timed out
//    pinMode(echoPin, OUTPUT); // Then we set echo pin to output mode
//    digitalWrite(echoPin, LOW); // We send a LOW pulse to the echo pin
//    delayMicroseconds(200);
//    pinMode(echoPin, INPUT); // And finaly we come back to input mode
//  }
//
//  distance = (duration / 2) / 29.1; // We calculate the distance (sound speed in air is aprox. 291m/s), /2 because of the pulse going and coming
//
//  return distance; //We return the result. Here you can find a 0 if we timed out
//}
