import React, { useCallback, useEffect, useState } from "react";
import StabilizationImg from "./StabilizationImg";
import { isMobile } from "react-device-detect";
import Webcam from "react-webcam";
import { saveAs } from "file-saver";

function Camera() {
  const [photo, setPhoto] = useState();
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: isMobile ? { exact: "environment" } : "user",
  };

  const webcamRef = React.useRef(null);

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    let file = dataURLtoFile(imageSrc, "screenshot.jpeg");
    setPhoto(file);
  }, [webcamRef]);

  return (
    <div>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
      <StabilizationImg imageSrc={photo} />
    </div>
  );
}

export default Camera;
