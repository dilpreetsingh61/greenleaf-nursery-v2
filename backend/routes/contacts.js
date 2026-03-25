const express = require("express");
const { body, validationResult } = require("express-validator");
const { asyncHandler } = require("../middleware/errorHandler");
const { Contact, NewsletterSubscriber } = require("../models");

const router = express.Router();

function normalizeContact(contact) {
  const plain = typeof contact.get === "function" ? contact.get({ plain: true }) : contact;
  return {
    ...plain,
    createdAt: plain.createdAt || plain.created_at,
  };
}

router.post(
  "/",
  [
    body("firstName").trim().notEmpty().isLength({ min: 2, max: 50 }).matches(/^[a-zA-Z\s]+$/),
    body("lastName").trim().notEmpty().isLength({ min: 2, max: 50 }).matches(/^[a-zA-Z\s]+$/),
    body("email").trim().isEmail().normalizeEmail().isLength({ max: 100 }),
    body("phone").optional({ checkFalsy: true }).trim().matches(/^[\d\s\-\+\(\)]+$/).isLength({ max: 20 }),
    body("subject").trim().notEmpty().isLength({ min: 3, max: 200 }),
    body("message").trim().notEmpty().isLength({ min: 10, max: 2000 }),
    body("newsletter").optional().isBoolean(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, phone, subject, message, newsletter } = req.body;
    const fullName = `${firstName} ${lastName}`.trim();

    const contact = await Contact.create({
      name: fullName,
      email,
      phone: phone || null,
      subject,
      message,
    });

    if (newsletter) {
      const [subscriber, created] = await NewsletterSubscriber.findOrCreate({
        where: { email },
        defaults: { email, isActive: true, subscribedAt: new Date() },
      });

      if (!created && !subscriber.isActive) {
        await subscriber.update({ isActive: true, subscribedAt: new Date() });
      }
    }

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We will get back to you soon.",
      data: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt,
      },
    });
  })
);

router.get(
  "/all",
  asyncHandler(async (req, res) => {
    const where = req.query.unreadOnly === "true" ? { isRead: false } : undefined;
    const contacts = await Contact.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: `Found ${contacts.length} contact message(s)`,
      contacts: contacts.map(normalizeContact),
    });
  })
);

router.get(
  "/stats/summary",
  asyncHandler(async (req, res) => {
    const contacts = await Contact.findAll();
    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const stats = {
      total_messages: contacts.length,
      unread_messages: contacts.filter((contact) => !contact.isRead).length,
      unreplied_messages: contacts.filter((contact) => !contact.isReplied).length,
      messages_today: contacts.filter((contact) => new Date(contact.createdAt).getTime() > dayAgo).length,
      messages_this_week: contacts.filter((contact) => new Date(contact.createdAt).getTime() > weekAgo).length,
    };

    res.json({
      success: true,
      message: "Contact statistics retrieved successfully",
      stats,
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    res.json({
      success: true,
      message: "Contact message retrieved successfully",
      contact: normalizeContact(contact),
    });
  })
);

router.patch(
  "/:id/read",
  asyncHandler(async (req, res) => {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    await contact.update({ isRead: true });

    res.json({
      success: true,
      message: "Contact message marked as read",
      contact: normalizeContact(contact),
    });
  })
);

router.patch(
  "/:id/replied",
  asyncHandler(async (req, res) => {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    await contact.update({ isRead: true, isReplied: true });

    res.json({
      success: true,
      message: "Contact message marked as replied",
      contact: normalizeContact(contact),
    });
  })
);

module.exports = router;
