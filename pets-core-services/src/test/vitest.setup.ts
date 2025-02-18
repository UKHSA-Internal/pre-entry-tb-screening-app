import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({
  path: resolve(__dirname, "../../../configs/.env.test.local"),
});
