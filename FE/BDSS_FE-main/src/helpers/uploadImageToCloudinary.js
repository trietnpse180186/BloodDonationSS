export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "blood_donation");
  formData.append("cloud_name", "drqxybfcw");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/drqxybfcw/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error("Upload to Cloudinary failed:", error);
    return null;
  }
};
