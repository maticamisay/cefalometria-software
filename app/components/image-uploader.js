export default function ImageUploader({ setImage, setImageLoaded }) {
  const handleImageChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      setImage(event.target.result);
      setImageLoaded(false);
    };
    reader.readAsDataURL(file);
  };

  return <input type="file" onChange={handleImageChange} accept="image/*" />;
}
