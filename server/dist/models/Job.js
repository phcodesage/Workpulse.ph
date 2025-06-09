"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const JobSchema = new mongoose_1.Schema({
    employerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a job description'],
    },
    category: {
        type: String,
        required: [true, 'Please add a job category'],
    },
    skills: {
        type: [String],
        required: [true, 'Please add required skills'],
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'intermediate', 'expert'],
        required: [true, 'Please specify experience level'],
    },
    paymentType: {
        type: String,
        enum: ['hourly', 'fixed'],
        required: [true, 'Please specify payment type'],
    },
    budget: {
        type: Number,
        required: [true, 'Please add a budget'],
    },
    location: {
        type: String,
        required: [true, 'Please add a location'],
    },
    remote: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Virtual for applications
JobSchema.virtual('applications', {
    ref: 'JobApplication',
    localField: '_id',
    foreignField: 'jobId',
    justOne: false
});
exports.default = mongoose_1.default.model('Job', JobSchema);
