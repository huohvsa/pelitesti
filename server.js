const path = require("path");
const express = require("express");

const app = express();
const rootDir = __dirname;

app.use(express.static(rootDir));
app.use("/public", express.static(path.join(rootDir, "public")));
app.use("/docs", express.static(path.join(rootDir, "docs")));

app.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
