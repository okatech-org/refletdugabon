import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LogOut,
  Package,
  Image,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Mail,
} from "lucide-react";

type Tab = "products" | "gallery" | "messages";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin/login");
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  // Products queries
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Gallery queries
  const { data: galleryImages, isLoading: galleryLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Messages queries
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Product mutations
  const saveProductMutation = useMutation({
    mutationFn: async (product: any) => {
      if (product.id) {
        const { error } = await supabase
          .from("products")
          .update(product)
          .eq("id", product.id);
        if (error) throw error;
      } else {
        const { id, ...productData } = product;
        const { error } = await supabase.from("products").insert(productData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
      setShowProductForm(false);
      toast({ title: "Produit enregistré !" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Produit supprimé" });
    },
  });

  // Gallery mutations
  const saveImageMutation = useMutation({
    mutationFn: async (image: any) => {
      if (image.id) {
        const { error } = await supabase
          .from("gallery_images")
          .update(image)
          .eq("id", image.id);
        if (error) throw error;
      } else {
        const { id, ...imageData } = image;
        const { error } = await supabase.from("gallery_images").insert(imageData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery_images"] });
      setEditingImage(null);
      setShowImageForm(false);
      toast({ title: "Image enregistrée !" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery_images"] });
      toast({ title: "Image supprimée" });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Administration</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
          >
            <Package className="w-4 h-4 mr-2" />
            Produits
          </Button>
          <Button
            variant={activeTab === "gallery" ? "default" : "outline"}
            onClick={() => setActiveTab("gallery")}
          >
            <Image className="w-4 h-4 mr-2" />
            Galerie
          </Button>
          <Button
            variant={activeTab === "messages" ? "default" : "outline"}
            onClick={() => setActiveTab("messages")}
          >
            <Mail className="w-4 h-4 mr-2" />
            Messages ({messages?.length || 0})
          </Button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Produits</h2>
              <Button
                onClick={() => {
                  setEditingProduct({
                    name: "",
                    description: "",
                    price: "",
                    category: "artisanat",
                    image_url: "",
                    in_stock: true,
                  });
                  setShowProductForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un produit
              </Button>
            </div>

            {showProductForm && editingProduct && (
              <ProductForm
                product={editingProduct}
                onSave={(p) => saveProductMutation.mutate(p)}
                onCancel={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                isLoading={saveProductMutation.isPending}
              />
            )}

            <div className="grid gap-4">
              {productsLoading ? (
                <p>Chargement...</p>
              ) : (
                products?.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card border border-border rounded-xl p-4 flex gap-4 items-center"
                  >
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <p className="text-primary font-bold">{Number(product.price).toFixed(2)} €</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductForm(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteProductMutation.mutate(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Galerie</h2>
              <Button
                onClick={() => {
                  setEditingImage({
                    title: "",
                    description: "",
                    image_url: "",
                    category: "agriculture",
                  });
                  setShowImageForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une image
              </Button>
            </div>

            {showImageForm && editingImage && (
              <ImageForm
                image={editingImage}
                onSave={(img) => saveImageMutation.mutate(img)}
                onCancel={() => {
                  setShowImageForm(false);
                  setEditingImage(null);
                }}
                isLoading={saveImageMutation.isPending}
              />
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryLoading ? (
                <p>Chargement...</p>
              ) : (
                galleryImages?.map((image) => (
                  <div
                    key={image.id}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                  >
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold">{image.title}</h3>
                      <p className="text-sm text-muted-foreground">{image.category}</p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingImage(image);
                            setShowImageForm(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteImageMutation.mutate(image.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Messages reçus</h2>
            <div className="grid gap-4">
              {messagesLoading ? (
                <p>Chargement...</p>
              ) : messages?.length === 0 ? (
                <p className="text-muted-foreground">Aucun message reçu.</p>
              ) : (
                messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-card border border-border rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">
                          {msg.first_name} {msg.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{msg.email}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary mb-2">{msg.subject}</p>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Form Component
const ProductForm = ({
  product,
  onSave,
  onCancel,
  isLoading,
}: {
  product: any;
  onSave: (p: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [form, setForm] = useState(product);

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{product.id ? "Modifier" : "Ajouter"} un produit</h3>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nom du produit"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Prix (€)</label>
          <Input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="artisanat">Artisanat</option>
            <option value="bijoux">Bijoux</option>
            <option value="textiles">Textiles</option>
            <option value="bons-cadeaux">Bons Cadeaux</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL Image</label>
          <Input
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description du produit"
            rows={3}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={() => onSave(form)} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

// Image Form Component
const ImageForm = ({
  image,
  onSave,
  onCancel,
  isLoading,
}: {
  image: any;
  onSave: (img: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [form, setForm] = useState(image);

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{image.id ? "Modifier" : "Ajouter"} une image</h3>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Titre de l'image"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="agriculture">Agriculture</option>
            <option value="culture">Culture</option>
            <option value="restaurant">Restaurant</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">URL Image</label>
          <Input
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description de l'image"
            rows={2}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={() => onSave(form)} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default Admin;
