import ImagePreview from "./ImagePreview";

export default function Page() {
  return (
    <div className="container mx-auto text-center p-5 mobile-container">
      <h1 className="text-2xl font-bold mb-5">Image Preview</h1>
      <ImagePreview />
    </div>
  );
}
