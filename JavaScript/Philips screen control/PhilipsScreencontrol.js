var productID = ""
var vendorID = ""

var philipsPanelsArray = [12, 12, 12];

var deviceInfo = getDeviceInfoFor(vendorID, productID)
if (deviceInfo == null) {
  SignStixDebug.error("Cannot get permission")
}
SignStixSerial.requestPermission(deviceInfo, "permissionGranted")


function getDeviceInfoFor(vendorId, productId) {
    var deviceInfo = SignStixSerial.getDevicesInfo();
    var device = JSON.parse(deviceInfo);
    var device = null;
    for(var i = 0; i < device.length; i ++) {
      var device = device[i]
      if (device.vendorId == vendorID && device.productID == productID) {
        return device;
      } else {
      SignStixDebug.error("Error gaining info from the device")
    }
    return device;
  }
}

function permissionGranted(devicePath, success) {
  SignStixDebug.info("permission granted");
  var driverName = "usb";
  var baudRate = 9600;
  var stopBits = 1;
  var dataBits = 8;
  var parity = 0;
  var connectionId = SignStixSerial.connect(devicePath, driverName, baudRate, stopBits, dataBits, parity);
  var currentSign = SignStixStats.getCurrentSignInfo();
  SignStixSerial.startReading(connectionId, "touchWasTapped")
  if (currentSign == "blankScreen") {
    powerDown();
  }
}

function touchWasTapped(connectionId, hexData) {
  var tapped = dataRead(hexdata);
  if (tapped == (20)) {
    powerDown();
  }
}

function powerDown() {
  var currentSign = SignStixStats.getCurrentSignInfo;
  if (currentSign == "powerOffSign") {
    for (var i in philipsPanelsArray) {
      SignStixPhilips.sendCommand("on off command", philipsPanelsArray[i]);
    }
  } else if (currentSign == "powerOnSign") {
      SignStixPhilips.sendCommand("on off command", philipsPanelsArray[i]);
    }
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
