"use client";

import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {Slide, toast, ToastContainer} from "react-toastify";
import jsPDF from "jspdf";
import {saveAs} from "file-saver";
import {Calendar} from "@/components/ui/calendar";

export default function AddTension() {
    const [bigTension, setBigTension] = useState<number | string>("");
    const [smallTension, setSmallTension] = useState<number | string>("");
    const [tensionData, setTensionData] = useState<{
        bigTension: number;
        smallTension: number;
        selectedDate: Date;
        pulse: number;
        _id: string
    }[]>([]);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [pulse, setPulse] = useState<number | string>("")

    const CleanForm = () => {
        setBigTension("")
        setSmallTension("")
        setPulse("")
        setSelectedDate(undefined)
    }

    const ValidateForm = () => {
        if (!bigTension || Number(bigTension) < 1) {
            toast.error("Please enter valid tension", {
                position: "top-right",
                theme: "colored",
                autoClose: 3000,
                closeOnClick: true,
                transition: Slide,
            });
            return false
        }

        if (!smallTension || Number(smallTension) < 1) {
            toast.error("Please enter valid tension", {
                position: "top-right",
                theme: "colored",
                autoClose: 3000,
                closeOnClick: true,
                transition: Slide,
            });
            return false
        }

        if (!pulse || Number(pulse) < 1) {
            toast.error("Please enter valid pulse", {
                position: "top-right",
                theme: "colored",
                autoClose: 3000,
                closeOnClick: true,
                transition: Slide,
            });
            return false
        }

        if (!selectedDate) {
            toast.error("Please select a date", {
                position: "top-right",
                theme: "colored",
                autoClose: 3000,
                closeOnClick: true,
                transition: Slide,
            });
            return false;
        }

        return true

    }

    const handleDownload = (format: "pdf" | "doc") => {
        const content = tensionData.map(t => `Big Tension: ${t.bigTension}, Small Tension: ${t.smallTension} Date: ${t.selectedDate} Pulse: ${t.pulse}`,).join("\n");
        const filename = "TensionData";

        if (format === "pdf") {
            const doc = new jsPDF();
            doc.text(content, 10, 10);
            doc.save(filename + ".pdf");
        } else {
            const blob = new Blob([content], {type: "application/msword"});
            saveAs(blob, filename + ".doc");
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this tension data?");
        if (!confirmDelete) return;

        setLoadingId(id);
        try {
            const response = await fetch(`/api/tension?id=${id}`, {method: "DELETE"});
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "An error occurred");
            }

            toast.success("Tension data deleted successfully", {
                position: "top-right",
                theme: "colored",
                autoClose: 3000,
                closeOnClick: true,
                transition: Slide,
            });

            setTensionData((prevData) => prevData.filter((item) => item._id !== id));
        } catch (err: any) {
            toast.error(err.message, {
                position: "top-right",
                theme: "colored",
                autoClose: 3000,
                closeOnClick: true,
                transition: Slide,
            });
        } finally {
            setLoadingId(null);
        }
    };


    const fetchTensionData = async () => {
        try {
            const response = await fetch("/api/tension")
            const data = await response.json();
            setTensionData(data.tension);
        } catch (error) {
            console.error("Error fetching tension data:", error);
        }
    }

    useEffect(() => {
        fetchTensionData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!ValidateForm()) return

        try {
            const response = await fetch("/api/tension", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bigTension: Number(bigTension),
                    smallTension: Number(smallTension),
                    selectedDate: selectedDate ? selectedDate.toISOString() : null,
                    pulse: Number(pulse),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "An error occurred");
            }

            toast.success("Tension information has been successfully saved", {
                position: "top-right",
                theme: "colored",
                autoClose: 3000,
                closeOnClick: true,
                transition: Slide,
            });

            CleanForm()
            fetchTensionData();

        } catch (err: any) {
            toast.error(err.message, {
                position: "top-right",
                theme: "colored",
                autoClose: 3000,
                closeOnClick: true,
                transition: Slide,
            });
        }
    };

    return (
        <div className="container flex-col flex items-center justify-center">
            <div className="w-1/2 max-sm:w-11/12 md:w-3/4 lg:w-1/2 py-4 flex flex-col">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="bigTension">Big Tension</label>
                    <Input
                        placeholder="Enter a big tension"
                        className="my-4 bg-white"
                        required
                        type="number"
                        min="1"
                        onChange={(e) => setBigTension(Number(e.target.value) || "")}
                        value={bigTension}
                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a tension value")}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                    />

                    <label className="py-2">Small Tension</label>
                    <Input
                        placeholder="Enter a small tension"
                        type="number"
                        className="my-4 bg-white"
                        min="1"
                        value={smallTension}
                        onChange={(e) => setSmallTension(Number(e.target.value) || "")}
                        required
                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a tension value")}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                    />

                    <label className="py-2 ">Date</label>

                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        required
                        className="border rounded-md my-4 bg-white w-fit max-sm:m-auto"
                    />


                    {selectedDate && (
                        <>
                            <label>Selected Date</label>
                            <div className="my-4 bg-blue-200  rounded-md"><p className="p-2">Selected
                                Date: {selectedDate.toLocaleDateString()}</p></div>
                        </>
                    )}

                    <label className="py-2">Pulse</label>

                    <Input type="number" placeholder="Enter a pulse number" min="1" className="my-4 bg-white"
                           value={pulse}
                           onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a pulse value")}
                           onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                           onChange={(e) => setPulse(Number(e.target.value) || "")}
                           required
                    />

                    <button
                        className="bg-[#28a745] text-white border-[#28a745] hover:bg-[#218838] border-[#1e7e34] rounded-md cursor-pointer p-2 transition duration-150 hover:ease-in w-1/4 sm:w-full md:w-1/2 lg:w-1/4 mx-auto my-4"
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
                <ToastContainer/>
            </div>

            <div className="w-1/2 max-sm:w-11/12 md:w-3/4 bg-gray-100 p-4 rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-2">Recorded Tensions</h2>
                {tensionData.length === 0 ? (
                    <p>No records found.</p>
                ) : (
                    <ul className="space-y-2">
                        {tensionData.map((tension) => (
                            <li key={tension._id} className="bg-white p-2 flex items-center rounded-md shadow-sm flex justify-between">
                                <span>
                                    Big: {tension.bigTension} - Small: {tension.smallTension} -
                                    Date: {new Date(tension.selectedDate).toLocaleDateString()} -
                                    Pulse: {tension.pulse}
                                </span>

                                <button
                                    onClick={() => handleDelete(tension._id)}
                                    className="text-white text-center bg-[#dc3545] hover:bg-[#bb2d3b] transition duration-150 hover:ease-in rounded-md w-24 h-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loadingId === tension._id}
                                >
                                    {loadingId === tension._id ? "Deleting..." : "Delete"}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => handleDownload("pdf")}
                        disabled={tensionData.length === 0}
                        className={`bg-blue-500 text-white p-2 rounded-md transition ${
                            tensionData.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                    >
                        Download as PDF
                    </button>
                    <button onClick={() => handleDownload("doc")}
                            disabled={tensionData.length === 0}
                            className={`bg-green-500 text-white p-2 rounded-md transition ${
                                tensionData.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
                    >Download as DOC
                    </button>
                </div>
            </div>

        </div>
    );
}