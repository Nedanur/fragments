// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
 module.exports = (req, res) => {
    // TODO: this is just a placeholder to get something working...
    //I changed this code for 'curl -i localhost:8080/v1/fragments'
    res.status(401).json({
      status: 'Unauthorized',
      fragments: [],
    });
  };