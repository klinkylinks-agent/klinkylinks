import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Upload as UploadIcon, 
  File, 
  Image, 
  Video, 
  X, 
  CheckCircle,
  AlertCircle 
} from "lucide-react";

interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  id: string;
}

export default function Upload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchUsernames, setSearchUsernames] = useState<string[]>(["", "", ""]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Mutation for uploading files
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('searchUsernames', JSON.stringify(searchUsernames.filter(u => u.trim())));
      
      return await apiRequest("POST", "/api/content/upload", formData);
    },
    onSuccess: (data, file) => {
      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded and is now being processed for monitoring.`,
      });
      queryClient.invalidateQueries(["/api/content"]);
      setFiles(prev => prev.map(f => 
        f.file === file ? { ...f, status: 'completed' as const, progress: 100 } : f
      ));
    },
    onError: (error, file) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 1000);
      } else {
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}. Please try again.`,
          variant: "destructive",
        });
        setFiles(prev => prev.map(f => 
          f.file === file ? { ...f, status: 'error' as const } : f
        ));
      }
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload files",
        variant: "destructive",
      });
      return;
    }

    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 0,
      status: 'uploading' as const,
      id: Math.random().toString(36).substr(2, 9),
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    // Start actual upload for each file
    newFiles.forEach((uploadFile) => {
      uploadMutation.mutate(uploadFile.file);
    });
  }, [user, uploadMutation, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to upload first.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Upload Successful",
        description: `${files.length} file(s) uploaded and protection monitoring started.`,
      });
      
      setFiles([]);
      setTitle("");
      setDescription("");
      setSearchUsernames(["", "", ""]);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={20} />;
    if (fileType.startsWith('video/')) return <Video size={20} />;
    return <File size={20} />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-neon-green" size={16} />;
      case 'error':
        return <AlertCircle className="text-hot-pink" size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Upload Content</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Protect your creative work with automated monitoring across all major platforms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dropzone */}
          <Card className="gradient-border">
            <div className="gradient-border-inner p-8">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-electric-blue bg-electric-blue/5'
                    : 'border-gray-600 hover:border-electric-blue'
                }`}
              >
                <input {...getInputProps()} />
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="text-gray-400 mb-4">
                  or click to browse your computer
                </p>
                <p className="text-sm text-gray-500">
                  Supports: Images (JPG, PNG, GIF) and Videos (MP4, AVI, MOV)
                  <br />
                  Maximum file size: 100MB
                </p>
                <Button className="btn-electric mt-4">
                  Choose Files
                </Button>
              </div>
            </div>
          </Card>

          {/* File List */}
          {files.length > 0 && (
            <Card className="gradient-border">
              <div className="gradient-border-inner p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Uploaded Files ({files.length})
                </h3>
                <div className="space-y-4">
                  {files.map((uploadFile) => (
                    <div
                      key={uploadFile.id}
                      className="flex items-center space-x-4 p-4 bg-charcoal/50 rounded-lg border border-gray-700"
                    >
                      {/* File Preview/Icon */}
                      <div className="flex-shrink-0">
                        {uploadFile.preview ? (
                          <img
                            src={uploadFile.preview}
                            alt="Preview"
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                            {getFileIcon(uploadFile.file.type)}
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {uploadFile.file.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        
                        {/* Progress Bar */}
                        {uploadFile.status === 'uploading' && (
                          <Progress 
                            value={uploadFile.progress} 
                            className="mt-2 h-2"
                          />
                        )}
                      </div>

                      {/* Status */}
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(uploadFile.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadFile.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Metadata Form */}
        <div className="space-y-6">
          <Card className="gradient-border">
            <div className="gradient-border-inner p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Content Details
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter content title"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your content"
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={files.length === 0 || isUploading}
                  className="w-full btn-electric"
                >
                  {isUploading ? 'Uploading...' : 'Start Protection'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Username Search Enhancement */}
          <Card className="gradient-border">
            <div className="gradient-border-inner p-6">
              <h3 className="text-xl font-bold gradient-text mb-2">
                Search Enhancement
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Add up to 3 usernames to help guide searches and improve detection accuracy
              </p>
              
              <div className="space-y-3">
                {searchUsernames.map((username, index) => (
                  <div key={index} className="relative">
                    <Label 
                      htmlFor={`username-${index}`} 
                      className="text-gray-300 text-sm font-medium block mb-1"
                    >
                      Username {index + 1} {index === 0 && <span className="text-electric-blue">(recommended)</span>}
                    </Label>
                    <div className="relative group">
                      <Input
                        id={`username-${index}`}
                        type="text"
                        value={username}
                        onChange={(e) => {
                          const newUsernames = [...searchUsernames];
                          newUsernames[index] = e.target.value;
                          setSearchUsernames(newUsernames);
                        }}
                        placeholder={`@username${index + 1}`}
                        className="morphing-card bg-charcoal border-gray-600 text-white placeholder-gray-400 focus:border-electric-blue transition-all duration-300 group-hover:border-electric-blue/50"
                        maxLength={50}
                      />
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-electric-blue/10 to-hot-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-electric-blue/10 border border-electric-blue/30 rounded-lg">
                <p className="text-electric-blue text-xs leading-relaxed">
                  <strong>Pro Tip:</strong> Add usernames where your content might appear to enhance search accuracy. 
                  Our AI will use these to refine monitoring across Google Images, Videos, and Bing.
                </p>
              </div>
            </div>
          </Card>

          {/* Upload Tips */}
          <Card className="gradient-border">
            <div className="gradient-border-inner p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Protection Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="text-neon-green flex-shrink-0 mt-0.5" size={16} />
                  <span>Higher resolution images provide better detection accuracy</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="text-neon-green flex-shrink-0 mt-0.5" size={16} />
                  <span>Add detailed descriptions to improve monitoring</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="text-neon-green flex-shrink-0 mt-0.5" size={16} />
                  <span>Monitoring begins immediately after upload</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="text-neon-green flex-shrink-0 mt-0.5" size={16} />
                  <span>You'll receive alerts for any violations found</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
