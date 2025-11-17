require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const cors = require('cors');
const helmet = require('helmet');

const keys = require('./config/keys');
const routes = require('./routes');
const socket = require('./socket');
const setupDB = require('./utils/db');

const { port } = keys;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);

// Frontend Connection
const allowedOrigins = ['http://localhost:5000', 'http://localhost:8000', 'https://bastard-delta.vercel.app','https://bastard.fun',
  'https://www.bastard.fun'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));



setupDB();

const bcrypt = require("bcryptjs");
const User = require("./models/user"); // adjust path if needed
const { ROLES } = require("./constants"); // adjust path if needed

(async () => {
  try {
    const email = process.env.ADMIN_EMAIL;   // 👈 using the env var
    const password = process.env.ADMIN_PASSWORD;

    const existing = await User.findOne({ email });
    if (!existing) {
      const hash = await bcrypt.hash(password, 10);
      const admin = new User({
        email,
        password: hash,
        firstName: "Admin",
        lastName: "User",
        role: ROLES.Admin, 
      });
      await admin.save();
      console.log("✅ Admin user created:", email, "/", password);
    } else {
      console.log("⚠️ Admin already exists:", email);
    }
  } catch (err) {
    console.error("Error creating admin:", err);
  }
})();


require('./config/passport')(app);
app.use(routes);

const server = app.listen(port, () => {
  console.log(
    `${chalk.green('✓')} ${chalk.blue(
      `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
    )}`
  );
});

socket(server);
