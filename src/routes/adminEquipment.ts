import { Router } from 'express';
import { listEquipment, createEquipment } from '../controllers/equipmentController';
import { authenticateJwt } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();
router.get('/', authenticateJwt, authorize(['admin']), listEquipment);
router.post('/', authenticateJwt, authorize(['admin']), createEquipment);
export default router;
