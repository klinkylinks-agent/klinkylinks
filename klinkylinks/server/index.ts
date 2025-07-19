import express from "express";
import { setupAuth } from "./auth";
import { registerRoutes } from "./routes";

const app = express();
const port = +(process.env.PORT || 4000);

setupAuth(app);
registerRoutes(app);

app.listen(port, () => console.log(\`Server listening on http://localhost:\${port}\`));
