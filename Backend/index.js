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
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: process.env.DATAPASS,
  database: process.env.DATABASE,

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
  let shop=req.body.shop
  let code=req.body.pincode
  let lattitude=req.body.lattitude
  let longitude=req.body.longitude

  console.log(lattitude)
  console.log(longitude)

  // Insert data into users table
  const insert_query = "INSERT INTO users(name, mobile, referenceid, upiid, city, region, image,shopname,pincode,lattitude,longitude) VALUES($1, $2, $3, $4, $5, $6, $7,$8,$9,$10,$11) RETURNING id";
  
  con.query(insert_query, [name, mobile, referenceid, upiid, city, region, image,shop,code,lattitude,longitude], (err, result) => {
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
  const fetchQuery = "SELECT * from users where status = 'Pending' ";
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

app.get("/pay", (req, res) => {
  const payment = "SELECT * FROM USERS WHERE STATUS = 'Approved'";
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
  const number = "SELECT COUNT(*)  FROM users";

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
  const dash = "select * from users"
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
  const fetchQuery = "SELECT * FROM users where status !='Pending'"
  con.query(fetchQuery, (err, result) => {
    if (err) {
      res.send("Error in Sending data")
    }
    res.send(result.rows)
  })
})

//Pending Api

app.get("/pending", (req, res) => {
  const pendingreq = "SELECT count(*) FROM users WHERE status = 'Pending'"
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
    UPDATE "users"
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

// Decline Api
app.put("/decline", (req, res) => {
  const id = req.body.id;
  console.log(id)

  const query = `
  UPDATE "users"
  SET status ='Declined'
  WHERE id=$1`;

  const decline_query = ` UPDATE "tracking" SET status='Declined' WHERE users_id=$1`

  con.query(query, [id], (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: "Update failed" });
    }
  });

  con.query(decline_query,[id],(err,result)=>{
    if(err)
    {
      console.log("Error in Sending")
    }
    console.log("Set to Declined")
  })
})

//Approved Request

app.get("/approved", (req, res) => {
  const approve = "SELECT count(*)from users WHERE status !='Pending'"

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
    const query = `select * from users`;
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

app.get("/tracking", (req, res) => {
  let  refid  = req.query.referenceid;
  const select_query = `SELECT * FROM tracking WHERE referenceid = $1`;

  con.query(select_query, [refid], (err, result) => {
    if (err) return res.status(500).send("Error");

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
      console.log(result.rows[0].status)
    } else {
      res.status(404).send("No record found");
    }
  });
});


// Time Validation for Users

app.get("/date",(req,res)=>{
  let newvalue = req.query.number
  console.log(newvalue)

  const data_vali = `SELECT registered_at from users where mobile =$1`

  con.query(data_vali,[newvalue],(err,result)=>{
    if(err)
    {
      return res.send("Error Occured")
    }
    else
    {
      res.send(result.rows[0])
    }
  })
})


//autofill details in userpage

app.get("/user_fill",(req,res)=>{
  let mobile = req.query.mobilenumber
  const auto_querry= `SELECT * FROM users where mobile=$1`

  con.query(auto_querry,[mobile],(err,result)=>{
    if (err)
    {
      return res.send("Error Occured")

    }
    else
    {
      res.send(result.rows[0])
    }
      
  })
},[])



//Razor Pay Details
// Razorpay instance
const razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
});

// For RazorpayX auth
const razorpayAuth = {
  auth: {
    username: process.env.RAZORPAY_KEY_ID,
    password: process.env.RAZORPAY_KEY_SECRET,
  }
};

// 1. Create Order
app.post("/create_order", async (req, res) => {
  try {
    const amount = req.body.amount; // Amount in INR
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 1,
    });
    res.status(200).json({ id: order.id });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// 2. Verify Payment Signature
app.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.paymentData;
    const hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      res.status(200).send("Payment Verified");
    } else {
      res.status(400).send("Payment Verification Failed");
    }
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).send("Error verifying payment");
  }
});

// 3. Validate UPI ID
app.post('/validate-vpa', async (req, res) => {
  const { vpa } = req.body;

  try {
    const response = await axios.post(
      'https://api.razorpay.com/v1/payments/validate/vpa',
      { vpa },
      razorpayAuth
    );

    if (!response.data.success) {
      return res.status(400).json({ error: 'Invalid UPI ID' });
    }

    res.json({ success: true, vpa_validated: true });
  } catch (err) {
    console.error("VPA Validation Error:", err.response?.data || err);
    res.status(500).json({ error: 'Failed to validate VPA' });
  }
});

// 4. Add Customer Contact
app.post('/add-customer', async (req, res) => {
  const { name, email, contact } = req.body;

  try {
    const response = await axios.post(
      'https://api.razorpay.com/v1/contacts',
      { name, email, contact, type: 'customer' },
      razorpayAuth
    );
    res.json({ contact_id: response.data.id });
  } catch (err) {
    console.error("Contact Creation Error:", err.response?.data || err);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// 5. Add Fund Account
app.post('/add-fund-account', async (req, res) => {
  const { contact_id, vpa } = req.body;

  try {
    const response = await axios.post(
      'https://api.razorpay.com/v1/fund_accounts',
      {
        contact_id,
        account_type: 'vpa',
        vpa: { address: vpa },
      },
      razorpayAuth
    );
    res.json({ fund_account_id: response.data.id });
  } catch (err) {
    console.error("Fund Account Error:", err.response?.data || err);
    res.status(500).json({ error: 'Failed to create fund account' });
  }
});

// 6. Payout to Fund Account
app.post('/payout', async (req, res) => {
  const { fund_account_id, amount, purpose } = req.body;

  try {
    const response = await axios.post(
      'https://api.razorpay.com/v1/payouts',
      {
        account_number: RAZORPAYX_ACCOUNT_NO,
        fund_account_id,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        mode: 'UPI',
        purpose: purpose || 'cashback',
        queue_if_low_balance: true,
      },
      razorpayAuth
    );

    fs.appendFile('payout_logs.json', JSON.stringify(response.data) + ',\n', () => {});
    res.json({ payout_id: response.data.id, status: response.data.status });
  } catch (err) {
    console.error("Payout Error:", err.response?.data || err);
    res.status(500).json({ error: 'Failed to make payout' });
  }
});


app.listen(5000, function () {
  console.log("Server Started....")
})