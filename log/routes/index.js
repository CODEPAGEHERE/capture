const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const onboardingRouter = require('./onboarding');

router.use('/auth', authRouter);
router.use('/onboarding', onboardingRouter);

module.exports = router;
