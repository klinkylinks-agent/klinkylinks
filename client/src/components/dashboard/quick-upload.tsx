import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, Image, Video } from "lucide-react";

export default function QuickUpload() {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      toast({
        title: "Files Ready",
        description: `${acceptedFiles.length} file(s) selected. Redirecting to upload page...`,
      });
      // In a real app, this would navigate to upload page or process files
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
    },
    maxFiles: 5,
  });

  const handleBrowseClick = () => {
    toast({
      title: "Upload Ready",
      description: "Opening file browser...",
    });
  };

  return (
    <Card className="gradient-border">
      <div className="gradient-border-inner p-6">
        <h3 className="text-xl font-bold mb-4 text-white">Quick Upload</h3>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-electric-blue bg-electric-blue/5'
              : 'border-gray-600 hover:border-electric-blue'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
          <p className="text-gray-300 mb-2 text-sm">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-gray-500 text-xs mb-3">or click to browse</p>
          
          <Button 
            onClick={handleBrowseClick}
            className="bg-electric-blue text-white text-sm font-semibold hover:bg-electric-blue/80 transition-colors"
          >
            Choose Files
          </Button>
        </div>
        
        {/* Supported Formats */}
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Image size={12} />
            <span>Images</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Video size={12} />
            <span>Videos</span>
          </div>
          <span>•</span>
          <span>Max 50MB</span>
        </div>
      </div>
    </Card>
  );
}
