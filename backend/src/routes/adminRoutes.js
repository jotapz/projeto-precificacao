import express from 'express';
import AdminController from '../controllers/adminController.js';
import { adminAuth } from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.post('/admin/login', AdminController.login);
router.post('/admin', AdminController.createAdmin);

router.get('/admin/exists', AdminController.exists);
router.get('/admin/dashboard-public', AdminController.dashboardPublic);

router.get('/admin', adminAuth, AdminController.listAdmins);
router.delete('/admin/:id', adminAuth, AdminController.deleteAdmin);
router.get('/admin/dashboard', adminAuth, AdminController.dashboard);

export default router;
