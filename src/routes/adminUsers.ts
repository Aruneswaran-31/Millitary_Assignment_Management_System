import { Router } from 'express';
import { listUsers, createUser } from '../controllers/userAdminController';
import { authenticateJwt } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();
router.get('/', authenticateJwt, authorize(['admin']), listUsers);
router.post('/', authenticateJwt, authorize(['admin']), createUser);
export default router;
