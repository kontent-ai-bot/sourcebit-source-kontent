const config = require("./sourcebit.js");
const sourcebit = require("sourcebit");

sourcebit.fetch(config, { cache: false, watch: true }).then(data => console.log(data));
