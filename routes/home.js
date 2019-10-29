const express = require('express');
const router = express.Router();
router.get('/', (req, res)=> {
    res.json( {title: 'My express app', message: 'Hello'});

})

module.exports = router;