import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
  accept?: string;
}

const FileUploader = ({
  onFileSelect,
  accept,
}: FileUploaderProps) => {

  const [error, setError] = useState("");

  const maxFileSize = 20 * 1024 * 1024;

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {

      setError("");

      if (rejectedFiles.length > 0) {
        setError("Only PDF resume files under 20MB are allowed.");
        onFileSelect?.(null);
        return;
      }

      const file = acceptedFiles[0] || null;

      if (!file) return;

      const fileName = file.name.toLowerCase();

      const resumeKeywords = [
        "resume",
        "cv",
        "developer",
        "engineer",
        "software",
        "frontend",
        "backend",
        "fullstack",
      ];

      const isResume = resumeKeywords.some((word) =>
        fileName.includes(word)
      );

      if (!isResume) {
        setError("Please upload a proper resume file.");
        onFileSelect?.(null);
        return;
      }

      onFileSelect?.(file);

    },
    [onFileSelect]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: maxFileSize,
  });

  const file = acceptedFiles[0] || null;

  return (
    <div className="w-full gradient-border">

      <div {...getRootProps()}>

        <input {...getInputProps({ accept })} />

        <div className="space-y-4 cursor-pointer">

          {file ? (

            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >

              <img
                src="/images/pdf.png"
                alt="pdf"
                className="size-10"
              />

              <div className="flex items-center space-x-3">

                <div>

                  <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                    {file.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {formatSize(file.size)}
                  </p>

                </div>

              </div>

              <button
                className="p-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect?.(null);
                }}
              >

                <img
                  src="/icons/cross.svg"
                  alt="remove"
                  className="w-4 h-4"
                />

              </button>

            </div>

          ) : (

            <div>

              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">

                <img
                  src="/icons/info.svg"
                  alt="upload"
                  className="size-20"
                />

              </div>

              <p className="text-lg text-gray-500">

                <span className="font-semibold">
                  Click to upload
                </span>

                {" "}or drag and drop

              </p>

              <p className="text-lg text-gray-500">
                PDF Resume Only (max {formatSize(maxFileSize)})
              </p>

            </div>

          )}

          {error && (
            <p className="text-red-500 text-sm font-medium">
              {error}
            </p>
          )}

        </div>

      </div>

    </div>
  );
};

export default FileUploader;