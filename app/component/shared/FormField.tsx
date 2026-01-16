import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useState} from "react";
import {Eye, EyeOff} from "lucide-react"

interface FormFieldProps {
    id: string,
    label: string,
    type: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    required?: boolean,
    error?: string
}

export function FormField({id, label, type, value, onChange, required, error}: FormFieldProps) {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === "password"

    return (
        <div className="space-y-2">
            <Label className="space-y-2" htmlFor={id}>{label}</Label>
            <div className="relative">

                <Input id={id} type={isPassword ? (showPassword ? "text": "password"): type} required={required} value={value} onChange={onChange}
                       className={error ? "border-red-500" : ""}/>
                {isPassword && (
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                )}
            </div>
            {error && <p className="text-sm font-medium text-red-500 mt-1">{error}</p>}
        </div>
    )
}