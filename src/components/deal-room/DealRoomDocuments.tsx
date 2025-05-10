"use client";

import { useState } from 'react';
import { DocumentInfo } from '@/lib/services/dealRoomService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { 
  Download, 
  File, 
  FileText, 
  FilePdf, 
  FileImage, 
  FileSpreadsheet, 
  FileArchive,
  Lock,
  Upload
} from 'lucide-react';
import { useApiMutation } from '@/hooks/useApi';

interface DealRoomDocumentsProps {
  documents: DocumentInfo[];
  dealRoomId: string;
  currentUserId: string;
  currentUserRole: 'founder' | 'investor';
}

export default function DealRoomDocuments({
  documents,
  dealRoomId,
  currentUserId,
  currentUserRole
}: DealRoomDocumentsProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConfidential, setIsConfidential] = useState(false);
  const [description, setDescription] = useState('');
  
  // Convert bytes to readable size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Get icon for file type
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) {
      return <FilePdf className="h-8 w-8 text-red-500" />;
    } else if (type.includes('image')) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    } else if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) {
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    } else if (type.includes('zip') || type.includes('rar')) {
      return <FileArchive className="h-8 w-8 text-purple-500" />;
    } else if (type.includes('text') || type.includes('doc')) {
      return <FileText className="h-8 w-8 text-blue-700" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };
  
  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };
  
  // Upload document mutation
  const uploadMutation = useApiMutation<DocumentInfo, FormData>(
    'post',
    `/api/deal-rooms/${dealRoomId}/documents`,
    {
      invalidateQueries: [[`/api/deal-rooms/${dealRoomId}`]],
      onSuccess: () => {
        setSelectedFile(null);
        setDescription('');
        setIsConfidential(false);
      }
    }
  );
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('description', description);
    formData.append('isConfidential', isConfidential.toString());
    
    uploadMutation.mutate(formData);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold mb-4">Shared Documents</h2>
        
        {documents.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No documents have been shared yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Upload documents to share with the other party
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 flex items-start space-x-4">
                    <div className="shrink-0">
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900 truncate">
                          {doc.name}
                        </h3>
                        {doc.isConfidential && (
                          <Lock className="h-4 w-4 ml-1 text-amber-500" />
                        )}
                      </div>
                      {doc.description && (
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {doc.description}
                        </p>
                      )}
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                        <span className="mx-2">•</span>
                        <span>{formatFileSize(doc.size)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t bg-gray-50 px-4 py-2 flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <a href={doc.url} download={doc.name} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Upload New Document</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            {selectedFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  {getFileIcon(selectedFile.type)}
                </div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  Change File
                </Button>
              </div>
            ) : (
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <Upload className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">Click to upload a file</p>
                  <p className="text-xs text-gray-500">PDF, Word, Excel, Images, etc.</p>
                </div>
              </label>
            )}
          </div>
          
          {selectedFile && (
            <>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <input 
                  type="text"
                  id="description"
                  className="w-full px-3 py-2 border rounded-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the document"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="confidential"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  checked={isConfidential}
                  onChange={(e) => setIsConfidential(e.target.checked)}
                />
                <label htmlFor="confidential" className="ml-2 text-sm text-gray-700">
                  Mark as confidential
                </label>
              </div>
              
              <Button 
                type="submit" 
                disabled={uploadMutation.isPending}
                className="w-full"
              >
                {uploadMutation.isPending ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full" />
                    Uploading...
                  </span>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}