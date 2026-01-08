import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resizeImage } from "@/lib/imageUtils";
import MediaLibrary from "./MediaLibrary";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

const ImageUpload = ({ value, onChange, folder = "products" }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;

      // Upload to storage
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

      const originalSize = (file.size / 1024).toFixed(0);
      const newSize = (resizedBlob.size / 1024).toFixed(0);

      toast({
        title: "Image téléchargée",
        description: `Optimisée: ${originalSize} Ko → ${newSize} Ko`,
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

  const handleRemove = () => {
    setPreview("");
    onChange("");
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
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Aperçu"
            className="w-32 h-32 object-cover rounded-lg border border-border"
            onError={() => setPreview("")}
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 w-6 h-6"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

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
