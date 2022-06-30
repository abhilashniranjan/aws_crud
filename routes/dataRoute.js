var express = require('express')
var router = express.Router()
const dataC = require('../controller/dataController');


//addtone

router.post('/data1',dataC.createData1)
router.post('/data2',dataC.createData2)
router.post('/data',dataC.createData)
// aa
module.exports = router