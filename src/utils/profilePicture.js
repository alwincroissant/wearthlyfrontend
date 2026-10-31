export const getProfilePictureUrl = (profilePicture) => {
  if (!profilePicture || profilePicture.includes("default-avatar.png")) {
    return "/default-avatar.svg";
  }
  return profilePicture;
};
