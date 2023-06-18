const express = require('express');
const mongoose = require('mongoose')
const app = express();
const env = require('dotenv');
env.config();

//If you want to recive JSON Payload, use the express.json() middleware


app.use(express.json());

//Lets create some route
mongoose.connect('mongodb+srv://oklabs:letmein123321@oklabsmongodbserver.dgmru.mongodb.net/?retryWrites=true&w=majority')
.then(d=>{
    console.log('connected');
})
.catch(e=>{
    console.log('not connected');
});

let studentSchema = new mongoose.Schema({
    StudentId:Number,
    Name:String,
    Roll:Number,
    Birthday:Date,
    Address:String
},{
    timestamp:true
});

const Student = mongoose.model('Student',studentSchema);



app.get('/test',(req,res)=>{
    res.status(200).send('Hello JOIN OKLABS');
});

app.get('/api/student/create',(req,res)=>{
    console.log(req.query.Name)

    if(req.query.Name !== undefined){
        let studentObject = new Student({
            StudentId:req.query.StudentId,
            Name:req.query.Name,
            Roll:req.query.Roll,
            Birthday:req.query.Birthday,
            Address:req.query.Address
        });
        studentObject.save()
        .then(d=>{
            console.log('Saved');
            res.status(201).json({
                msg:"Student Created"
            });
        })
        .catch(e=>{
            res.status(400).json({
                msg:"error",
                error:e
            });
        });
    }else{
        res.status(400).json({
            msg:"Query Parameters are required"
        });
    }
});


app.get('/api/getAllStudents',(req,res)=>{

    //db.collection.find()
    //Model.find();

    //db.collection = Model
    Student.find()
    .then(d=>{
        res.status(200).json({
            mgs:"ok",
            data:d
        });
    })
    .catch(e=>{
        res.status(400).json({
            mgs:"err"+e
        });
    });

    
});

app.delete('/api/student/:studentId',(req,res)=>{
    console.log(req.params.studentId);
    if(req.params.studentId !== undefined){

        //  db.collection.deleteOne();
        //
        // Model.deleteOne()
        Student.findByIdAndDelete({
            _id:req.params.studentId
        })
        .then(d=>{
            res.status(200).json({
                msg:"delete called",
                data:d
            });
        })
        .catch(e=>{
            res.status(400).json({
                error:e
            });
        });
        
    }else{
        res.status(400).json({
            msg:"studentId is required"
        });
    }
    
})


app.put('/api/student/update',function(req,res){

    console.log('before remove id',req.body);
    const id = req.body._id;
    delete req.body._id; //remove the key
    console.log('after remove id ',req.body); //req.body = {k:v:k:v}

    //Model.findByIdAndUpdate(id, update, callback) // executes
    Student.findByIdAndUpdate(id,req.body,(err,data)=>{
        console.log(err,data);
        if(err === null){
            res.status(200).json({
                msg:"Updated Successfully"
            });
        }else{
            res.status(400).json({
                error:err
            });
        }
       
    })
   
});

let port = process.env.PORT || 8000;

app.listen(port,()=>{
    console.log('listening on port',port)
});