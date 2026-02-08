import mongoose, {Document, Model, Schema} from 'mongoose';

export interface ITension extends Document {
    userId: mongoose.Types.ObjectId
    systolic: number,    // büyük tansiyon
    diastolic: number,   // küçük tansiyon
    pulse: number,       // nabiz
    measuredAt: Date,
    date: String,
    time?: string,
    notes?: string,      // isteğe bağlı not
}

const TensionSchema = new Schema<ITension>({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        systolic: {
            type: Number,
            required: [true, "Büyük tansiyon (sistolik) girilmelidir."],
            min: 20,
            max: 300,
        },
        diastolic: {
            type: Number,
            required: [true, "Küçük tansiyon (diyalostik) girilmelidir."],
            min: 20,
            max: 300
        },
        pulse: {
            type: Number,
            required: [true, "Nabız değerleri girilmelidir."],
        },
        notes: {
            type: String,
            trim: true,
            maxLength: 500,
        },
        measuredAt: {
            type: Date,
            default: Date.now,
        },
        date: {
            type: String,
            required: [true, "Tarih Zorunludur"],
        },
        time: {
            type: String,
        }
    },
    {timestamps: true}
)

const Tension: Model<ITension> = mongoose.models.Tension || mongoose.model<ITension>("Tension", TensionSchema);

export default Tension;