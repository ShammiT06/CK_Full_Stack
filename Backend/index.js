const express = require("express")
const { Client } = require("pg")
const cors = require("cors")
const app = express()
const twilio = require('twilio')
app.use(express.json())
app.use(cors())
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const Razorpay=require('razorpay')
const crypto=require('crypto')
require('dotenv').config()
const nodemailer = require("nodemailer")



const accoundSid = process.env.ACCOUNTSID
const authToken = process.env.AUTHTOKEN
const client = new twilio(accoundSid, authToken)

const twilioNumber = "+19704142856"

let link = "https://spinz-full-stack.vercel.app/tracking"

const con = new Client({
  host: "13.126.249.32",
  user: "dbadmin",
  port: 5432,
  password: process.env.DATAPASS,
  database: process.env.DATABASE,
  // connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false } // required for Railway

})

con.connect().then(() => {
  console.log("Connected to Database")
}).catch(() => {
  console.log("Not connected to Database")
})

//Data Upload to Table

app.post("/user", (req, res) => {
  let name = req.body.user;
  let mobile = req.body.mobile;
  let upiid = req.body.upiId;
  let image = req.body.image;
  let referenceid = req.body.spin;
  let city = req.body.city;
  let region = req.body.region;

  // Insert data into users table
  const insert_query = "INSERT INTO vendors(name, mobile, referenceid, upiid, city, region, image) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id";
  
  con.query(insert_query, [name, mobile, referenceid, upiid, city, region, image], (err, result) => {
    if (err) {
      console.log("Error:", err);
      return res.status(500).send("Error in Sending Data to Users Table");
    } else {
      console.log("Data sent to Users Table Successfully");

      // Retrieve the user id from the result of the users insert query
      const users_id = result.rows[0].id;

      // Insert data into tracking table after users table query
      const tracking_query = "INSERT INTO tracking(referenceid, users_id) VALUES($1, $2)";
      
      con.query(tracking_query, [referenceid, users_id], (error, done) => {
        if (error) {
          console.log("Error in Updating Tracking:", error);
          return res.status(500).send("Error in Sending Data to Tracking Table");
        } else {
          console.log("Tracking Data Inserted Successfully");
          // Respond only after both queries are successful
          return res.status(200).send("User and Tracking Data Sent to Database Successfully");
        }
      });
    }
  });
});

//Pending data 

app.get("/fetchData", (req, res) => {
  const fetchQuery = "SELECT * from vendors where status = 'Pending' ";
  con.query(fetchQuery, (err, result) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Failed to fetch data" });
    } else {
      res.json(result.rows); 
    }
  });
});

//pay appove

app.get("/payment", (req, res) => {
  const payment = "SELECT * from vendors where status = 'Approved'";
  con.query(payment, (err, result) => {
    if (err) {
      console.log("Error in Fecting Data")
      res.send("There is an Error")
    }
    else {
      res.send(result.rows)
    }
  })
})

//Total Number of users

app.get("/total", (req, res) => {
  const number = "SELECT COUNT(*)  FROM vendors";

  con.query(number, (err, result) => {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.json(result.rows[0].count); // ✅ FIXED
    }
  });
});

//Dashboard API

app.get("/bord", (req, res) => {
  const dash = "select * from vendors"
  con.query(dash, (err, result) => {
    if (err) {
      res.send("Error")
    }
    else {
      res.send(result.rows)

    }
  })
})

//Pending Data API

app.get("/fetchapprove", (req, res) => {
  const fetchQuery = "SELECT * FROM vendors where status !='Pending'"
  con.query(fetchQuery, (err, result) => {
    if (err) {
      res.send("Error in Sending data")
    }
    res.send(result.rows)
  })
})

//Pending Api

app.get("/pending", (req, res) => {
  const pendingreq = "SELECT count(*) FROM vendors WHERE status = 'Pending'"
  con.query(pendingreq, (err, snt) => {
    if (err) {
      res.send("Error")
    }
    else {
      res.send(snt.rows[0].count)
      console.log(snt.rows[0].count)
    }
  })
})

//Approve Api
app.put("/approveRequest", (req, res) => {
  const id = req.body.id;
 

  const query = `
    UPDATE "vendors"
    SET status = 'Approved'
    WHERE id = $1
  `;

  const update_track = `UPDATE "tracking" SET status ='Approved', updated_at= CURRENT_TIMESTAMP
  WHERE users_id =$1` 

  con.query(query, [id], (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: "Update failed" });
    }
  });

  con.query(update_track,[id],(err,results)=>{
    if(err)
    {
      console.log("Error in Approving")
    }
    res.json({message:"User and Tracking Table Updated "})
  })
});

app.put("/decline", (req, res) => {
  const id = req.body.id;
  console.log(id)

  const query = `
  UPDATE "vendors"
  SET status ='Declined'
  WHERE id=$1`;

  con.query(query, [id], (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: "Update failed" });
    }

    res.json({ message: "User approved successfully" });
  });
})

//Approved Request

app.get("/approved", (req, res) => {
  const approve = "SELECT count(*)from vendors WHERE status !='Pending'"

  con.query(approve, (err, response) => {
    if (err) {
      res.send("Error")
    }
    else {
      res.send(response.rows[0].count)
    }
  })
})

//confirmation Message

app.post("/con", async (req, res) => {
  const refid = req.body.spin
  const phone = req.body.mobile
  try {
    const message = await client.messages.create({
      body: `Your Request has been Submitted to Spinz.co Admin. This is Your Reference id ${refid}. For any further quereis or status tracking click the link given below ${link} `,
      from: "+19404778897",
      to: `+91${phone}`
    })
    res.send("Confirmation Message Sent Successfully")
  }
  catch (error) {
    console.log("Error")
    res.send("Error in sending message", error)
  }


})

//Export Download API

app.post("/download", async (req, res) => {
  try {
    // Fetching ALL data from users table
    const query = `select * from vendors`;
    const result = await con.query(query);

    const data = result.rows;

    if (data.length === 0) {
      return res.status(404).send("No data found");
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Users");

    const filePath = path.join(__dirname, "all_users.xlsx");
    XLSX.writeFile(workbook, filePath);

    res.download(filePath, "all_users.xlsx", (err) => {
      if (err) {
        console.error("Download Error:", err);
        return res.status(500).send("Download failed");
      }

      fs.unlinkSync(filePath); // Delete file after download
    });
  } catch (err) {
    console.error("Error generating Excel:", err);
    res.status(500).send("Internal Server Error");
  }
});

//OTP API
app.post("/otp", async (req, res) => {
  const phone = req.body.mobile;
  console.log(phone)

  if (!phone) {
    console.log("No phone number received");
    return res.status(400).json({ error: "Phone number is required" });
  }

  console.log("Received Number:", phone);
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: "+19704142856",
      to: `+91${phone}`
    });

    console.log("OTP sent successfully. SID:", message.sid);
    res.status(200).json({ otp: otp, sid: message.sid, message: "OTP sent successfully" });

  } catch (err) {
    console.log("Error sending OTP:", err.message);
    res.status(500).json({ error: "Failed to send OTP", details: err.message });
  }
});

//Mail API

app.post("/mail", function (req, res) {

  let name = req.body.username
  let mobile = req.body.mobile
  let email = req.body.email
  let content = req.body.description
  let data = req.body.media

  const transport = nodemailer.createTransport({
    service: "gmail.com",
    auth: {
      user: "shammikumar.fullstack@gmail.com",
      pass: "vufv cttn vvzh xncd"
    }
  })



  transport.sendMail({
    from: `"${name} ${email}"`,
    to: "shammikumar0601@gmail.com",
    subject: `Issue mail from ${name}`,
    html: `<p>${content} 
    <a href=${data} target="blank">Click Here</a>`
  },
    function (err, info) {
      if (err) {
        console.log("Error", err)
      }
      else {
        console.log("Successfull:", info)
      }
    }

  )
})


app.get("/tracking", function(req, res) {
  const newid = req.query.refid;

  const select_query = `SELECT * FROM tracking WHERE referenceid = $1`;

  con.query(select_query, [newid], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error");
    } else {
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
        console.log(result.rows[0])  // Send as JSON
      } else {
        res.status(404).send("No record found");
      }
    }
  });
});



//Razor Pay Details
const razorpay = new Razorpay({
  key_id:"rzp_live_gN9cIxPm0o55sE",
  key_secret:"CLaH569cQ4Pb9PxHU6jHhPPA"
})


app.post("/create_order",async(req,res)=>{
  try{
    const amount = req.body.amount
    console.log(amount)
    
    const order = await razorpay.orders.create({
      amount:amount*100,
      currency:"INR",
      receipt:"receipt#1",
      payment_capture:1,
    })
    res.status(200).json({
      id:order.id,
    })
  }catch(error)
  {
    console.log("Error")
  }

})


app.post("/verify-payment", async (req, res) => {
  try {
    const { paymentData } = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", "your_key_secret");
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      
      res.status(200).send("Payment Verified");
    } else {
      res.status(400).send("Payment Verification Failed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error verifying payment");
  }
});




app.listen(5000, function () {
  console.log("Server Started....")
})