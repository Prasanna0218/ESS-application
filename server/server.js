let express=require('express');
let cors=require('cors');
let jwt=require('jsonwebtoken')
const { authcontroller } = require('./controllers/authcontroller.js');
require('dotenv').config();
let cookieparser=require('cookie-parser');
const pool = require('./config/db');

//middlewares:-
let app=express();
app.use(cors({
    origin:"http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials:true
}));
app.use(express.json());
app.use(cookieparser());


//routes:-
app.post("/ess/login",authcontroller);

//VerifyToken middleware:-
let verifytoken=(req,res,next)=>{
    let jwtpresent=req.cookies.token;
    if(!jwtpresent)
    {
        return res.status(401).json({valid:false,message:"Token not found!"})
    }
    else{
        jwt.verify(jwtpresent,process.env.secret_key,(err,decoded)=>{
            if(err)
            {
                return res.status(401).json({valid:false,message:"Token Verification failed!"})
            }
            else{
                req.user=decoded.email;
                next();
            }
        })
    }
}

//validation request for protected Route:-
app.get("/validate",verifytoken,(req,res)=>{
    let useremail=req.user;
    let sqlquery2="SELECT * FROM MASTER WHERE MAIL =?";
    pool.query(sqlquery2,[useremail],(err,result)=>{
        if(err)
        {
            return res.status(400).json({valid:false,message:"User Credentials Wrong!"})
        }
        if(result.length==0)
        {
            return res.status(500).json({valid:false,message:"User is not Found!"})
        }
        let user=result[0];
        res.status(200).json({valid:true,message:"Verification successful",role:`${user.role}`})
    })
})

//leaverequest:-
app.post("/ess/leaverequest",verifytoken,(req,res)=>{
    let useremail=req.user;
    let sqlquery3="SELECT * FROM MASTER WHERE MAIL =?";
    pool.query(sqlquery3,[useremail],(err,result)=>{
        if(err)
        {
            return res.status(400).json({valid:false,message:"Json not found!"})
        }
        if(result.length==0)
        {
            return res.status(500).json({valid:false,message:"User is not identified!"});
        }
        let user=result[0];
        console.log(user);
        
        let {leaveType,startDate,endDate,reason,isOffDay}=req.body;
        let sqlquery4="INSERT INTO LEAVEREQUEST(emp_id,leave_type,from_date,to_date,reason_for_leave,is_halfday,emp_name) values(?,?,?,?,?,?,?)"
        pool.query(sqlquery4,[user.emp_id,leaveType,startDate,endDate,reason,isOffDay,user.emp_name],(err,result)=>{
            if(err)
            {
                return res.status(500).json({valid:false,message:"Datas not stored in your table!"})
            }
            res.status(200).json({valid:true,message:"Request added successfully!"});
        });
        console.log({leavetypr:leaveType,startDate:startDate,endDate:endDate,reason:reason,isOffDay:isOffDay});
        });
})

//leaverequestget:-
// app.get("/ess/leaverequest",verifytoken,(req,res)=>{
//     let usermail=req.user;
//     console.log(usermail);
//     let sqlqueryremaingleaves1="SELECT * FROM master WHERE mail =?";
//     pool.query(sqlqueryremaingleaves1,[usermail],(err,result)=>{
//         if(err)
//         {
//             return res.status(400).json({valid:false,message:"No user Exists"});
//         }
//         if(result.length===0)
//         {
//             return res.status(500).json({valid:false,message:"No datas are retrieved from DB!"});
//         }
//         let results=result[0];
//         let sqlqueryremaingleaves2="SELECT * FROM leaverequest WHERE emp_id =?";
//         pool.query(sqlqueryremaingleaves2,[results.emp_id],(err,result)=>{
//             if(err)
//             {
//                 return res.status(400).json({valid:false,message:"No Emp_id is found here !"});
//             }
//             if(results.length===0)
//             {
//                 res.status(200).json({valid:true,message:'No datas',data:[]});
//             }
//             let resultdatas=result;
//             for(let results of resultdatas)
//             {
//                 if(result.leave_type=="casual")
//                 {
//                     if(result.ishalfday)
//                         {
//                             let sqlqueryremaingleaves3="UPDATE master SET casual_leave 
//                         }
//                         else if(!result.ishalfday)
//                         {
        
//                         }
//                 }
//             }
//         })
//     })
// })

//leaveapproval:-
app.get("/ess/leaveapproval",verifytoken,(req,res)=>{
    let useremail=req.user;
    let sqlquery9="SELECT * FROM master WHERE mail = ?";
    pool.query(sqlquery9,[useremail],(err,result)=>{
        if(err)
        {
            return res.status(400).json({valid:false,message:"No valid credentials!"});
        }
        if(result.length==0)
        {
            return res.status(500).json({valid:false,message:"No datas are retrieved from DB!"});
        }
        let user=result[0];
        // console.log(user.report_to);
        let sqlquer="SELECT * FROM leaverequest WHERE emp_id IN (SELECT emp_id FROM master WHERE report_to = ?)";
        pool.query(sqlquer,[user.emp_id],(err,result)=>{
            if(err)
            {
                return res.status(400).json({valid:false});
            }
            if(result.length==0)
            {
                return res.status(200).json({valid:true});
            }
            let values=result;
            let finalvalues=[];
            for(let value of values)
            {
                if(value.status=="Pending")
                {
                    finalvalues.push(value);
                }
            }
            // console.log(finalvalues);
            res.status(200).json({valid:true,data:finalvalues,message:"Datas are trieved from DB!"});
        })
    })
});


//leaveapproval post method for rejection and approve:-
app.post("/ess/leaveapproval",(req,res)=>{
    let {status,leave_id,reason_for_reject}=req.body;
    console.log(status);
    let sqlquery6=`
        UPDATE LEAVEREQUEST
        SET status = ?, reason_for_reject = ?
        WHERE leave_id = ?
    `;
    pool.query(sqlquery6,[status,reason_for_reject,leave_id],(err,result)=>{
        if(err){
            return res.status(400).json({valid:false,message:"Something went wrong!"});
        }
        if(result.affectedRows==0)
        {
            return res.status(500).json({valid:false,message:"Not retrieved from the database!"});
        }
        // let sqlquery7 = "SELECT * FROM LEAVEREQUEST WHERE leave_id = ?";
        let resultdata=result;
        // resultdata.status=status;
        // resultdata.reason_for_reject=reason_for_reject;
        res.status(200).json({valid:true,thisrequest:resultdata});
        console.log(resultdata);
    })
});

//Leavesapprove&Rejected for Developers:-
app.get("/ess/leavesapproved",(req,res)=>{
    let sqlquery8="SELECT * FROM LEAVEREQUEST";
    pool.query(sqlquery8,(err,result)=>{
        if(err)
        {
            return res.status(400).json({valid:false,message:"No data exists!"})
        }
        if(result.length===0)
        {
            return res.status(500).json({valid:false,message:"No Data is retrieved From Database!"});
        }
        let resultdatas=result;
        res.status(200).json({valid:true,message:"Datas are Retrieved!",datas:resultdatas})
    })
})


//logout:-
app.get("/ess/logout",(req,res)=>{
    let jwt=req.cookies.token;
    res.clearCookie("token",{
        httpOnly:true,
        secure:true,
        sameSite:'strict'
    })
    res.json({message:"Logged out Successfully!"});
})

//port:- 
let PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is Created on the Port ${PORT}`);
});



//days 
// /*
function calculateDaysBetweenDates(fromDate, toDate) {
  // Convert string dates to Date objects
  const from = new Date(fromDate.split('-').reverse().join('-')); // "26-11-2024" -> "2024-11-26"
  const to = new Date(toDate.split('-').reverse().join('-')); // "30-11-2024" -> "2024-11-30"

  // Calculate the time difference in milliseconds
  const timeDiff = to - from;

  // Convert milliseconds to days
  const daysDiff = timeDiff / (1000 * 3600 * 24);

  return daysDiff;
}

// Example usage
const fromDate = "26-11-2024";
const toDate = "30-11-2024";

const leaveDays = calculateDaysBetweenDates(fromDate, toDate);
console.log(`Number of days: ${leaveDays}`);
