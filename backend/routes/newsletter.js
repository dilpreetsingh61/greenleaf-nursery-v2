const express = require("express");
const { body, validationResult } = require("express-validator");
const { asyncHandler } = require("../middleware/errorHandler");
const { NewsletterSubscriber } = require("../models");

const router = express.Router();

router.post(
  "/",
  [
    body("email").trim().isEmail().withMessage("Please provide a valid email address").normalizeEmail().isLength({ max: 100 }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
        errors: errors.array(),
      });
    }

    const { email } = req.body;
    const [subscriber, created] = await NewsletterSubscriber.findOrCreate({
      where: { email },
      defaults: { email, isActive: true, subscribedAt: new Date() },
    });

    if (!created && !subscriber.isActive) {
      await subscriber.update({ isActive: true, subscribedAt: new Date() });
      return res.json({
        success: true,
        message: "Welcome back! Your subscription has been reactivated.",
      });
    }

    if (!created) {
      return res.json({
        success: true,
        message: "You are already subscribed to our newsletter!",
      });
    }

    res.status(201).json({
      success: true,
      message: "Thank you for subscribing! You will receive our latest updates and offers.",
      data: {
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt,
      },
    });
  })
);

router.delete(
  "/",
  [body("email").trim().isEmail().withMessage("Please provide a valid email address").normalizeEmail()],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
        errors: errors.array(),
      });
    }

    const subscriber = await NewsletterSubscriber.findOne({ where: { email: req.body.email, isActive: true } });
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Email not found in our subscriber list.",
      });
    }

    await subscriber.update({ isActive: false });

    res.json({
      success: true,
      message: "You have been successfully unsubscribed from our newsletter.",
    });
  })
);

router.get(
  "/count",
  asyncHandler(async (req, res) => {
    const count = await NewsletterSubscriber.count({ where: { isActive: true } });
    res.json({
      success: true,
      count,
    });
  })
);

router.get(
  "/list",
  asyncHandler(async (req, res) => {
    const subscribers = await NewsletterSubscriber.findAll({
      where: { isActive: true },
      attributes: ["email", "subscribedAt"],
      order: [["subscribedAt", "DESC"]],
    });

    res.json({
      success: true,
      message: `Found ${subscribers.length} active subscriber(s)`,
      subscribers,
    });
  })
);

module.exports = router;
