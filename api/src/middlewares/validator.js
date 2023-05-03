module.exports.validator = (schema) => function (req, res, next) {
  try {
    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    req.bodyValidate = result.value;
    return next();
  } catch (e) {
    logger.error(e);
    res.status(500).json({
      message: 'Service Unavailable',
    });
  }
};
