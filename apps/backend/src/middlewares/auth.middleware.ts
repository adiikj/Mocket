import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
    user?: any;
}

export const verifyJWT = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token){
            throw new ApiError(401, "Unauthorized");
        }
    
        const decodedToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user){
            throw new ApiError(404, "Invalid Access Token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token");
    }
});