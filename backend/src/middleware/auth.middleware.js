import jwt from "jsonwebtoken"


export const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided. Access denied.' })
        }
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = {
            userId: decoded.userId,
            orgId: decoded.orgId,
            email: decoded.email,
        }

        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Access denied.' })
        }
        next(error)
    }
}