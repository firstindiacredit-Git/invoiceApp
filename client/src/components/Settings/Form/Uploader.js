import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./Uploader.module.css";
import { Grid, LinearProgress, Avatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 5,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#008d3f;",
  },
}))(LinearProgress);

export default function Uploader({ form, setForm, type }) {
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setForm({ ...form, [type]: file }); // Update either 'logo' or 'waterMark'
    // eslint-disable-next-line
  }, [file]);

  const onDrop = useCallback((acceptedFiles) => {
    const url = "https://api.cloudinary.com/v1_1/dns9jkmcp/image/upload";

    acceptedFiles.forEach(async (acceptedFile) => {
      const formData = new FormData();
      formData.append("file", acceptedFile);
      formData.append("upload_preset", "invoice");

      const response = await fetch(url, {
        method: "post",
        body: formData,
      });
      setProgress(100);
      const data = await response.json();

      setFile(data.secure_url);
      console.log(data);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accepts: "image/*",
    multiple: false,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : null}`}
      >
        <input {...getInputProps()} />
        {/* Display avatar if file is uploaded */}
        {file ? (
          <Avatar
            style={{ width: "100px", height: "100px" }}
            src={file}
            alt={type === "logo" ? "Logo" : "Watermark"}
          />
        ) : (
          <p>Upload {type === "logo" ? "Logo" : "Watermark"}</p>
        )}
      </div>
      <Grid item style={{ width: "100%" }}>
        <BorderLinearProgress variant="determinate" value={progress} />
      </Grid>
    </>
  );
}
