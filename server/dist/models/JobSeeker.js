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
const EducationSchema = new mongoose_1.Schema({
    institution: {
        type: String,
        required: [true, 'Please add an institution name'],
    },
    degree: {
        type: String,
        required: [true, 'Please add a degree'],
    },
    fieldOfStudy: {
        type: String,
        required: [true, 'Please add a field of study'],
    },
    from: {
        type: Date,
        required: [true, 'Please add a start date'],
    },
    to: {
        type: Date,
    },
    current: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
    },
});
const WorkHistorySchema = new mongoose_1.Schema({
    company: {
        type: String,
        required: [true, 'Please add a company name'],
    },
    position: {
        type: String,
        required: [true, 'Please add a position'],
    },
    from: {
        type: Date,
        required: [true, 'Please add a start date'],
    },
    to: {
        type: Date,
    },
    current: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
});
const JobSeekerSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please add a professional title'],
    },
    skills: {
        type: [String],
        required: [true, 'Please add at least one skill'],
    },
    experience: {
        type: Number,
        required: [true, 'Please add years of experience'],
    },
    education: [EducationSchema],
    workHistory: [WorkHistorySchema],
    hourlyRate: {
        type: Number,
    },
    availability: {
        type: String,
        enum: ['full-time', 'part-time', 'contract'],
        required: [true, 'Please specify availability'],
    },
    location: {
        type: String,
        required: [true, 'Please add a location'],
    },
    photo: {
        type: String,
    },
    bio: {
        type: String,
        required: [true, 'Please add a bio'],
    },
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('JobSeeker', JobSeekerSchema);
