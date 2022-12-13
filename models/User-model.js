const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      unique: false,
      required: true
    },
    lastName: {
      type: String,
      unique: false,
      required: true
    },
    phone: {
      type: String,
      unique: false,
      required: true
    },
    email: {
      type: String,
      unique: false,
      required: true
    },
    password: {
      type: String,
      unique: false,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    isVerified: {
      type: Boolean,
      unique: false,
      default: false
    },
    role: {
      type: String,
      unique: false,
      required: true
    }
  },
  {
    versionKey: false,
    collection: "UsersCollection"
  }
);

UserSchema.pre("save", function(next) {
  const user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null).then((hash,err)=>{
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(passw, cb) {
  bcrypt.compare(passw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err, false);
    }
    cb(null, isMatch);
  });
};
module.exports = mongoose.model("User-model", UserSchema);
