import { useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs"; // Import TensorFlow.js

const CatIdentification = () => {
  const [isCat, setIsCat] = useState(null);
  const imageRef = useRef(null);

  // Load COCO-SSD model
  const loadModel = async () => {
    const model = await cocoSsd.load();
    console.log("Model loaded");
    return model;
  };

  const detectObjects = async () => {
    if (imageRef.current) {
      const model = await loadModel();
      const predictions = await model.detect(imageRef.current);

      // Check if 'cat' is in the predictions
      const foundCat = predictions.some(
        (prediction) => prediction.class === "cat"
      );
      setIsCat(foundCat);
    }
  };

  return (
    <div>
      <h1>Cat Identification</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const imgElement = new Image();
              imgElement.src = reader.result;
              imgElement.onload = () => {
                imageRef.current = imgElement;
                detectObjects();
              };
            };
            reader.readAsDataURL(file);
          }
        }}
      />
      <div>
        {isCat === null ? (
          <p>Upload an image to check for cats.</p>
        ) : isCat ? (
          <p>A cat was found!</p>
        ) : (
          <p>No cat detected.</p>
        )}
      </div>
    </div>
  );
};

export default CatIdentification;
