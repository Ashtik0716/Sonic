import mongoose from 'mongoose'

const playlistSchema = new mongoose.Schema(
  {
    // Which user owns this playlist
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // we always search by owner, so index it
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    // Jamendo track ids, in the order they were added
    tracks: [{ type: String }],
  },
  { timestamps: true }
)

export default mongoose.model('Playlist', playlistSchema)