const express = require("express");
const app = express();
require("dotenv").config();
require("./mongoConnection");
app.use(express.json());

app.use(require(`./routes/auth`));
app.use(require(`./routes/book`));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(process.env.PORT, () => {
  console.log(`Provacc running on ${process.env.PORT}`);
});
