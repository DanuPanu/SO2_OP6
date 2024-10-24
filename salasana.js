let hash = require("crypto").createHash("SHA512").update("kissakala").digest("hex");

console.log(hash);