import React, { ReactNode } from "react";
import { Label } from "~/components/ui/label";
import { ParsedField, Renderable } from "./types";
import { useTranslation } from "react-i18next";

const DISABLED_LABELS = ["boolean", "object", "array"];

interface FieldWrapperProps {
  label: Renderable<ReactNode>;
  error?: Renderable<ReactNode>;
  children: ReactNode;
  id: string;
  field: ParsedField;
}

export function FieldWrapper({
  label,
  children,
  id,
  field,
  error,
}: FieldWrapperProps) {
  const { t } = useTranslation();
  const isDisabled = DISABLED_LABELS.includes(field.type);

  return (
    <div className="space-y-2">
      {!isDisabled && (
        <Label htmlFor={id}>
          {t(`table.${label}`)}
          {field.required && <span className="text-destructive"> *</span>}
        </Label>
      )}
      {children}
      {field.fieldConfig?.description && (
        <p className="text-sm text-muted-foreground">
          {field.fieldConfig.description}
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
