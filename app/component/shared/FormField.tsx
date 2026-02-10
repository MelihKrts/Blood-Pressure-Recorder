"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface FormFieldProps {
    id: string; name: string; label: string;
    type: "text" | "number" | "password" | "date" | "textarea";
    value: string; onChange: (e: any) => void;
    error?: string; min?: number; max?: string | number;
    maxLength?: number; step?: number; placeholder?: string;
}

export function FormField({ id, name, label, type, value, onChange, error, min, max, maxLength, step, placeholder }: FormFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    const commonProps = {
        id, name, value: value ?? "", onChange, maxLength, min, max, placeholder,
        className: `transition-all border-slate-200 focus:ring-2 focus:ring-blue-100 ${error ? "border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.1)]" : ""}`,
    };

    return (
        <div className="space-y-2 w-full">
            <Label htmlFor={id} className={`text-sm font-semibold ${error ? "text-red-500" : "text-slate-700"}`}>{label}</Label>
            <div className="relative">
                {type === "textarea" ? (
                    <textarea {...commonProps} rows={4} className={`${commonProps.className} w-full p-3 text-sm border rounded-lg resize-none outline-none`} />
                ) : (
                    <Input
                        {...commonProps}
                        type={type === "password" ? (showPassword ? "text" : "password") : type}
                        onInput={(e) => {
                            if (type === "number" && maxLength && e.currentTarget.value.length > maxLength) {
                                e.currentTarget.value = e.currentTarget.value.slice(0, maxLength);
                            }
                        }}
                        onWheel={(e) => type === "number" && e.currentTarget.blur()}
                    />
                )}
                {type === "password" && (
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            <div className="min-h-[20px]">{error && <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">{error}</p>}</div>
        </div>
    );
}