const { getAuth, clerkClient } = require('@clerk/express');

const requireAuth = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  req.auth = { userId };
  next();
};

const requireAdmin = async (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata?.role;
    if (role !== 'admin' && role !== 'manager') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    req.auth = { userId, role };
    next();
  } catch (err) {
    console.error('requireAdmin error:', err.message);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

const requireDriver = async (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata?.role;
    if (role !== 'driver' && role !== 'admin' && role !== 'manager') {
      return res.status(403).json({ success: false, message: 'Driver access required' });
    }
    req.auth = { userId, role };
    next();
  } catch (err) {
    console.error('requireDriver error:', err.message);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

const requireRider = async (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata?.role;
    if (role !== 'rider' && role !== 'admin' && role !== 'manager') {
      return res.status(403).json({ success: false, message: 'Rider access required' });
    }
    req.auth = { userId, role };
    next();
  } catch (err) {
    console.error('requireRider error:', err.message);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

module.exports = { requireAuth, requireAdmin, requireDriver, requireRider };
