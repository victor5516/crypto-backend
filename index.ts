
import app from "./src/app";
import config from "config"
const PORT = 3003;
async function main() {
  try {
    app.listen(PORT);
    console.log("Server on port", PORT);
  } catch (error) {
    console.error(error);
  }
}

main();