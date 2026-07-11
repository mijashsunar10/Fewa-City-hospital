import Notification from '../models/Notification.js';

// @desc    Get all notifications for logged-in patient
// @route   GET /api/notifications
// @access  Private (Patient)
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ patient: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'appointment',
        populate: [
          { path: 'doctor', select: 'name qualification' },
          { path: 'department', select: 'title' }
        ]
      });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve notifications', error: error.message });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private (Patient)
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Verify ownership
    if (notification.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to modify this notification' });
    }

    notification.isRead = true;
    const updated = await notification.save();

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notification', error: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private (Patient)
export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { patient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notifications', error: error.message });
  }
};
