import mongoose, {Schema} from 'mongoose'

const tensionSchema = new Schema({
        bigTension: Number,
        smallTension: Number,
        selectedDate: Date,
        pulse: Number,
    },
    {timestamps: true}
)

const Tension = mongoose.models.Tension || mongoose.model("Tension", tensionSchema)

export default Tension