const Router = require('express');
const router = new Router();

const { getusers } = require('./getUsers');

router.post('/get', (req, res) => {
  getusers(req, res);
});


module.exports = router;