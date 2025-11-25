import express from 'express';
import AdminController from '../controllers/adminController.js';
import { adminAuth } from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

// Public: admin login
router.post('/admin/login', AdminController.login);
// Create admin (allow public for first setup - could be protected later)
router.post('/admin', AdminController.createAdmin);

// Existence check (public)
router.get('/admin/exists', AdminController.exists);
// Public dashboard for bootstrapping when no admins exist
router.get('/admin/dashboard-public', AdminController.dashboardPublic);

// Protected admin routes
router.get('/admin', adminAuth, AdminController.listAdmins);
router.delete('/admin/:id', adminAuth, AdminController.deleteAdmin);
router.get('/admin/dashboard', adminAuth, AdminController.dashboard);

export default router;
