import Company from "../models/Company.js";
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import { application } from "express";

// Register a new company
export const registerCompany = async (req,res) => {

    
    const {name, email, password} = req.body

    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.json({success:false, message: "Missing Details"})
    }

    try {

        const companyExists = await Company.findOne({email})

        if (companyExists) {
            return res.json({success:false, message:'Company already registered'})
            
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        })

        
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}

// Company login
export const loginCompany = async (req,res) => {
    const {email, password} = req.body

    try {

        const company = await Company.findOne({email})

        if (!company) {
            return res.json({ success: false, message: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(password, company.password)

        if (isMatch) {
            return res.json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            })
        }

        res.json({ success: false, message: 'Invalid email or password' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }


}

// Get company data
export const getCompanyData = async (req,res) => {
    

    try {

        const company = req.company

        res.json({success:true, company})
        
    } catch (error) {
        res.json({
            success:false,message:error.message
        })
        
    }

}

// Post a new job
export const postJob = async (req,res) => {

    const {title, description, location, salary, level, category} = req.body

    const companyId = req.company._id

    try {

        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        })

        await newJob.save()

        res.json({success:true, newJob})
        
    } catch (error) {

        res.json({success:false, message: error.message})
        
    }

}

//Get Company Job Applicants
export const getCompanyJobApplicants = async (req, res) => {
    try {

        const companyId = req.company._id

        // Find job applications for the user and populate related data
        const applications = await JobApplication.find({companyId})
        .populate('userId','name image resume')
        .populate('jobId','title location category level salary')
        .exec()

        return res.json({success:true, applications})
        
    } catch (error) {
        res.json({success:false, message:error.message})
        
    }

}

// Get Company Posted Jobs
export const getCompanyPostedJobs = async (req,res) => {
    try {

        const companyId = req.company._id

        const jobs = await Job.find({companyId})

        // (ToDo) Adding No. of applicants info in data
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await JobApplication.find({jobId: job._id});
            return {...job.toObject(),applicants:applicants.length}
        }))

        res.json({success:true, jobsData })
        
    } catch (error) {
        res.json({success:false, message: error.message})
        
    }

}

// Change Job Application Status
export const ChangeJobApplicationsStatus = async (req,res) => {

    try {

        const {id, status} = req.body

        await JobApplication.findOneAndUpdate({_id: id},{status})

        res.json({success:true, message:'Status Changed'})
        
    } catch (error) {

        res.json({success:false, message:error.message})
        
    }

    

}

// Change job visibility
export const changeVisibility = async (req,res) => {
    try {

        const {id} = req.body

        const companyId = req.company._id

        const job = await Job.findById(id)
            if (!job) {
                return res.json({ success: false, message: 'Job not found' })
            }

            if (companyId.toString() !== job.companyId.toString()) {
                return res.json({ success: false, message: 'Not authorized to change this job' })
            }

            job.visible = !job.visible
            await job.save()

            res.json({ success: true, message: 'Job visibility updated', job })
        
    } catch (error) {

        res.json({success:false, message:error.message})
        
    }

}
