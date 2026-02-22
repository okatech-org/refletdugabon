import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resizeImage, createThumbnail } from "@/lib/imageUtils";
import MediaLibrary from "./MediaLibrary";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onThumbnailChange?: (url: string) => void;
  folder?: string;
  generateThumbnail?: boolean;
}

const ImageUpload = ({ 
  value, 
  onChange, 
  onThumbnailChange,
  folder = "products",
  generateThumbnail = false 
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [showLibrary, setShowLibrary] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Sync preview when value prop changes (e.g., form data loaded from DB)
  useEffect(() => {
    setPreview(value);
  }, [value]);

  const processFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB before resize)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 10 Mo",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Resize image for optimization
      const resizedBlob = await resizeImage(file, 1200, 1200, 0.85);
      
      // Generate unique filename
      const baseFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const fileName = `${folder}/${baseFileName}.jpg`;

      // Upload main image to storage
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, resizedBlob, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      setPreview(publicUrl);
      onChange(publicUrl);

      // Generate and upload thumbnail if enabled
      if (generateThumbnail && onThumbnailChange) {
        const thumbnailBlob = await createThumbnail(file, 300, 0.8);
        const thumbnailFileName = `${folder}/thumbnails/${baseFileName}-thumb.jpg`;

        const { error: thumbError } = await supabase.storage
          .from("images")
          .upload(thumbnailFileName, thumbnailBlob, {
            contentType: "image/jpeg",
            cacheControl: "3600",
            upsert: false,
          });

        if (!thumbError) {
          const { data: thumbUrlData } = supabase.storage
            .from("images")
            .getPublicUrl(thumbnailFileName);
          onThumbnailChange(thumbUrlData.publicUrl);
        }
      }

      const originalSize = (file.size / 1024).toFixed(0);
      const newSize = (resizedBlob.size / 1024).toFixed(0);

      toast({
        title: "Image téléchargée",
        description: `Optimisée: ${originalSize} Ko → ${newSize} Ko${generateThumbnail ? " + thumbnail" : ""}`,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur de téléchargement",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }, []);

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (onThumbnailChange) {
      onThumbnailChange("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLibrarySelect = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setPreview(e.target.value);
          }}
          placeholder="URL de l'image..."
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowLibrary(true)}
          title="Bibliothèque média"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Télécharger"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors text-center cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Téléchargement...</p>
          </div>
        ) : preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Aperçu"
              className="max-w-full max-h-40 object-contain rounded-lg"
              onError={() => setPreview("")}
            />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 w-6 h-6"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className={`w-8 h-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-sm text-muted-foreground">
              {isDragging ? "Déposez l'image ici" : "Glissez une image ou cliquez pour parcourir"}
            </p>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <MediaLibrary
        open={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelect={handleLibrarySelect}
        folder={folder}
      />
    </div>
  );
};

export default ImageUpload;
