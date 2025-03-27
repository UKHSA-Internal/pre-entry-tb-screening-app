const path = require("path");
app.use(
  "/assets",
  express.static(path.join(__dirname, "/node_modules/govuk-frontend/dist/govuk/assets")),
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
