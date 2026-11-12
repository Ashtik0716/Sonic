import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // removes spaces around the value
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // no two users can share an email
      lowercase: true, // "A@B.com" is stored as "a@b.com"
      trim: true,
    },
    // A bcrypt hash, never the real password
    passwordHash: {
      type: String,
      required: true,
      select: false, // hidden from queries unless we ask for it
    },
    // Track ids (Jamendo ids are strings) the user has liked
        likedTracks: [{ type: String }],
    // Most recent first, capped at 30
    recentTracks: [{ type: String }],
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
)

const User = mongoose.model('User', userSchema)

export default User