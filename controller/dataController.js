var Data1 = require('../models/data1')
var Data2 = require('../models/data2')
var Data = require('../models/data');
const data = require('../models/data');

exports.createData1 = async (req, res) => {
  // console.log("this is calling");
  // console.log(req.body);

  const data = req.body;
  // console.log(product);
  const newData = new Data1(data);

  try {
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    console.log(error);
    res.status(409).json("Some thing went wrong in creating new Products");
  }
};



exports.createData2 = async (req, res) => {
    // console.log("this is calling");
    // console.log(req.body);
  
    const data = req.body;
    // console.log(product);
    const newData = new Data2(data);
  
    try {
      await newData.save();
      res.status(201).json(newData);
    } catch (error) {
      console.log(error);
      res.status(409).json("Some thing went wrong in creating new Products");
    }
  };



  exports.createData = async (req, res) => {
 
    Data1.findOne({a:req.body.a}, async (error, data1) => {
        if(error){
            res.status(409).json("error to find data1")     
           }
            else{
        Data2.findOne({f:req.body.f}, async (error, data2) => {
            if(error){
                res.status(409).json("error to find data2") 
            }else{
                
         
   const allData = {
    a:data1.a,
    b:data1.b,
    c:data1.c,
    d:data1.d,
    f:data2.f,
    g:data2.g,
    h:data2.h,
    i:data2.i
   }

    const newData = new Data(allData);
  
    try {
      await newData.save();
      await data1.deleteOne({ a:data1.a }, (err) => {
        if (err) {
            console.log("something went wrong!!")
            res.json({ errormsg: "something went wrong!!" });
        }
    })
    await data2.deleteOne({ f:data2.f }, (err) => {
        if (err) {
            console.log("something went wrong!!")
            res.json({ errormsg: "something went wrong!!" });
        }
    })


    res.status(201).json(newData);
    } catch (error) {
      console.log(error);
      res.status(409).json("Some thing went wrong in creating new Products");
    }
}      }
)}})
}