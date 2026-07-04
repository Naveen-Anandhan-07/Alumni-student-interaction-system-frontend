const API_HOST = "http://localhost:8080";

export const getProfileImagePath = (profile) =>
  profile?.profileImage ||
  profile?.profileImageUrl ||
  profile?.imageUrl ||
  profile?.photoUrl ||
  "";

export const getProfileImageUrl = (profile) => {
  const imagePath = getProfileImagePath(profile);

  if (!imagePath) {
    return "";
  }

  if (typeof imagePath !== "string") {
    return "";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${API_HOST}${imagePath}`;
};
