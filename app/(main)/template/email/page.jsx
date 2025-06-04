"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserDetail } from "@/app/provider";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { Mail, Paperclip, Eye, EyeOff, Send, X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import renderTemplateToHtml from "@/utils/RenderToHtml";

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
  const [showPreview, setShowPreview] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [ccRecipients, setCcRecipients] = useState([]);
  const [bccRecipients, setBccRecipients] = useState([]);
  const [currentRecipient, setCurrentRecipient] = useState("");
  const [currentCc, setCurrentCc] = useState("");
  const [currentBcc, setCurrentBcc] = useState("");

  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const MAX_FILE_SIZE_MB = 10;
  const MAX_ATTACHMENTS = 10;

  // Add effect to log state changes
  useEffect(() => {
    console.log('Form State:', {
      selectedTid,
      subject: subject.trim(),
      recipientsCount: recipients.length,
      loading,
      templateLoaded: !!templateQuery?.design
    });
  }, [selectedTid, subject, recipients, loading, templateQuery]);

  // Handle recipient input
  const handleRecipientKeyDown = (e, type) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const email = e.target.value.trim();
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      // Check for duplicates
      const isDuplicate = type === 'to' ? recipients.includes(email) :
                         type === 'cc' ? ccRecipients.includes(email) :
                         bccRecipients.includes(email);

      if (isDuplicate) {
        toast.error("This email address is already added");
        return;
      }

      // Add recipient based on type
      switch (type) {
        case 'to':
          setRecipients(prev => [...prev, email]);
          setCurrentRecipient("");
          break;
        case 'cc':
          setCcRecipients(prev => [...prev, email]);
          setCurrentCc("");
          break;
        case 'bcc':
          setBccRecipients(prev => [...prev, email]);
          setCurrentBcc("");
          break;
      }
    }
  };

  // Add recipient directly (for paste events or button click)
  const addRecipient = (email, type) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim();

    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check for duplicates
    const isDuplicate = type === 'to' ? recipients.includes(trimmedEmail) :
                       type === 'cc' ? ccRecipients.includes(trimmedEmail) :
                       bccRecipients.includes(trimmedEmail);

    if (isDuplicate) {
      toast.error("This email address is already added");
      return;
    }

    // Add recipient based on type
    switch (type) {
      case 'to':
        setRecipients(prev => [...prev, trimmedEmail]);
        setCurrentRecipient("");
        break;
      case 'cc':
        setCcRecipients(prev => [...prev, trimmedEmail]);
        setCurrentCc("");
        break;
      case 'bcc':
        setBccRecipients(prev => [...prev, trimmedEmail]);
        setCurrentBcc("");
        break;
    }
  };

  // Handle paste event for multiple emails
  const handlePaste = (e, type) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const emails = pastedText.split(/[\s,;]+/).filter(email => email.trim() !== '');
    
    emails.forEach(email => addRecipient(email, type));
  };

  const removeRecipient = (email, type) => {
    switch (type) {
      case 'to':
        setRecipients(recipients.filter(e => e !== email));
        break;
      case 'cc':
        setCcRecipients(ccRecipients.filter(e => e !== email));
        break;
      case 'bcc':
        setBccRecipients(bccRecipients.filter(e => e !== email));
        break;
    }
  };

  const handleAttachments = (files) => {
    if (!files || files.length === 0) return;

    // Check total number of attachments after adding new files
    if (attachments.length + files.length > MAX_ATTACHMENTS) {
      toast.error(`Maximum ${MAX_ATTACHMENTS} attachments allowed. You can add ${MAX_ATTACHMENTS - attachments.length} more.`);
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

    Promise.all(filePromises)
      .then((filesData) => {
        const validFiles = filesData.filter(Boolean);
        if (validFiles.length > 0) {
          setAttachments(prev => [...prev, ...validFiles]);
          toast.success(`Added ${validFiles.length} file(s)`);
        }
      })
      .catch(error => {
        console.error('Error processing files:', error);
        toast.error('Error processing files');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!templateQuery?.design) {
      toast.error("Please select a template and wait for it to load.");
      setLoading(false);
      return;
    }

    // Validate recipients
    if (recipients.length === 0) {
      toast.error("Please add at least one recipient.");
      setLoading(false);
      return;
    }

    // Validate subject
    if (!subject.trim()) {
      toast.error("Please enter a subject.");
      setLoading(false);
      return;
    }

    // Validate template selection
    if (!selectedTid) {
      toast.error("Please select a template to send.");
      setLoading(false);
      return;
    }

    try {
      const formData = {
        userEmail: email,
        to: recipients.join(','),
        cc: ccRecipients.length > 0 ? ccRecipients.join(',') : undefined,
        bcc: bccRecipients.length > 0 ? bccRecipients.join(',') : undefined,
        subject: subject.trim(),
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
      setRecipients([]);
      setCcRecipients([]);
      setBccRecipients([]);
      setSubject("");
      setAttachments([]);
      setCcEnabled(false);
      setBccEnabled(false);
      setAttachmentsEnabled(false);
      setSelectedTid("");
      setShowPreview(false);
      
      // Navigate back to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:px-10 md:px-28 lg:px-40 xl:px-56 mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            Send Email
          </h1>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Preview
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Template
            </label>
            <select
              value={selectedTid}
              onChange={(e) => setSelectedTid(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Choose a template...</option>
              {allTemplates?.map((template) => (
                <option key={template.tId} value={template.tId}>
                  {template.description || 'Untitled Template'}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Fields */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To
              </label>
              <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                {recipients.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-50 text-blue-700 rounded-md"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeRecipient(email, 'to')}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                <input
                  type="email"
                  value={currentRecipient}
                  onChange={(e) => setCurrentRecipient(e.target.value)}
                  onKeyDown={(e) => handleRecipientKeyDown(e, 'to')}
                  onPaste={(e) => handlePaste(e, 'to')}
                  onBlur={(e) => {
                    if (e.target.value.trim()) {
                      addRecipient(e.target.value, 'to');
                    }
                  }}
                  className="flex-1 min-w-[200px] outline-none bg-transparent"
                  placeholder="Add recipient (press Enter or paste emails)"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Press Enter or paste multiple emails separated by commas
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCcEnabled(!ccEnabled)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  {ccEnabled ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  Add CC
                </button>
                {ccEnabled && (
                  <div className="flex-1 flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    {ccRecipients.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-gray-50 text-gray-700 rounded-md"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => removeRecipient(email, 'cc')}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="email"
                      value={currentCc}
                      onChange={(e) => setCurrentCc(e.target.value)}
                      onKeyDown={(e) => handleRecipientKeyDown(e, 'cc')}
                      onPaste={(e) => handlePaste(e, 'cc')}
                      onBlur={(e) => {
                        if (e.target.value.trim()) {
                          addRecipient(e.target.value, 'cc');
                        }
                      }}
                      className="flex-1 min-w-[200px] outline-none bg-transparent"
                      placeholder="Add CC (press Enter or paste emails)"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBccEnabled(!bccEnabled)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  {bccEnabled ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  Add BCC
                </button>
                {bccEnabled && (
                  <div className="flex-1 flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    {bccRecipients.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-gray-50 text-gray-700 rounded-md"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => removeRecipient(email, 'bcc')}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="email"
                      value={currentBcc}
                      onChange={(e) => setCurrentBcc(e.target.value)}
                      onKeyDown={(e) => handleRecipientKeyDown(e, 'bcc')}
                      onPaste={(e) => handlePaste(e, 'bcc')}
                      onBlur={(e) => {
                        if (e.target.value.trim()) {
                          addRecipient(e.target.value, 'bcc');
                        }
                      }}
                      className="flex-1 min-w-[200px] outline-none bg-transparent"
                      placeholder="Add BCC (press Enter or paste emails)"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email subject"
              required
            />
          </div>

          {/* Attachments */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Attachments ({attachments.length}/{MAX_ATTACHMENTS})
                </label>
              </div>
              <button
                type="button"
                onClick={() => setAttachmentsEnabled(!attachmentsEnabled)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {attachmentsEnabled ? 'Hide' : 'Add Files'}
              </button>
            </div>

            {attachmentsEnabled && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      handleAttachments(e.target.files);
                      // Reset the input value to allow selecting the same file again
                      e.target.value = '';
                    }}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Choose Files
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    Max file size: {MAX_FILE_SIZE_MB}MB. Max {MAX_ATTACHMENTS} files total.
                    <br />
                    You can add {MAX_ATTACHMENTS - attachments.length} more file(s).
                  </p>
                </div>

                {uploading && (
                  <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                    <div className="animate-spin h-5 w-5 border-3 border-blue-500 rounded-full border-t-transparent"></div>
                    <span className="ml-3 text-sm text-blue-700">Uploading files...</span>
                  </div>
                )}

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Paperclip className="w-5 h-5 text-gray-400" />
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)}MB
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setAttachments(prev => prev.filter((_, i) => i !== index));
                            toast.success('File removed');
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview */}
          {showPreview && templateQuery?.design && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Preview</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: renderTemplateToHtml(templateQuery.design)
                  }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={(e) => {
                // Prevent form submission if validation fails
                if (!selectedTid) {
                  e.preventDefault();
                  toast.error("Please select a template");
                  return;
                }
                if (!subject.trim()) {
                  e.preventDefault();
                  toast.error("Please enter a subject");
                  return;
                }
                if (recipients.length === 0) {
                  e.preventDefault();
                  toast.error("Please add at least one recipient");
                  return;
                }
                if (!templateQuery?.design) {
                  e.preventDefault();
                  toast.error("Please wait for the template to load");
                  return;
                }
              }}
              title={
                !selectedTid ? "Please select a template" :
                !subject.trim() ? "Please enter a subject" :
                recipients.length === 0 ? "Please add at least one recipient" :
                !templateQuery?.design ? "Please wait for the template to load" :
                loading ? "Sending email..." : "Send email"
              }
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-3 border-white rounded-full border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Email
                </>
              )}
            </button>
          </div>
        </form>

        {/* Debug Info - Only visible in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg text-xs font-mono">
            <div>Template Selected: {selectedTid ? 'Yes' : 'No'}</div>
            <div>Subject: {subject.trim() ? 'Yes' : 'No'}</div>
            <div>Recipients: {recipients.length}</div>
            <div>Template Loaded: {templateQuery?.design ? 'Yes' : 'No'}</div>
            <div>Loading: {loading ? 'Yes' : 'No'}</div>
          </div>
        )}
      </div>
    </div>
  );
}

