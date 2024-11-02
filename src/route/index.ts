import * as core from "express-serve-static-core";
import { health } from "./health";
import { compliance } from "./compliance";

export const RegisterRoutes = (app: core.Express): void =>
{
   
    app.use("/compliance", health);
    app.use("/compliance", compliance );
};
