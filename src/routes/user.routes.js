import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, fetchCurrentUser, updateFullname, updateUsername, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser) //secured route (using JWT)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, fetchCurrentUser)
router.route("/update-fullname").patch(verifyJWT, updateFullname)
router.route("/update-username").patch(verifyJWT, updateUsername)

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/update-cover").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

export default router;