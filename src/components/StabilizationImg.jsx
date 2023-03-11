import React, { useEffect, useRef, useState } from "react";
import cv from "opencv.js";
import Tesseract from "tesseract.js";

function StabilizationImg({ imageSrc }) {
  const canvasRef = useRef(null);
  const [fillteredPhoto, setFillteredPhoto] = useState();
  const [textResult, setTextResult] = useState();

  useEffect(() => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Get the base64 string
        const base64String = event.target.result;

        // Create an image element to load the base64 string
        const imgElement = document.createElement("img");
        imgElement.onload = () => {
          // Create a canvas to draw the image
          const canvas = canvasRef.current;
          canvas.width = imgElement.width;
          canvas.height = imgElement.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(imgElement, 0, 0);

          // Load the image from the canvas into OpenCV.js
          const img = cv.imread(canvas);

          // Convert the image to grayscale
          const grayImg = new cv.Mat();
          cv.cvtColor(img, grayImg, cv.COLOR_RGBA2GRAY);

          // Apply a noise reduction filter
          const blurredImg = new cv.Mat();
          cv.medianBlur(grayImg, blurredImg, 5);

          // Apply a sharpening filter
          const sharpenedImg = new cv.Mat();
          const laplacian = new cv.Mat();
          cv.Laplacian(blurredImg, laplacian, cv.CV_8U, 3);
          cv.add(grayImg, laplacian, sharpenedImg);

          // Apply a Gaussian blur to further smooth the image
          const smoothedImg = new cv.Mat();
          cv.GaussianBlur(sharpenedImg, smoothedImg, new cv.Size(9, 9), 0, 0);

          // Display the resulting image
          cv.imshow(canvas, smoothedImg);

          setFillteredPhoto(canvas.toDataURL());

          // Free memory
          img.delete();
          grayImg.delete();
          blurredImg.delete();
          sharpenedImg.delete();
          smoothedImg.delete();
          laplacian.delete();
        };

        // Set the image element source to the base64 string
        imgElement.src = base64String;
      };

      // Read the image file as a data URL
      reader.readAsDataURL(imageSrc);
    } catch (e) {
      console.log(e);
    }
  }, [imageSrc]);

  const convertImageToText = async (imageUrl) => {
    const result = await Tesseract.recognize(imageUrl, "bul");
    return result.data.text;
  };

  const handleConvertion = async (imageUrl) => {
    try {
      const text = await convertImageToText(imageUrl);
      setTextResult(text);
    } catch (error) {
      console.log(error);
      setTextResult("Error occurred during OCR. Please try again.");
    }
  };

  useEffect(() => {
    handleConvertion(fillteredPhoto);
  }, [fillteredPhoto]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>;
      <img src={fillteredPhoto} alt="Image Placeholder" />
      <p>{textResult}</p>
    </div>
  );
}

export default StabilizationImg;
