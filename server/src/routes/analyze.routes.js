const { Router } = require('express');
const analyzeController = require('../controllers/analyze.controller');

const analyzeRouter = Router();

analyzeRouter.post('/analyze', analyzeController.analyzeRepo);

module.exports = analyzeRouter;
