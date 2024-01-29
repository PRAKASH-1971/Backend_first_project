const express = require('express');
const { connection } = require("./configs/db")
const { UserModel } = require("./models/User.model")
const { noteRouter } = require("./routes/Note.route")
const jwt = require("jsonwebtoken")
// const bcrypt = require('bcrypt');
const {authenticate} = require("./middlewares/authenticate.middleware")
require("dotenv").config()
const cors = require("cors")

const app = express()
app.use(cors({
    origin:"*"
}))
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Welcome")
})

app.use("/notes",noteRouter);
app.use(authenticate)


app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("connected to database")
    }
    catch {
        console.log("dis to database")
        console.log(err)
    }
    console.log("port 8080")
})


app.post("/register",async(req, res) => {
    // const { email, pass, name, age } = req.body
    const payload=req.body
    try {
        // bcrypt.hash(pass, 5, async (err, secure_password) => {
            // if (err) {
            //     console.log(err)
            // } else {
                // const user = new UserModel({ email, pass: secure_password, name, age })
                const user = new UserModel(payload)
                await user.save()
                console.log(user)
                res.send("Registered")
                // res.send(user)
            // }
        // });
    } catch (err) {
        res.send("Error in reg the user")
        console.log(err)
    }
})

app.post("/login", async (req, res) => {
    const { email, pass } = req.body
    try {
        const user = await UserModel.find({email,pass})
        if (user.length>0){
            // bcrypt.compare(pass, user[0].pass, (err, result) => {
                // if (result) {
                    const token = jwt.sign({ course: 'backend' }, 'masai');
                    res.send({ 'msg': 'Login succes', "Token":token})
                // } 
                // else {
                    // res.send("Login Failed")
                // }
            // });
        }
         else {
            res.send("Login Failed")
        }
    } catch (err) {
        res.send("something wrong")
        console.log(err)
    }
});


app.get("/about", (req, res) => {
    res.send("About page")
})

app.get("/data", (req, res) => {
    const token = req.headers.authorization
    console.log(token)
    jwt.verify(token,'masai', (err,decoded) => {
        if (err) {
            res.send("Invalid token")
        } else {
            res.send("Data..")
            // res.send(us)
        }
    });
})

app.get("/cart", (req, res) => {
    const token = req.query.token;
    jwt.verify(token,'masai', (err,decoded) => {
        if (err) {
            res.send("Invalid token")
        } else {
            res.send("Cart page..")
        }
    });
})

app.get("/contact", (req, res) => {
    res.send("Contacts page")
})

