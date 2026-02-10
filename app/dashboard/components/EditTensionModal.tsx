"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {TensionForm} from "./TensionForm"

interface EditTensionModalProps {
    open: boolean
    onClose: () => void
    tension: any
    onUpdated: () => void
}

export function EditTensionModal({
                                     open,
                                     onClose,
                                     tension,
                                     onUpdated,
                                 }: EditTensionModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tansiyon Güncelle</DialogTitle>
                </DialogHeader>

                <TensionForm
                    mode="edit"
                    initialData={tension}
                    onSuccess={() => {
                        onUpdated()
                        onClose()
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}