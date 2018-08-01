var productID = "9204"
var vendorID = "1B4F"

var philipsPanelsArray = ['192.168.5.22'];

var deviceInfo = getDeviceInfoFor(vendorID, productID)
if (deviceInfo == null) {
  SignStixDebug.error("Cannot get permission")
}
SignStixSerial.requestPermission(deviceInfo.devicePath, "permissionGranted");


function getDeviceInfoFor(vendorId, productId) {
 var devicesInfo = SignStixSerial.getDevicesInfo();
 var devices = JSON.parse(devicesInfo);
 SignStixDebug.info(devicesInfo);
 SignStixDebug.info(SignStixStats.getCurrentSignInfo);
 var device = null;
 var i;
 for (i = 0; i < devices.length; i++) {
   var device = devices[i]
   if (device.vendorId == vendorId && device.productId == productId) {
     return device;
     SignStixDebug.info("received device info now going to ask for permission");
   } else {
     SignStixDebug.error("Error gaining device info", vendorId && productId);
   }
 }
  return null;
}

function permissionGranted(devicePath, success) {
  SignStixDebug.info("permission granted") + success;
  var driverName = "usb";
  var baudRate = 9600;
  var stopBits = 1;
  var dataBits = 8;
  var parity = 0;
  var connectionId = SignStixSerial.connect(devicePath, driverName, baudRate, stopBits, dataBits, parity);
  var currentSign = SignStixStats.getCurrentSignInfo();
  SignStixSerial.startReading(connectionId, "touchWasTapped")
}

function touchWasTapped(connectionId, hexData) {
  var tapped = dataRead(hexData);
  if (tapped == 20) {
    SignStixEngine.jumpToSignInSequence("PhilipsPowerOff");
    powerToggle();
  }
}

function powerToggle() {
  SignStixDebug.info("power toggle");
  var currentSign = SignStixStats.getCurrentSignInfo;
  if (currentSign == "powerOffSign") {
    for (var i in philipsPanelsArray) {
       SignStixPhilips.sendCommand("on off command", philipsPanelsArray[i]);
       // SignStixDebug.info("now sending command to power off");
       // SignStixPhilips.sendCommand('06010018011E', '192.168.5.22'); //power off the screen
     }
   }
  if (currentSign != "powerOffSign") {
    SignStixDebug.info("now sending command to power on");
    SignStixPhilips.sendCommand('06010018021E', '192.168.5.22');
  }
  //
  // } else if (currentSign == "powerOnSign") {
  //     SignStixPhilips.sendCommand("on off command", philipsPanelsArray[i]);
  //   }
  }


function dataRead(hex) {
  var bytes = hexToBytes(hex);
  var value;
  for (var i = 0; i < bytes.length; i++) {
    var value = bytes[i];
  }
  return parseFloat(value);
}

function hexToBytes(hex) {
  for (var bytes = [], a = 0; a < hex.length; a += 2)
  bytes.push(parseInt(hex.substr(a, 2), 16));
  return bytes;
}
