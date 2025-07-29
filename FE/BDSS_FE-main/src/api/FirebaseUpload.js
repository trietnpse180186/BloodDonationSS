import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import axios from "axios";
export default function FirebaseUpload() {
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) return alert("Select a file!");

    const storageRef = ref(storage, `images/${image.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("Firebase image URL:", downloadURL);

      axios.post("${baseUrl}/api/user/avatar", {
        imageUrl: downloadURL,
      });

      alert("Uploaded and URL sent to server!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed!");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload to Firebase</button>
    </div>
  );
}
