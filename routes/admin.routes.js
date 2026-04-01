const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/admin.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

// ── Public ────────────────────────────────────────────
router.post('/login', ctrl.login);

// ── Authenticated ─────────────────────────────────────
router.get('/me', requireAuth, ctrl.me);

// ── Dashboard (manager + superadmin + security readonly) ─
router.get('/stats',     requireAuth, ctrl.stats);
router.get('/hourly',    requireAuth, ctrl.hourly);
router.get('/by-type',   requireAuth, ctrl.byType);
router.get('/trend',     requireAuth, ctrl.trend);
router.get('/top-hosts', requireAuth, ctrl.topHosts);
router.get('/visitors',  requireAuth, ctrl.visitorLog);
router.get('/export',    requireAuth, ctrl.exportCSV);

// ── User management (superadmin only) ─────────────────
router.get('/users',                requireAuth, requireRole('superadmin'), ctrl.getUsers);
router.post('/users',               requireAuth, requireRole('superadmin'), ctrl.createUser);
router.put('/users/:id',            requireAuth, requireRole('superadmin'), ctrl.updateUser);
router.post('/users/:id/password',  requireAuth, requireRole('superadmin'), ctrl.resetPassword);

module.exports = router;
