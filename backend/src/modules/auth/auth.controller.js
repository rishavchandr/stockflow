import prisma from "../../db/index.js";
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'

const generateToken = (user, organisation) => {
  return jwt.sign(
    {
      userId: user.id,
      orgId: organisation.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
}

export const registerUser = async (req,res) => {

    try {
        const {email , password , organisationName} = req.body
        
        if(!email || !password || !organisationName){
            return res.status(400).json({message: "required fields"})
        }
    
        const existingUser = await prisma.user.findUnique({where: {email}})
        if(existingUser){
            return res.status(409).json({message: "User already exists"})
        }
    
        const passwordHash = await bcrypt.hash(password,12)
        
        const result = await prisma.$transaction(async (tx) => {
    
            const organisation = await tx.organisation.create({
                data: {
                    name: organisationName,
                }
            })
    
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    orgId: organisation.id,
                }
            })
    
            await tx.settings.create({
                data: {
                    orgId: organisation.id,
                    defaultLowStockThreshold: 5,
                }
            })
    
            return {user, organisation}
        })
        
        const token = generateToken(result.user , result.organisation)
    
        return res.status(201).json({
            token,
            user: {
              id: result.user.id,
              email: result.user.email,
              organisationId: result.organisation.id,
              organisationName: result.organisation.name,
           },
           message: "User created Successfully"
        })
    } catch (error) {
        return res.status(400).json({message: error.message })
    }
}

export const loginUser = async (req,res) => {

    try {
        const {email, password} = req.body
    
        if(!email || !password) {
            return res.status(400).json({message: "Empty fields"})
        }
    
        const user = await prisma.user.findUnique({
            where: {email},
            include: {organisation: true}
        })
    
        if(!user){
            return res.status(404).json({message: "Invaild user credentials"})
        }
    
        const passwordValid = await bcrypt.compare(password,user.passwordHash)
    
        if(!passwordValid){
            return res.status(400).json({message: "Invaild password!!"})
        }
    
        const token = generateToken(user , user.organisation)
    
        return res.status(200).json({
            token,
            user: {
              id: user.id,
              email: user.email,
              organisationId: user.orgId,
              organisationName: user.organisation.name,
           },
           message: "User LogedIN Successfully"
        })
    } catch (error) {
         return res.status(400).json({message: error.message })
    }
}

export const currentUser = async(req,res) => {
    try {
        const userId = req.user.userId
    
        const user = await prisma.user.findUnique({
           where: { id: userId },
           include: { organisation: true },
        })
    
        if (!user) {
          return res.status(404).json({message: "User Not Found"})
       }
    
      return res.status(200).json({
        id: user.id,
        email: user.email,
        organisationId: user.orgId,
        organisationName: user.organisation.name,
      })
    } catch (error) {
         return res.status(400).json({message: error.message })
    }
}
