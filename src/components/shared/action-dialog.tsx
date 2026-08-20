"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Check, Loader2 } from "lucide-react";

export interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "number" | "select" | "textarea" | "email";
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue?: string;
  required?: boolean;
}

interface ActionDialogProps {
  title: string;
  description: string;
  trigger?: React.ReactNode;
  fields: FieldConfig[];
  submitLabel?: string;
  onSuccessMessage?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ActionDialog({
  title,
  description,
  trigger,
  fields,
  submitLabel = "Save Record",
  onSuccessMessage,
  open: controlledOpen,
  onOpenChange,
}: ActionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);
      setFormData({});
      toast.success(onSuccessMessage || `${title} completed successfully!`);
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg max-w-[95vw] border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto px-1">
            {fields.map((field) => (
              <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
                <Label className="text-xs font-semibold">{field.label}</Label>
                {field.type === "select" ? (
                  <Select
                    value={formData[field.name] || field.defaultValue || ""}
                    onValueChange={(val) => val && handleChange(field.name, val)}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder={field.placeholder || "Select..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "textarea" ? (
                  <Textarea
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="h-20 resize-none text-xs"
                    required={field.required}
                  />
                ) : (
                  <Input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="h-9 text-xs"
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2 border-t border-border/50">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  {submitLabel}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
