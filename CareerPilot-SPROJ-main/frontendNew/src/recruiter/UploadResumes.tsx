import { useState, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "@clerk/clerk-react";
import { Upload, X } from "lucide-react";
import { apiFetch } from "../api/fetchClient";
import { useSearchParams } from "react-router-dom";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "pending" | "uploading" | "success" | "error";
  email?: string;
  candidateId?: string;
  inviteSent?: boolean;
}

export default function CandidateUpload({
  onUploadComplete,
}: {
  onUploadComplete?: () => void;
}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId"); // 🔹 read jobId from URL

  const handleFiles = async (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      status: "pending",
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    const form = new FormData();
    for (const file of Array.from(fileList)) {
      form.append("files", file);
    }

    try {
      setFiles((prev) =>
        prev.map((f) =>
          newFiles.some((nf) => nf.id === f.id)
            ? { ...f, status: "uploading" }
            : f
        )
      );

      const token = await getToken();
      if (!token) return;

      // 🔹 choose endpoint based on jobId
      const endpoint = jobId
        ? `/api/jobs/${jobId}/candidates/upload-resumes`
        : `/api/recruiter/candidates/upload-resumes`;

      const res: { created: { id: string; email: string }[] } = await apiFetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      setFiles((prev) =>
        prev.map((f) => {
          const idx = newFiles.findIndex((nf) => nf.id === f.id);
          const createdItem = res.created[idx];

          if (createdItem && f.status === "uploading") {
            return {
              ...f,
              status: "success",
              candidateId: createdItem.id,
              email: createdItem.email,
              inviteSent: false,
            };
          }
          return f;
        })
      );

      onUploadComplete?.();
    } catch (err) {
      console.error("Upload error:", err);

      setFiles((prev) =>
        prev.map((f) =>
          newFiles.some((nf) => nf.id === f.id)
            ? { ...f, status: "error" }
            : f
        )
      );
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onButtonClick = () => fileInputRef.current?.click();

  const formatBytes = (b: number) =>
    b < 1024 * 1024
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / (1024 * 1024)).toFixed(1)} MB`;

  // Send individual invite
  const sendInvite = async (file: UploadedFile) => {
    if (!file.candidateId || !file.email?.trim()) {
      alert("Candidate email missing");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        alert("Not authorized");
        return;
      }

      // 🔹 choose endpoint based on jobId
      const endpoint = jobId
        ? `/api/jobs/${jobId}/candidates/${file.candidateId}/send-invite`
        : `/api/recruiter/candidates/${file.candidateId}/send-invite`;

      await apiFetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: file.email }),
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, inviteSent: true } : f
        )
      );
    } catch (err) {
      console.error("Invite send error", err);
      alert("Failed to send invite");
    }
  };

  // Batch send
  const sendAllInvites = async () => {
    const unsent = files.filter(
      (f) => f.status === "success" && !f.inviteSent
    );

    for (const file of unsent) {
      await sendInvite(file);
    }

    alert(`Invites sent to ${unsent.length} candidates`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#1E293B]">
        Upload Candidate Resumes
      </h2>
      <p className="text-gray-600">
        {jobId
          ? `Resumes uploaded here will be linked to Job ID: ${jobId}`
          : "Upload resumes to create profiles and send interview invitations"}
      </p>

      {/* Upload Zone */}
      <div
        className="border-2 border-dashed rounded-xl p-12 mb-6 text-center hover:border-[#0E7490]/50 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={(e) =>
            e.target.files && handleFiles(e.target.files)
          }
          className="hidden"
        />

        <Upload className="w-16 h-16 text-[#0E7490] mx-auto mb-4" />

        <h3 className="mb-2 text-[#1E293B]">
          Drop files here or click to browse
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          PDF only, max 10 MB each
        </p>

        <Button
          onClick={onButtonClick}
          className="bg-gradient-to-r from-[#0E7490] to-[#38BDF8] text-white"
        >
          Select Files
        </Button>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <div className="flex justify-between items-center mb-3">
            <h3>Uploaded ({files.length})</h3>
            <Button
              onClick={sendAllInvites}
              className="bg-gradient-to-r from-[#0E7490] to-[#38BDF8] text-white"
            >
              Send All Invites
            </Button>
          </div>

          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="border rounded-lg p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <p className="text-[#1E293B]">{file.name}</p>
                  <p className="text-gray-500 text-sm">
                    {formatBytes(file.size)}
                  </p>

                  {file.status === "success" && file.email && (
                    <Input
                      value={file.email}
                      onChange={(e) =>
                        setFiles((prev) =>
                          prev.map((f) =>
                            f.id === file.id
                              ? { ...f, email: e.target.value }
                              : f
                          )
                        )
                      }
                      className="mt-2 bg-gray-50 text-sm"
                    />
                  )}
                </div>

                {/* Send Button */}
                {file.status === "success" && (
                  <Button
                    onClick={() => sendInvite(file)}
                    className={`px-4 py-2 text-white ${
                      file.inviteSent
                        ? "bg-green-600"
                        : "bg-gradient-to-r from-[#0E7490] to-[#38BDF8]"
                    }`}
                  >
                    {file.inviteSent ? "Sent" : "Send"}
                  </Button>
                )}

                <button
                  onClick={() =>
                    setFiles((prev) =>
                      prev.filter((f) => f.id !== file.id)
                    )
                  }
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
