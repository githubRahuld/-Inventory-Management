import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generting access and refresh tokens"
    );
  }
};

const registerUsers = asyncHandler(async (req, res) => {
  const { email, password, fullName } = req.body;

  if ([email, password, fullName].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are reuqired");
  }
  //email validation
  if (!email.includes("@")) {
    throw new ApiError("Email should be valid");
  }

  const checkUserExist = await User.find({ email });

  if (checkUserExist) {
    // throw new ApiError(409, "User already exists");
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await User.create({
    email,
    password,
    fullName,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log("createduser: ", createdUser);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registring user!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(409).json({ message: "Email is required" });
  }

  const userExists = await User.findOne({ email });

  if (!userExists) {
    // throw new ApiError(404, "User not exists,please SignUp first!");
    return res
      .status(409)
      .json({ message: "User not exists,please SignUp first!" });
  }

  const passwordCheck = await userExists.isPasswordCorrect(password);

  if (!passwordCheck) {
    // throw new ApiError(400, "Invalid Password");
    return res.status(409).json({ message: "Invalid Password" });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    userExists._id
  );

  const loggedInUser = await User.findById(userExists._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User loggedIn successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out successfully"));
});

export { registerUsers, loginUser, logoutUser };
