const express = require('express');
const router = express.Router();
const database = require('./firebase');

router.get('/save', async function (req, res) {
    try {
        await database.ref('firebase').set({name: "firebase"});
        console.log("데이터 세이브");
        return res.json({firebase: true});
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to save data",
            message: err.message
        });
    }
});

module.exports = router;