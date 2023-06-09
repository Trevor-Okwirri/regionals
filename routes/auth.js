const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config();

const sendMail = async (to, subject, message) =>{
  // send verification email
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: 'anon.justice@outlook.com',
        pass: 'anonymous2023'
    },
});

  const mailOptions = {
    from: 'anon.justice@outlook.com',
    to: to,
    subject: subject,
    text: message
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending verification email');
    } else {
      console.log('Verification email sent: ' + info.response);
      res.send('Verification email sent');
    }
  });
}
// sendMail("trevorokwirri@gmail.com", `Welcome Message","Welcome to Anonymous Justice` )

//REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password , profilePic} = req.body;

  if (!username || !email || !password || !profilePic) {
    return res.status(400).json({ message: 'username, email, profilePic, and password are required' });
  }

  if (password.trim() === '') {
    return res.status(400).json({ message: 'Password must not be empty' });
  }
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.SHA512(
      req.body.password,
    ).toString(),
    profilePic: req.body.profilePic
  });
  try {
    console.log('Hi')
    const savedUser = await newUser.save();
    const verificationToken = jwt.sign(
      { newUser},
      "justice@2023",
      {
        expiresIn: "3h",
      }
    );
    sendMail(req.body.email, "Welcome Message",`Your email verification link is https://regionals.vercel.app/auth/verify/${verificationToken}`)
    console.log('Hi')
    const user = {...savedUser._doc, message: "Verification email sent"}
    res.status(201).json(user);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//LOGIN

router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne(
            {
                email: req.body.email
            }
        );
        // console.log(CryptoJS.SHA512(req.body.password).toString())
        // !user && res.status(401).json("Wrong User Name");
        if(user.password === CryptoJS.SHA512(req.body.password).toString()){
          const accessToken = jwt.sign(
            {
              id: user._id,
              isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC 
             ,
            );
            // console.log("HI")
        const { password, ...others } = user._doc;  
        res.status(200).json({...others, accessToken});
        console.log("HI")
        } else {
          res.status(401).json("Wrong Password");
        }
    }catch(err){
      console.log(err)
        res.status(500).json(err);
    }

});
router.post("/verification", async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email})
    console.log(user);
    const verificationToken = jwt.sign(
      { user },
      "justice@2023",
      {
        expiresIn: "3h",
      }
    );
    if(user.isVerified){
      return res.send("User already verified")
    }
    sendMail(user.email, "Welcome Message",`Your email verification link is https://regionals.vercel.app/auth/verify/${verificationToken}
    It expires in 3 hours`)      
    res.send("Verification email sent successfully");
  } catch (err) {
    console.log(err)
    res.status(500).json("Error: " + err);
  }
});
router.get("/verify/:token", async (req, res) => {
  try {
     jwt.verify(req.params.token, "justice@2023", (err, user) => {
      if (err) {res.status(403).json("Token is not valid!")}
      else {
        console.log(user)
        // res.send(user);
        if(user.user.isVerified == false){
          const somefunc = async () => {
          await User.findByIdAndUpdate(user.user._id, {...user, isVerified: true})
          user = await User.findById(user.user._id)
          res.send("User verification succesfull")
          }
          somefunc()
        }
      };
    });
    // console.log(user._id.toString())
    // const verificationToken = jwt.sign(
    //   { user},
    //   "justice@2023",
    //   {
    //     expiresIn: "2h",
    //   }
    // );
    // sendMail("trevorokwirri@gmail.com", "Welcome Message",`Your email verification link is http://127.0.0.1:3000/${verificationToken}
    // It expires in 3 hours`)      
    // res.send("Verification email sent successfully");
  } catch (err) {
    console.log(err)
    res.status(500).json("Error: " + err);
  }
});
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    return res.status(201).send(user)
  } catch (err){
    res.status(404).json({"Error": err})
  }
})
module.exports = router;
