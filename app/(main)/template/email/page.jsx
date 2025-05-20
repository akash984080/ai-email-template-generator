"use client";
import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserDetail } from "@/app/provider";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export default function SendEmailForm() {
  const { userdetail } = useUserDetail();
  const email = userdetail?.email || "";
  const router = useRouter();

  const allTemplates = useQuery(api.emailTemplate.GetalluserTemplate, { email });
  const [selectedTid, setSelectedTid] = useState("");
  const templateQuery = useQuery(
    api.emailTemplate.GetTemplateDesign,
    selectedTid ? { tId: selectedTid, email } : "skip"
  );

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [ccEnabled, setCcEnabled] = useState(false);
  const [bccEnabled, setBccEnabled] = useState(false);
  const [attachmentsEnabled, setAttachmentsEnabled] = useState(false);

  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const MAX_FILE_SIZE_MB = 10;
  const MAX_ATTACHMENTS = 10;

  const handleAttachments = (files) => {
    if (files.length > MAX_ATTACHMENTS) {
      toast.error(`Max ${MAX_ATTACHMENTS} attachments allowed.`);
      return;
    }

    setUploading(true);

    const filePromises = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          toast.error(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
          return resolve(null);
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            base64: reader.result.split(",")[1],
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((filesData) => {
      setAttachments(filesData.filter(Boolean));
      setUploading(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!templateQuery?.design) {
      return alert("Please select a template and wait for it to load.");
    }
    if (!to || !subject) {
      return alert("Please fill in both the recipient and subject fields.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from:email,
          to,
          cc: ccEnabled ? cc : undefined,
          bcc: bccEnabled ? bcc : undefined,
          subject,
          templateData: templateQuery.design,
          attachments: attachmentsEnabled ? attachments : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast("Email sent successfully!");
        setTo("");
        setSubject("");
        setCc("");
        setBcc("");
        setAttachments([]);
        setCcEnabled(false);
        setBccEnabled(false);
        setAttachmentsEnabled(false);
        router.push('/dashboard');
      } else {
        toast("Error sending email: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold">Send Email Template</h2>

      <div>
        <label className="block font-medium mb-1">Select Template</label>
        {allTemplates ? (
          allTemplates.length > 0 ? (
            <select
              value={selectedTid}
              onChange={(e) => setSelectedTid(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">-- Choose a template --</option>
              {allTemplates.map((tpl) => (
                <option key={tpl.tId} value={tpl.tId}>
                  {tpl.description || tpl.tId}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-gray-500">No templates found.</p>
          )
        ) : (
          <p className="text-sm text-gray-500">Loading templates...</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Recipient Email</label>
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="flex gap-4">
        <button type="button" onClick={() => setCcEnabled(!ccEnabled)} className="text-blue-600 hover:underline">
          {ccEnabled ? "Remove CC" : "Add CC"}
        </button>
        <button type="button" onClick={() => setBccEnabled(!bccEnabled)} className="text-blue-600 hover:underline">
          {bccEnabled ? "Remove BCC" : "Add BCC"}
        </button>
        <button
          type="button"
          onClick={() => setAttachmentsEnabled(!attachmentsEnabled)}
          className="text-blue-600 hover:underline"
        >
          {attachmentsEnabled ? "Remove Attachments" : "Add Attachments"}
        </button>
      </div>

      {ccEnabled && (
        <div>
          <label className="block font-medium mb-1">CC</label>
          <input
            type="email"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
      )}

      {bccEnabled && (
        <div>
          <label className="block font-medium mb-1">BCC</label>
          <input
            type="email"
            value={bcc}
            onChange={(e) => setBcc(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
      )}

      {attachmentsEnabled && (
        <div>
          <label className="block font-medium mb-1">Attachments</label>
          <input type="file" multiple onChange={(e) => handleAttachments(e.target.files)} className="w-full" />
          {uploading && <p className="text-sm text-gray-500 mt-2">Uploading files...</p>}
          <div className="mt-2 space-y-2">
            {attachments.map((file, index) =>
              file.type.startsWith("image/") ? (
                <div key={index} className="flex items-center gap-2">
                  <img
                    src={`data:${file.type};base64,${file.base64}`}
                    alt={file.name}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <span className="text-sm text-gray-700">{file.name}</span>
                </div>
              ) : (
                <div key={index} className="text-sm text-gray-700">
                  📎 {file.name}
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div>
        <label className="block font-medium mb-1">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !templateQuery?.design || !selectedTid}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Email"}
      </button>
    </form>
  );
}

