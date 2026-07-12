const { createClient } = require("redis");

const client = createClient({
    url: "redis://file-service-redis:6379"
});

client.on("error", (err) => {
    console.log(err);
});

client.connect()
    .then(() => console.log("Redis Connected"))
    .catch(console.error);

module.exports = client;