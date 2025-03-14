"use client";

import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {Slide, toast, ToastContainer} from "react-toastify";


export default function AddTension() {
    const [bigTension, setBigTension] = useState<number | string>("");
    const [smallTension, setSmallTension] = useState<number | string>("");
    const [tensionData, setTensionData] = useState<{ bigTension: number; smallTension: number; _id: string }[]>([]);

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this tension data?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/tension?id=${id}`, {
                method: "DELETE",
            })
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

            fetchTensionData()

        }
        catch (err: any) {
            toast.error(err.message, {
                position: "top-right",
                theme: "colored",
                autoClose: 3000,
                closeOnClick: true,
                transition: Slide,
            });
        }
    }

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
        fetchTensionData(); // Sayfa yüklendiğinde verileri çek
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!bigTension || Number(bigTension) < 1) {
            toast.error("Please enter valid amount", {
                position: "top-right",
                theme: "colored",
                autoClose: 3000,
                closeOnClick: true,
                transition: Slide,
            });
            return;
        }

        try {
            const response = await fetch("/api/tension", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bigTension: Number(bigTension),
                    smallTension: Number(smallTension),
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

            setBigTension("");
            setSmallTension("");
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
            <div className="w-1/2 py-4 flex flex-col">
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
                        onInvalid={(e)=>(e.target as HTMLInputElement).setCustomValidity("Please enter a tension value")}
                        onInput={(e)=>(e.target as HTMLInputElement).setCustomValidity("")}
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
                        onInvalid={(e)=>(e.target as HTMLInputElement).setCustomValidity("Please enter a tension value")}
                        onInput={(e)=>(e.target as HTMLInputElement).setCustomValidity("")}

                    />

                    <button
                        className="bg-[#28a745] text-white border-[#28a745] hover:bg-[#218838] border-[#1e7e34] rounded-md cursor-pointer p-2 transition duration-150 hover:ease-in w-1/4 mx-auto my-4"
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
                <ToastContainer/>
            </div>

            <div className="w-1/2 bg-gray-100 p-4 rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-2">Recorded Tensions</h2>
                {tensionData.length === 0 ? (
                    <p>No records found.</p>
                ) : (
                    <ul className="space-y-2">
                        {tensionData.map((tension) => (
                            <li key={tension._id} className="bg-white p-2 rounded-md shadow-sm flex justify-between">
                                <span>Big: {tension.bigTension} - Small: {tension.smallTension}</span>
                                <button onClick={() => handleDelete(tension._id)} className="text-white text-center bg-[#dc3545] hover:bg-[#bb2d3b] transition duration-150 hover:ease-in rounded-md w-16 h-8 cursor-pointer ">Delete</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    );
}
