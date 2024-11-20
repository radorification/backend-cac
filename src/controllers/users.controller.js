import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessandRefreshTokens = async(userId) => {
	try {
		const user = await User.findById(userId)
		const accessToken = user.generateAccessToken()
		const refreshToken = user.generateRefreshToken()

		user.refreshToken = refreshToken
		await user.save({validateBeforeSave: false})	// >validateBeforeSave< is used since we aren't validating password here while saving data in our MongoDB database.
		return {accessToken, refreshToken}

	} catch (error) {
		throw new ApiError(400, "Some error occoured while generating tokens")
	}
}

const registerUser = asyncHandler( async (req, res) => {
    // Get User details (from frontend)
	// Validate the info provided
	// Check if user already exists
	// Check for avatar & image
	// Upload them to cloudinary
	// create User Object - create entry in DB
	// remove password & refresh token field from response
	// check for User creation
	// return response
    
    const {username, fullname, email, password} = req.body;
    // console.log("email :", email);
	 console.log(req.body);


    if([username, password, fullname, email].some((field) => field?.trim() == "")){
        throw new ApiError(400, "All fields are required!");
        
    }


	const existingUser = await User.findOne({
		$or: [{username}, {email}]
	});

	if(existingUser){
		throw new ApiError(409, "Username or E-mail already exists!")
	}


	const avatarLocalPath = req.files?.avatar?.[0]?.path;
	const coverLocalPath = req.files?.coverImage?.[0]?.path;
	

	if(!avatarLocalPath){
		throw new ApiError(400, "Avatar is required");
		
	}

	const avatar = await uploadOnCloudinary(avatarLocalPath);
	const coverImage = await uploadOnCloudinary(coverLocalPath);

	if(!avatar){
		throw new ApiError(400, "Avatar is required");
	}


	const userInfo = await User.create({
		username,
		avatar: avatar.url,
		coverImage: coverImage?.url || "",
		email,
		password,
		fullname
	})

	const createdUser = await User.findById(userInfo._id).select("-password -refreshToken");

	if(!createdUser){
		throw new ApiError(500, "Something went wrong while registering the User")
	}


	return res.status(201).json(
		new ApiResponse(200, createdUser, "User created successfully!")
	)
})

const loginUser = asyncHandler(async (req, res) => {

	//req.body -> data
	//check whether the login credentials matches from the database
	//throw an error if credentials don't match OR find the user which matches the credentials
	//Handle refresh tokens and access token
	//set refresh tokens of a larger duration than the access token
	

	const {username, email, password} = req.body;

	if(!(username || email)) {
		throw new ApiError(400, "Username or Email is required for logging in!")
	}

	const foundUser = await User.findOne({
		$or: [{username}, {email}]
	})

	if(!foundUser){
		throw new ApiError(404, "User does not exists!")
	}

	const isPasswordValid = await foundUser.isPasswordCorrect(password)

	if(!isPasswordValid){
		throw new ApiError(401, "Password is incorrect!")
	}

	const {accessToken, refreshToken} = await generateAccessandRefreshTokens(foundUser._id)

	const loggedInUser = await User.findById(foundUser._id).select("-password -refreshToken")

	const options = {
		httpOnly: true,
		secure: true
	}

	return res.status(200)
	.cookie("accessToken", accessToken, options)
	.cookie("refreshToken", refreshToken, options)
	.json(
		new ApiResponse(
			200,
			{
				foundUser: loggedInUser, accessToken, refreshToken
			},
			"User logged in successfully"
		)
	)
})

const logoutUser = asyncHandler(async (req, res) => {
	await User.findByIdAndUpdate(
		req.user._id,
		{
			$set: {
				refreshToken: undefined
			}
		},
		{
			new: true
		}
	)

	const options = {
		httpOnly: true,
		secure: true
	}

	return res.status(200)
	.clearCookie("accessToken", options)
	.clearCookie("refreshToken", options)
	.json(new ApiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
	const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

	if(!incomingRefreshToken) {
		throw new ApiError(401, "Unauthorized Access!")
	}

	try {
		const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
	
		const user = await User.findById(decodedToken?._id)
		if(!user) {
			throw new ApiError(401, "Invalid Refresh Token")
		}
	
		if(incomingRefreshToken !== user?.refreshToken){
			throw new ApiError(401, "Refresh Token expired or already used!")
		}
	
		//if both the Refresh tokens match, then now we can generate new Access Token for the user
		const options = {
			httpOnly: true,
			secure: true
		}
	
		const {accessToken, newRefreshToken} = await generateAccessandRefreshTokens(user._id)
	
		return res.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", newRefreshToken, options)
		.json(
			new ApiResponse(
				200, {
				accessToken,
				refreshToken: newRefreshToken},
				"Access token refreshed"
			)
		)
	} catch (error) {
		throw new ApiError(401,
			error?.message || "Invalid Refresh Token"
		)
	}

})

export {registerUser,
	loginUser,
	logoutUser,
	refreshAccessToken
};