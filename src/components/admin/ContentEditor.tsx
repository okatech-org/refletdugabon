import { useState, useEffect } from "react";
import { useSiteContent, useSaveBulkContent, PAGE_CONTENT_STRUCTURE, getContent } from "@/hooks/useSiteContent";
import type { FieldDef } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Save, FileText } from "lucide-react";

interface ContentEditorProps {
  pageKey: string;
}

const ContentEditor = ({ pageKey }: ContentEditorProps) => {
  const { toast } = useToast();
  const { data: content, isLoading } = useSiteContent(pageKey);
  const saveMutation = useSaveBulkContent();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);

  const pageConfig = PAGE_CONTENT_STRUCTURE[pageKey];

  // Set first section as active on page change
  useEffect(() => {
    if (pageConfig) {
      const firstSection = Object.keys(pageConfig.sections)[0];
      setActiveSection(firstSection || "");
    }
  }, [pageKey]);

  // Initialize form data from DB content, falling back to defaults
  useEffect(() => {
    if (content !== undefined && pageConfig) {
      const data: Record<string, string> = {};
      for (const [sectionKey, section] of Object.entries(pageConfig.sections)) {
        for (const field of section.fields) {
          const dbKey = `${sectionKey}.${field.key}`;
          const dbValue = getContent(content, sectionKey, field.key, "");
          data[dbKey] = dbValue || field.defaultValue || "";
        }
      }
      setFormData(data);
      setHasChanges(false);
    }
  }, [content, pageKey]);

  const handleFieldChange = (sectionKey: string, fieldKey: string, value: string) => {
    const dbKey = `${sectionKey}.${fieldKey}`;
    setFormData((prev) => ({ ...prev, [dbKey]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!pageConfig) return;

    const items = [];
    for (const [sectionKey, section] of Object.entries(pageConfig.sections)) {
      for (const field of section.fields) {
        const dbKey = `${sectionKey}.${field.key}`;
        const value = formData[dbKey];
        if (value !== undefined && value !== "") {
          items.push({
            page: pageKey,
            section: sectionKey,
            content_key: field.key,
            content_value: value,
            content_type: field.type,
          });
        }
      }
    }

    saveMutation.mutate(items, {
      onSuccess: () => {
        toast({ title: "Contenu enregistré !" });
        setHasChanges(false);
      },
      onError: (error: any) => {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      },
    });
  };

  if (!pageConfig) return <p>Page non trouvée</p>;
  if (isLoading) return <p>Chargement...</p>;

  const sectionEntries = Object.entries(pageConfig.sections);
  const currentSection = activeSection && pageConfig.sections[activeSection];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          {pageConfig.label}
        </h2>
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending || !hasChanges}
          className="bg-gradient-primary"
        >
          <Save className="w-4 h-4 mr-2" />
          {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {sectionEntries.map(([sectionKey, section]) => (
          <button
            key={sectionKey}
            onClick={() => setActiveSection(sectionKey)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === sectionKey
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Active section fields */}
      {currentSection && (
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-5">
          <h3 className="font-semibold text-foreground text-lg border-b border-border pb-3">
            {currentSection.label}
          </h3>

          {currentSection.fields.map((field: FieldDef) => {
            const dbKey = `${activeSection}.${field.key}`;
            const value = formData[dbKey] || "";

            return (
              <div key={field.key}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {field.label}
                </label>
                {field.type === "image" ? (
                  <ImageUpload
                    value={value}
                    onChange={(url) => handleFieldChange(activeSection, field.key, url)}
                    folder="content"
                  />
                ) : field.type === "rich_text" ? (
                  <RichTextEditor
                    value={value}
                    onChange={(val) => handleFieldChange(activeSection, field.key, val)}
                  />
                ) : (
                  <Input
                    value={value}
                    onChange={(e) => handleFieldChange(activeSection, field.key, e.target.value)}
                    placeholder={field.defaultValue || field.label}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
