const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

async function uploadImg(ev) {
  const file = ev.target.files[0];
  if (file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET); // Replace with your upload preset

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const imgUrl = await res.json();
      return imgUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  // const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  // try {
  //   const formData = new FormData();
  //   formData.append("upload_preset", UPLOAD_PRESET);
  //   formData.append("image", ev.target.files[0]);
  //   console.log(ev.target.files[0]);
  //   const res = await fetch(UPLOAD_URL, {
  //     method: "POST",
  //     body: formData,
  //   });
  //   const imgUrl = await res.json();
  //   return imgUrl;
  // } catch (err) {
  //   console.error("Failed to upload", err);
  //   throw err;
  // }
}

export const uploadService = {
  uploadImg,
};
