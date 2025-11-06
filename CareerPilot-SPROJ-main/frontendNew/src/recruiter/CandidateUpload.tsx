import { useState, useRef } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { Upload, FileText, X, CheckCircle, Send } from 'lucide-react';
import { apiFetch } from '../api/fetchClient';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  email?: string;
  candidateId?: string;
}

interface Props {
  onActionComplete?: () => void;
}

export default function CandidateUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...newFiles]);

    const form = new FormData();
    for (const file of Array.from(fileList)) form.append('files', file);

    try {
      setFiles((prev) =>
        prev.map((f) =>
          newFiles.some((nf) => nf.id === f.id)
            ? { ...f, status: 'uploading' }
            : f
        )
      );

      const res: { created: { id: string; email: string }[] } = await apiFetch(
        '/api/recruiter/candidates/upload-resumes',
        { method: 'POST', body: form }
      );
      
      setFiles((prev) =>
        prev.map((f) => {
          const idx = newFiles.findIndex((nf) => nf.id === f.id);
          const createdItem = res.created[idx];
          if (createdItem && f.status === 'uploading') {
            return {
              ...f,
              status: 'success',
              candidateId: createdItem.id,
              email: createdItem.email,
            };
          }
          return f;
        })
      );

      onUploadComplete?.();
    } catch (err) {
      console.error('Upload error:', err);
      setFiles((prev) =>
        prev.map((f) =>
          newFiles.some((nf) => nf.id === f.id)
            ? { ...f, status: 'error' }
            : f
        )
      );
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onButtonClick = () => fileInputRef.current?.click();

  const formatBytes = (b: number) =>
    b < 1024 * 1024
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / (1024 * 1024)).toFixed(1)} MB`;

  const successful = files.filter((f) => f.status === 'success');

  const sendInvites = async () => {
    if (!successful.length) return;
    try {
      // Commenting out edit email / resend invite for now
      /*
      await Promise.all(
        successful.map((f) =>
          apiFetch(`/api/recruiter/candidates/${f.candidateId}/email`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: f.email, resend_invite: true }),
          })
        )
      );  
      */
      alert(`Invites would be sent to ${successful.length} candidates`);
      onUploadComplete?.();
    } catch (err) {
      console.error('Resend error', err);
      alert('Failed to resend some invites');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl mb-1">Upload Candidate Resumes</h2>
      <p className="text-gray-600 mb-6">
        Upload resumes to create profiles and send interview invitations
      </p>

      <div
        className="border-2 border-dashed rounded-xl p-12 mb-6 text-center hover:border-purple-400 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <Upload className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h3 className="mb-2">Drop files here or click to browse</h3>
        <p className="text-gray-600 text-sm mb-4">PDF (max 10 MB each)</p>
        <Button
          onClick={onButtonClick}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          Select Files
        </Button>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Uploaded ({files.length})</h3>
            {successful.length > 0 && (
              <Button
                onClick={sendInvites}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Send className="w-4 h-4 mr-2" /> Send Invites (
                {successful.length})
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="border rounded-lg p-4 flex items-start gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    file.status === 'success'
                      ? 'bg-green-100'
                      : file.status === 'error'
                      ? 'bg-red-100'
                      : 'bg-gray-100'
                  }`}
                >
                  {file.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p>{file.name}</p>
                  <p className="text-gray-500 text-sm">
                    {formatBytes(file.size)}
                  </p>
                  {file.status === 'success' && file.email && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">
                        E-mail extracted:
                      </p>
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
                        className="bg-gray-50 text-sm"
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() =>
                    setFiles((prev) => prev.filter((f) => f.id !== file.id))
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

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="mb-2 text-purple-900">How it works</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-purple-800">
          <li>Upload PDF resumes</li>
          <li>AI extracts e-mail & skills</li>
          <li>Verify e-mail if needed</li>
          <li>Send interview invites</li>
        </ol>
      </div>
    </div>
  );
}
