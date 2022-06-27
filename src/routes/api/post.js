const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
require('dotenv').config();

module.exports = async (req, res) => {
 const api = process.env.API_URL;

  const data = req.body;
  const user = req.user;
  logger.debug('Post: ' + req.body);
  logger.debug(user, 'POST request: user');
  logger.debug(data, 'POST request: fragment buffer');

  try {
    const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
    await fragment.save();
    await fragment.setData(req.body);

    logger.debug({ fragment }, 'New fragment created');
    
    res.setHeader('Content-type', fragment.type);
    //    res.set('Location', `${process.env.API_URL}/v1/fragments/${fragment.id}`);
    res.setHeader('Location', api + '/v1/fragments/' + fragment.id);
    res.status(200).json(
      createSuccessResponse({
        status: 'ok',
        fragment: fragment,
      })
    );

  } catch (err) {
    logger.warn(err, 'Error posting fragment');
    res.status(500).json(createErrorResponse(500, err));
  }
};