import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

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

export {registerUser};