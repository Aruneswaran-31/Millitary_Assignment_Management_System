import { Router } from 'express';
import { listBases, createBase } from '../controllers/baseController';
import { authenticateJwt } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();
router.get('/', authenticateJwt, authorize(['admin']), listBases);
router.post('/', authenticateJwt, authorize(['admin']), createBase);
export default router;
