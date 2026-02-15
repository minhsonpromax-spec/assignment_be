import bcrypt from "bcrypt"
import crypto from "crypto"
import { AppError } from "../exceptions/app-error.js"
import prisma from "../database/index.js"
import jwt from "jsonwebtoken"
import { transporter } from "../utils/mailer.js"

export const signUp = async (fullName, password, email) => {
    if(!fullName || !password || !email)
        throw new AppError("Please enter all the information", 400)
    const existed = await prisma.users.findUnique( {where: { email }})
    if(existed)
        throw new AppError(`Email ${email} already existed`, 409)
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const roleId = await prisma.roles.findFirst({
        where: {
            name: "USER",          
            scope: "SYSTEM"
        }
    })
    if (!roleId) 
        throw new AppError("roleId not found", 400)

    const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.users.create({
      data: {
        fullName,
        email,
        password: hashedPassword
      }
    })

    await tx.userRole.create({
      data: {
        userId: newUser.id,
        roleId: roleId.id
      }
    })

    return newUser
  })

  const {password: _, ...safeUser} = user
  return safeUser
}

export const logIn = async (email, password) => {
  if(!email || !password)
    throw new AppError("Please enter all the information", 400)

  const user = await prisma.users.findUnique({email})

  if(!user)
    throw new AppError("User not found", 404)

  const isMatch = await bcrypt.compare(password, user.hashedPassword)

  if(!isMatch)
    throw new AppError("Invalid email or password", 400)

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET_TOKEN,
    { expiresIn: "1d" }
  )

  return token 
}


export const requestPasswordReset = async (email) => {
  if(!email)
    throw new AppError ("Email must be provided", 400)
  const user = await prisma.users.findUnique( {where: { email }})

  if (!user) 
    throw new AppError("User not found", 404)

  const token = crypto.randomBytes(32).toString("hex")
  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      tokenHash,
      expiredAt: new Date(Date.now() + 15 * 60 * 1000) // 15m
    }
  })

  await transporter.sendMail({
    to: user.email,
    subject: "Password Reset",
    html: `<p>Click link:</p>
           <a href="https://assignment.com/reset?token=${token}"> 
           Reset Password</a>` // điền link của web vào đây
  })

  return { message: "RESET_EMAIL_SENT" }
}


export const resetPassword = async (token, newPassword) => {
  if(!token || newPassword)
    throw new AppError ("Token or new password must be provided", 400)
  
  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

  const resetRecord = await prisma.passwordReset.findFirst({
    where: {
      tokenHash,
      expiredAt: { gt: new Date() },
      usedAt: null
    },
    include: { user: true }
  })

  if (!resetRecord) {
    throw new AppErrorError("Invalid or expired token", 400)
  }

  if (!validator.isLength(password, { min: 8 }))
    throw new AppError("Password must be at least 8 characters", 400)

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.$transaction([
    prisma.users.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword }
    }),
    prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() }
    })
  ])

  return { message: "PASSWORD_UPDATED" }
}

export const verifyToken = (token) => {
    if(!token) 
      throw new AppError('UnAuthentication', 401)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN)
    return decoded
}

