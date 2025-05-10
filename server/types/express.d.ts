import { Router } from "express";
import { User } from "@prisma/client";

declare module "./routes/comments" {
  const router: Router;
  export default router;
}

declare module "./routes/contact" {
  const router: Router;
  export default router;
}

declare module "./routes/notifications" {
  const router: Router;
  export default router;
}

declare module "./middleware/engagement" {
  import { Request, Response, NextFunction } from "express";
  export const trackEngagement: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
