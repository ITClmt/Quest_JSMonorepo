import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

// Define program-related routes
import programActions from "./modules/program/programActions";

router.get("/api/programs", programActions.browse);
router.get("/api/programs/:id", programActions.read);
router.post("/api/programs", programActions.validate, programActions.add);
router.put("/api/programs/:id", programActions.validate, programActions.edit);
router.delete("/api/programs/:id", programActions.destroy);

/* ************************************************************************* */

// Declaration of a "Welcome" route

import sayActions from "./modules/say/sayActions";

router.get("/", sayActions.sayWelcome);

/* ************************************************************************* */

// Define category-related routes
import categoryActions from "./modules/category/categoryActions";

router.get("/api/categories", categoryActions.browse);
router.get("/api/categories/:id", categoryActions.read);
router.put(
  "/api/categories/:id",
  categoryActions.validate,
  categoryActions.edit,
);

export default router;
