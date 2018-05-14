SignStixDebug.info("Hello World");
myDeviceInfo();
var vendor = '2341';
var product = '43';
//distance in centimetres
const distanceFromSensor = 20;
const READ_INTERVAL_MS = 500;

var deviceInfo = getDeviceInfoFor(vendor, product);
if (deviceInfo == null) {
  SignStixDebug.error("Cannot get permission");
}
SignStixSerial.requestPermission(deviceInfo.devicePath, "onPermissionGranted");


//1 shows which device is shown
function myDeviceInfo() {
  var info = SignStixConfig.getDeviceId();
  if (info != null) {
    SignStixDebug.info(info);
  } else {
    SignStixDebug.error("error getting device name");
  }
}


//2 get device info for serial use
function getDeviceInfoFor(vendorId, productId) {
 var devicesInfo = SignStixSerial.getDevicesInfo();
 var devices = JSON.parse(devicesInfo);
 SignStixDebug.info(devicesInfo);
 var device = null;
 var i;
 for (i = 0; i < devices.length; i++) {
   var device = devices[i]
   if (device.vendorId == vendorId && device.productId == productId) {
     return device;
     SignStixDebug.info("received device info now going to ask for permission")
   } else {
     SignStixDebug.error("Error gaining device info", vendorId && productId);
   }
 }
  return null;
}

//3 get permission
function onPermissionGranted(devicePath, success) {
  SignStixDebug.info("we got permission granted ") + success;
  var driverName = "usb";
  var baudRate = 9600;
  var stopBits = 1;
  var dataBits = 8;
  var parity = 0;
  var connectionId = SignStixSerial.connect(devicePath, driverName, baudRate, stopBits, dataBits, parity);
  //starts reading from the serial device

  SignStixSerial.startReading(connectionId, "globalOnDataRead");
  SignStixDebug.info("Now starting to read data");
}

//4 Read from the device and change content on SignStix device
function globalOnDataRead(connectionId, hexData) {

  var distance = responseToDistance(hexData);
  // SignStixDebug.info(distance);
  	if (distance > distanceFromSensor) {
      SignStixSerial.write(connectionId, '67');
      SignStixEngine.jumpToFrame(1);
      SignStixDebug.info("read 1");
    } else if (distance < distanceFromSensor) {
      SignStixSerial.write(connectionId, '72');
      SignStixEngine.jumpToFrame(100);
      SignStixDebug.info("read 2");
    }
}


//5 Convert the bytes to hex and change the variable
function responseToDistance(hex) {
  var bytes = hexToBytes(hex);
  var value;
  for (var i = 0; i < bytes.length; i++) {
    var value = bytes[i];
    console.log(value + " cm");
  }
    return parseFloat(value);
}

//6
function hexToBytes(hex) {
  for (var bytes = [], a = 0; a < hex.length; a += 2)
  bytes.push(parseInt(hex.substr(a, 2), 16));
  console.log(bytes);
  return bytes;
}
