module.exports = function(RED) {
	var i2cBus = require("i2c-bus");
    function pfc8574chipNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
		//node.cfg = config
		node.addr = parseInt(config.address, 16);
		node.lastWrite = 0
    }
    RED.nodes.registerType("pfc8574chip",pfc8574chipNode);
	
	function pfc8574Node(config) {
        RED.nodes.createNode(this,config);
        var node = this;
		node.addr = parseInt(config.address, 16);
		node.bit = config.bit
		
        node.on('input', function(msg) {
			var myChip = RED.nodes.getNode(config.address);
			const MASK = 1 << node.bit;
			if (msg.payload) {
				myChip.lastWrite |= MASK;
			} else {
				myChip.lastWrite &= ~MASK;
			}

			//msg.payload = myChip
			var theDevice = i2cBus.openSync(1);
			theDevice.sendByteSync(myChip.addr, myChip.lastWrite);
			theDevice.closeSync();
			
            //node.send(msg);
        });
    }
    RED.nodes.registerType("pfc8574",pfc8574Node);
	
}