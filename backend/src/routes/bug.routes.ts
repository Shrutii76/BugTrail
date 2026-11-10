import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createBugSchema,
  updateBugSchema,
  bugIdParamsSchema,
  listBugsQuerySchema,
} from "../validators/bug.validator";

import {
  createBug,
  getBugs,
  getBugById,
  updateBug,
} from "../controllers/bug.controller";

import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

router.get("/", validate(listBugsQuerySchema, "query"), getBugs);

router.post("/", validate(createBugSchema), createBug);

router.get("/:bugId", validate(bugIdParamsSchema, "params"), getBugById);

router.patch(
  "/:bugId",
  validate(bugIdParamsSchema, "params"),
  validate(updateBugSchema),
  updateBug,
);

export default router;
