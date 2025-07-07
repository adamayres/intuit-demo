import { Request, Response, NextFunction, RequestHandler } from 'express';

export interface AuthRequest extends Request {
  userId?: number;
}

export const fakeAuthMiddleware: RequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.cookies?.authToken;

  if (!authToken) {
    console.log('No auth token found in cookies');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = parseInt(authToken, 10);

  if (isNaN(userId)) {
    console.log('Invalid auth token:', authToken);
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  req.userId = userId;
  next();
};
