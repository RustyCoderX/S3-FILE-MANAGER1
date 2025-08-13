/* 
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, FileText } from "lucide-react";

type S3Object = {
  Key: string;
  Size: number;
  LastModified: string;
};

type S3Response = {
  files: S3Object[];
  folder: string[];
};

export default function S3FileExplorer({ data }: { data: S3Response }) {
  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle>S3 Bucket Contents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.folder.length > 0 && (
            <div>
              <div className="font-semibold text-gray-700 mb-1">Folders</div>
              <ul>
                {data.folder.map((folder) => (
                  <li key={folder} className="flex items-center gap-2 text-blue-600">
                    <Folder className="w-5 h-5" />
                    {folder}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.files.length > 0 && (
            <div>
              <div className="font-semibold text-gray-700 mb-1">Files</div>
              <ul>
                {data.files.map((file) => (
                  <li key={file.Key} className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span className="flex-1">{file.Key}</span>
                    <span className="text-xs text-gray-400">
                      {(file.Size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(file.LastModified).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.files.length === 0 && data.folder.length === 0 && (
            <div className="text-gray-500 text-center">No files or folders found.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} */
/* 
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, FileText, Download } from "lucide-react";

type S3Object = {
  Key: string;
  Size: number;
  LastModified: string;
};

type S3Response = {
  files: S3Object[];
  folder: string[];
};

export default function S3FileExplorer({ data }: { data: S3Response }) {
  // Replace with your actual download logic or link
  const getDownloadUrl = (key: string) => `/api/download?key=${encodeURIComponent(key)}`;

  return (
    <Card className="max-w-xl w-full mx-auto mt-8 bg-white/70 backdrop-blur-md border border-gray-200 shadow-2xl transition-all animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          S3 Bucket Contents
        </CardTitle>
        <div className="text-sm text-gray-600 mt-1">Browse your files and folders stored in S3</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.folder.length > 0 && (
            <div>
              <div className="font-semibold text-gray-800 mb-1">Folders</div>
              <ul>
                {data.folder.map((folder) => (
                  <li
                    key={folder}
                    className="flex items-center gap-2 text-gray-800 hover:bg-gray-100 rounded px-2 py-1 cursor-pointer transition"
                  >
                    <Folder className="w-5 h-5 text-gray-500" />
                    <span className="hover:underline">{folder}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.files.length > 0 && (
            <div>
              <div className="font-semibold text-gray-800 mb-1">Files</div>
              <ul>
                {data.files.map((file) => (
                  <li
                    key={file.Key}
                    className="flex items-center gap-2 hover:bg-gray-100 rounded px-2 py-1 transition group"
                  >
                    <FileText className="w-5 h-5 text-gray-500" />
                    <a
                      href={getDownloadUrl(file.Key)}
                      className="flex-1 font-medium text-gray-900 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.Key}
                    </a>
                    <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                      <span className="font-semibold">Size:</span> {(file.Size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded ml-2">
                      <span className="font-semibold">Date:</span> {new Date(file.LastModified).toLocaleDateString()}
                    </span>
                    <a
                      href={getDownloadUrl(file.Key)}
                      className="ml-2 text-gray-500 hover:text-blue-600 transition"
                      title="Download"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.files.length === 0 && data.folder.length === 0 && (
            <div className="text-gray-500 text-center">No files or folders found.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} */

  

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, FileText, Download, ChevronDown, ChevronRight, Upload } from "lucide-react";

type S3Object = {
  Key: string;
  Size: number;
  LastModified: string;
};

type S3Response = {
  files: S3Object[];
  folder: string[];
};

type FolderState = {
  [folder: string]: {
    open: boolean;
    loading: boolean;
    data?: S3Response;
    error?: string;
  };
};

const getFolderName = (prefix: string) =>
  prefix.replace(/\/$/, "").split("/").pop() || prefix;

export default function S3FileExplorer({ data }: { data: S3Response }) {
  const [folders, setFolders] = useState<FolderState>({});
  const [rootData, setRootData] = useState<S3Response>(data);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    // Always fetch latest data on mount
    const fetchRootData = async () => {
      const res = await fetch("/api/objects");
      const newData = await res.json();
      setRootData(newData);
    };
    fetchRootData();
  }, []);

  const getDownloadUrl = (key: string) => `/api/download?key=${encodeURIComponent(key)}`;

  // Fetch root files/folders
  const fetchRootData = async () => {
    const res = await fetch("/api/objects");
    const newData = await res.json();
    setRootData(newData);
  };

  // Fetch folder contents
  const fetchFolderData = async (folder: string) => {
    const res = await fetch(`/api/objects?prefix=${encodeURIComponent(folder)}`);
    const folderData = await res.json();
    setFolders((prev) => ({
      ...prev,
      [folder]: { ...prev[folder], data: folderData, loading: false },
    }));
  };

  const handleToggleFolder = async (folder: string) => {
    setFolders((prev) => {
      const isOpen = prev[folder]?.open;
      return {
        ...prev,
        [folder]: { ...prev[folder], open: !isOpen, loading: !isOpen && !prev[folder]?.data },
      };
    });

    // Only fetch if not already loaded
    if (!folders[folder]?.data && !folders[folder]?.loading) {
      try {
        await fetchFolderData(folder);
      } catch (error: any) {
        setFolders((prev) => ({
          ...prev,
          [folder]: { ...prev[folder], error: error.message, loading: false },
        }));
      }
    }
  };

  // Upload handler (for folders or files)
  const handleUpload = async (key: string, file: File, folder?: string) => {
    setUploading(key);
    try {
      const res = await fetch(`/api/upload?key=${encodeURIComponent(key)}`);
      const { url } = await res.json();
      const putRes = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
      if (!putRes.ok) throw new Error("Upload failed");
      alert("Upload successful!");
      // Refresh contents
      if (folder) {
        await fetchFolderData(folder);
      } else {
        await fetchRootData();
      }
    } catch (e) {
      alert("Upload failed");
    } finally {
      setUploading(null);
    }
  };

  return (
    <Card className="max-w-2xl w-full mx-auto mt-8 bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-blue-600" />
          S3 File Explorer
        </CardTitle>
        <div className="text-sm text-gray-600 mt-1">
          Easily browse, upload, and download your files and folders.
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Folders */}
          {rootData.folder.length > 0 && (
            <div>
              <div className="font-semibold text-gray-800 mb-2 text-lg">Folders</div>
              <ul>
                {rootData.folder.map((folder) => {
                  const folderState = folders[folder] || { open: false, loading: false };
                  const inputId = `upload-input-${folder}`;
                  return (
                    <li key={folder} className="mb-2 flex flex-col">
                      <div className="flex items-center">
                        <button
                          className="flex items-center gap-2 text-gray-800 hover:bg-gray-100 rounded px-2 py-1 cursor-pointer transition w-full text-left"
                          onClick={() => handleToggleFolder(folder)}
                          type="button"
                        >
                          {folderState.open ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                          <Folder className="w-6 h-6 text-blue-500" />
                          <span className="hover:underline font-medium">{getFolderName(folder)}</span>
                        </button>
                        {/* Upload icon and input for folder */}
                        <label htmlFor={inputId} className="ml-2 cursor-pointer" title="Upload file to folder">
                          <Upload className="w-6 h-6 text-gray-500 hover:text-blue-600 transition" />
                          <input
                            id={inputId}
                            type="file"
                            className="hidden"
                            disabled={uploading === folder}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) await handleUpload(folder + file.name, file, folder);
                              e.target.value = ""; // reset input
                            }}
                          />
                        </label>
                        {uploading === folder && (
                          <span className="ml-2 text-xs text-blue-600 animate-pulse">Uploading...</span>
                        )}
                      </div>
                      {/* Accordion content */}
                      {folderState.open && (
                        <div className="ml-8 mt-2">
                          {folderState.loading && (
                            <div className="text-xs text-gray-500">Loading...</div>
                          )}
                          {folderState.error && (
                            <div className="text-xs text-red-500">{folderState.error}</div>
                          )}
                          {folderState.data && (
                            <>
                              {/* Nested folders */}
                              {folderState.data.folder.length > 0 && (
                                <div className="mb-2">
                                  <div className="font-semibold text-gray-700 text-sm mb-1">Subfolders</div>
                                  <ul>
                                    {folderState.data.folder
                                      .filter((subfolder) => subfolder !== folder)
                                      .map((subfolder) => {
                                        const subInputId = `upload-input-${subfolder}`;
                                        return (
                                          <li key={subfolder} className="flex items-center gap-2 text-gray-700 px-2 py-1">
                                            <Folder className="w-5 h-5 text-gray-400" />
                                            <span>{getFolderName(subfolder)}</span>
                                            {/* Upload icon and input for subfolder */}
                                            <label htmlFor={subInputId} className="ml-2 cursor-pointer" title="Upload file to subfolder">
                                              <Upload className="w-5 h-5 text-gray-500 hover:text-blue-600 transition" />
                                              <input
                                                id={subInputId}
                                                type="file"
                                                className="hidden"
                                                disabled={uploading === subfolder}
                                                onChange={async (e) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) await handleUpload(subfolder + file.name, file, folder);
                                                  e.target.value = ""; // reset input
                                                }}
                                              />
                                            </label>
                                            {uploading === subfolder && (
                                              <span className="ml-2 text-xs text-blue-600 animate-pulse">Uploading...</span>
                                            )}
                                          </li>
                                        );
                                      })}
                                  </ul>
                                </div>
                              )}
                              {/* Nested files */}
                              {folderState.data.files.length > 0 && (
                                <div>
                                  <div className="font-semibold text-gray-700 text-sm mb-1">Files</div>
                                  <ul>
                                    {folderState.data.files.map((file) => {
                                      const fileInputId = `upload-input-file-${file.Key}`;
                                      return (
                                        <li
                                          key={file.Key}
                                          className="flex items-center gap-2 hover:bg-gray-100 rounded px-2 py-1 transition group"
                                        >
                                          <FileText className="w-5 h-5 text-gray-400" />
                                          <a
                                            href={getDownloadUrl(file.Key)}
                                            className="flex-1 font-medium text-gray-900 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {file.Key}
                                          </a>
                                          <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                                            <span className="font-semibold">Size:</span>{" "}
                                            {(file.Size / 1024 / 1024).toFixed(2)} MB
                                          </span>
                                          <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded ml-2">
                                            <span className="font-semibold">Date:</span>{" "}
                                            {new Date(file.LastModified).toLocaleDateString()}
                                          </span>
                                          <a
                                            href={getDownloadUrl(file.Key)}
                                            className="ml-2 text-gray-500 hover:text-blue-600 transition"
                                            title="Download"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <Download className="w-5 h-5" />
                                          </a>
                                          {/* Upload icon and input for file */}
                                          <label htmlFor={fileInputId} className="ml-2 cursor-pointer" title="Upload new version">
                                            <Upload className="w-5 h-5 text-gray-500 hover:text-blue-600 transition" />
                                            <input
                                              id={fileInputId}
                                              type="file"
                                              className="hidden"
                                              disabled={uploading === file.Key}
                                              onChange={async (e) => {
                                                const newFile = e.target.files?.[0];
                                                if (newFile) await handleUpload(file.Key, newFile, folder);
                                                e.target.value = ""; // reset input
                                              }}
                                            />
                                          </label>
                                          {uploading === file.Key && (
                                            <span className="ml-2 text-xs text-blue-600 animate-pulse">Uploading...</span>
                                          )}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              )}
                              {folderState.data.files.length === 0 &&
                                (folderState.data.folder.filter((subfolder) => subfolder !== folder).length === 0) && (
                                  <div className="text-xs text-gray-500">No files or folders found.</div>
                                )}
                            </>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {/* Root Files */}
          {rootData.files.length > 0 && (
            <div>
              <div className="font-semibold text-gray-800 mb-2 text-lg">Files</div>
              <ul>
                {rootData.files.map((file) => {
                  const fileInputId = `upload-input-file-${file.Key}`;
                  return (
                    <li
                      key={file.Key}
                      className="flex items-center gap-2 hover:bg-gray-100 rounded px-2 py-1 transition group"
                    >
                      <FileText className="w-5 h-5 text-gray-500" />
                      <a
                        href={getDownloadUrl(file.Key)}
                        className="flex-1 font-medium text-gray-900 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.Key}
                      </a>
                      <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                        <span className="font-semibold">Size:</span> {(file.Size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded ml-2">
                        <span className="font-semibold">Date:</span> {new Date(file.LastModified).toLocaleDateString()}
                      </span>
                      <a
                        href={getDownloadUrl(file.Key)}
                        className="ml-2 text-gray-500 hover:text-blue-600 transition"
                        title="Download"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                      {/* Upload icon and input for file */}
                      <label htmlFor={fileInputId} className="ml-2 cursor-pointer" title="Upload new version">
                        <Upload className="w-5 h-5 text-gray-500 hover:text-blue-600 transition" />
                        <input
                          id={fileInputId}
                          type="file"
                          className="hidden"
                          disabled={uploading === file.Key}
                          onChange={async (e) => {
                            const newFile = e.target.files?.[0];
                            if (newFile) await handleUpload(file.Key, newFile);
                            e.target.value = ""; // reset input
                          }}
                        />
                      </label>
                      {uploading === file.Key && (
                        <span className="ml-2 text-xs text-blue-600 animate-pulse">Uploading...</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {rootData.files.length === 0 && rootData.folder.length === 0 && (
            <div className="text-gray-500 text-center">No files or folders found.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}