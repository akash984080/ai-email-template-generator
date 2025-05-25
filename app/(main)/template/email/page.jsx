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
    setLoading(true);

    if (!templateQuery?.design) {
      return alert("Please select a template and wait for it to load.");
    }
    if (!to || !subject) {
      return alert("Please fill in both the recipient and subject fields.");
    }

    try {
      const formData = {
        from: email,
        to,
        cc: ccEnabled ? cc : undefined,
        bcc: bccEnabled ? bcc : undefined,
        subject,
        templateData: templateQuery.design,
        attachments: attachmentsEnabled ? attachments : undefined,
        provider: userdetail?.provider || 'gmail',
        templateId: selectedTid,
      };

      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      toast.success('Email sent successfully!');

      // Reset form
      setTo("");
      setSubject("");
      setCc("");
      setBcc("");
      setAttachments([]);
      setCcEnabled(false);
      setBccEnabled(false);
      setAttachmentsEnabled(false);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-8 space-y-8 bg-white shadow-xl rounded-2xl transform transition-all duration-300 hover:shadow-2xl">
        <div className="border-b border-gray-100 pb-6">
          <div className="flex items-center space-x-3 mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Send Email Template</h2>
          </div>
          <p className="text-gray-600 ml-11">Fill in the details below to send your email Template</p>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Select Template
            </label>
            {allTemplates ? (
              allTemplates.length > 0 ? (
                <select
                  value={selectedTid}
                  onChange={(e) => setSelectedTid(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-blue-300"
                >
                  <option value="">-- Choose a template --</option>
                  {allTemplates.map((tpl) => (
                    <option key={tpl.tId} value={tpl.tId} className="py-2">
                      {tpl.description || tpl.tId}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-500 italic">No templates found. Create a template first.</p>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg">
                <div className="animate-spin h-8 w-8 border-3 border-blue-500 rounded-full border-t-transparent"></div>
                <span className="ml-3 text-sm text-gray-600">Loading templates...</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="transform transition-all duration-200 hover:scale-[1.02]">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Recipient Email
              </label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
                placeholder="Enter recipient's email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-blue-300"
              />
            </div>

            <div className="transform transition-all duration-200 hover:scale-[1.02]">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="Enter email subject"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-blue-300"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-xl">
            <button
              type="button"
              onClick={() => setCcEnabled(!ccEnabled)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                ccEnabled
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="flex items-center">
                {ccEnabled ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    CC Added
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add CC
                  </>
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setBccEnabled(!bccEnabled)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                bccEnabled
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="flex items-center">
                {bccEnabled ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    BCC Added
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add BCC
                  </>
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setAttachmentsEnabled(!attachmentsEnabled)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                attachmentsEnabled
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="flex items-center">
                {attachmentsEnabled ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Attachments Added
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Add Attachments
                  </>
                )}
              </span>
            </button>
          </div>

          {ccEnabled && (
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 shadow-sm transform transition-all duration-200 hover:scale-[1.01]">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                CC Recipients
              </label>
              <input
                type="email"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="Enter CC email addresses (comma-separated)"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-blue-300"
              />
            </div>
          )}

          {bccEnabled && (
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 shadow-sm transform transition-all duration-200 hover:scale-[1.01]">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                BCC Recipients
              </label>
              <input
                type="email"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="Enter BCC email addresses (comma-separated)"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-blue-300"
              />
            </div>
          )}

          {attachmentsEnabled && (
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Attachments
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-white hover:border-blue-300 transition-colors duration-200">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleAttachments(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Choose Files
                </label>
                <p className="mt-3 text-sm text-gray-500">Max {MAX_ATTACHMENTS} files, {MAX_FILE_SIZE_MB}MB each</p>
              </div>
              {uploading && (
                <div className="mt-4 flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                  <div className="animate-spin h-6 w-6 border-3 border-blue-500 rounded-full border-t-transparent"></div>
                  <span className="ml-3 text-sm text-blue-700 font-medium">Uploading files...</span>
                </div>
              )}
              <div className="mt-4 space-y-3">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {file.type.startsWith("image/") ? (
                      <div className="flex items-center space-x-4">
                        <img
                          src={`data:${file.type};base64,${file.base64}`}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                        />
                        <span className="text-sm font-medium text-gray-700">{file.name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg border">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{file.name}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-6">
          <button
            type="submit"
            disabled={loading || !templateQuery?.design || !selectedTid}
            className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-3 border-white rounded-full border-t-transparent mr-2"></div>
                <span className="font-medium">Sending...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

