import WebSocket from "ws";

// Typed session object for cookie-session.
// cookie-session middleware always initializes req.session before route handlers.
interface AppSession {
  userId?: string | undefined;
  isNew?: boolean | undefined;
  isChanged?: boolean | undefined;
  isPopulated?: boolean | undefined;
}

declare global {
  namespace Express {
    interface Request {
      session: AppSession;
    }
  }
}

declare module "express" {
  function Router(options?: RouterOptions): Router;
  interface Router {
    ws: IRouterMatcher<this>;
  }
}

declare global {
  namespace Express {
    interface Request {
      _wsHandled: boolean;
      ws: WebSocket;
    }
    interface Application {
      ws: import("express").IRouterMatcher<this>;
    }
  }
}
