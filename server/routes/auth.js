const express = require('express');
const router = express.Router();
const { clerkClient } = require('@clerk/express');
const { requireAuth } = require('../middleware/requireAuth');

// POST /api/auth/set-role
// Sets publicMetadata.role on the Clerk user (only allowed if no role is already set)
router.post('/set-role', requireAuth, async (req, res) => {
  const { role } = req.body;
  const { userId } = req.auth;

  if (!['rider', 'driver', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }

  try {
    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata?.role) {
      return res.status(409).json({ success: false, message: 'Role is already set' });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    res.json({ success: true, role });
  } catch (err) {
    console.error('set-role error:', err);
    res.status(500).json({ success: false, message: 'Failed to set role' });
  }
});

module.exports = router;
