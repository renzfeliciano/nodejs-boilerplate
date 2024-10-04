import mongoose from "mongoose"
import argon2 from "argon2"
class User {
    constructor(name, email, password) {
        this.name = name
        this.email = email
        this.password = password
        this.createdAt = new Date()
        this.updatedAt = new Date()
    }

    // Password hashing method (Argon2)
    async hashPassword() {
        this.password = await argon2.hash(this.password, {
            type: argon2.argon2id, // Choose the Argon2id variant
            timeCost: 2,            // Number of iterations (adjust based on your needs)
            memoryCost: 2 ** 16,    // Memory cost (64 MB)
            parallelism: 1,         // Number of threads
        })
    }

    // Password verification method (Argon2)
    async verifyPassword(passwordPayload) {
        return await argon2.verify(this.password, passwordPayload)
    }

    // Customize the toJSON method
    toJSON() {
        const obj = { ...this }
        delete obj.password
        delete obj.createdAt
        delete obj.updatedAt
        delete obj.__v
        return obj
    }
}

// Defining the User Schema
const UserSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            required: true,
            trim: true
        },
        middle: {
            type: String,
            trim: true,
            default: ''
        },
        last: {
            type: String,
            required: true,
            trim: true
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

// Password hashing middleware (Argon2)
UserSchema.pre('save', async function (next) {
    const user = new User(this.name, this.email, this.password)
    if (!this.isModified('password')) {
        return next()
    }

    await user.hashPassword()
    this.password = user.password
    next()
})

// Customize the toJSON and toObject methods
UserSchema.methods.toJSON = function () {
    return new User(this.name, this.email, this.password).toJSON()
}

UserSchema.methods.verifyPassword = async function (passwordPayload) {
    const user = new User(this.name, this.email, this.password)
    return await user.verifyPassword(passwordPayload)
}

export default mongoose.model('User', UserSchema)