const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.get("/", (reqs, res) => {
  res.send("Hello, World!");
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});