import { Router, Request, Response, NextFunction } from 'express';
import { AgentCoordinator } from '../coordinator';

const router = Router();
const coordinator = new AgentCoordinator();

(async () => {
  try {
    await coordinator.initialize();
  } catch (error) {
    console.error("Failed to initialize agent coordinator:", error);
  }
})();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function(req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.post('/process', asyncHandler(async (req, res) => {
  console.log("Processing task:", req.body); 

  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }
  const result = await coordinator.processTask(task);
  res.json({ result });
}));

router.post('/process-complex', asyncHandler(async (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }
  const result = await coordinator.processComplexTask(task);
  res.json({ result });
}));

export default router;