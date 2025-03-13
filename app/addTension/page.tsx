// "use client"
// import {Input} from "@/components/ui/input";
// import React, {useState} from "react";
// import { Slide, toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.min.css";
//
// export default function AddTension() {
//     const [bigTension, setBigTension] = useState<number | string>("");
//     const [smallTension, setSmallTension] = useState<number | string>("");
//
//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//
//         if (!bigTension || Number(bigTension) < 1) {
//             toast.error("Please enter valid amount", {
//                 position: "top-right",
//                 theme: "colored",
//                 autoClose: 3000,
//                 closeOnClick: true,
//                 transition: Slide,
//             });
//             return;
//         }
//
//         try {
//             const response = await fetch("/api/tension", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     bigTension: Number(bigTension),
//                     smallTension: Number(smallTension),
//                 }),
//             });
//
//             const data = await response.json();
//
//             if (!response.ok) {
//                 throw new Error(data.message || "An error occurred");
//             }
//
//             toast.success("Tension information has been successfully saved", {
//                 position: "top-right",
//                 theme: "colored",
//                 autoClose: 3000,
//                 closeOnClick: true,
//                 transition: Slide,
//             });
//
//             setBigTension("");
//             setSmallTension("");
//
//         } catch (err) {
//             toast.error(err.message, {
//                 position: "top-right",
//                 theme: "colored",
//                 autoClose: 3000,
//                 closeOnClick: true,
//                 transition: Slide,
//             });
//         }
//     };
//
//     return (
//         <div className="@container">
//             <div className="flex items-center justify-center">
//                 <div className="w-1/2 py-4 flex flex-col">
//                     <form onSubmit={handleSubmit}>
//                         <label htmlFor="bigTension">Big Tension</label>
//
//                         <Input placeholder="bigTension" required type="number" min="1"
//                                onChange={(e) => setBigTension(Number(e.target.value) || "")}
//                                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a valid number")}
//                                value={bigTension}
//                                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}/>
//
//                         <label className="py-2">Small Tension</label>
//
//                         <Input placeholder="Enter a small tension"
//                                type="number"
//                                min="1"
//                                value={smallTension}
//                                onChange={(e) => setSmallTension(e.target.value.replace(/[^0-9]/g, ""))}
//                                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a valid number")}
//                                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
//                                required/>
//
//                         <button
//                             className="bg-[#28a745] text-white border-[#28a745] hover:bg-[#218838] border-[#1e7e34] rounded-md p-2 transition duration-150 hover:ease-in w-1/4 mx-auto my-4"
//                             type="submit"
//                         >
//                             Submit
//                         </button>
//                     </form>
//                     <ToastContainer />
//
//                 </div>
//
//             </div>
//         </div>
//     )
// }

"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.min.css";

export default function AddTension() {
    const [bigTension, setBigTension] = useState<number | string>("");
    const [smallTension, setSmallTension] = useState<number | string>("");

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
        <div className="flex items-center justify-center">
            <div className="w-1/2 py-4 flex flex-col">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="bigTension">Big Tension</label>
                    <Input
                        placeholder="bigTension"
                        required
                        type="number"
                        min="1"
                        onChange={(e) => setBigTension(Number(e.target.value) || "")}
                        value={bigTension}
                    />

                    <label className="py-2">Small Tension</label>
                    <Input
                        placeholder="Enter a small tension"
                        type="number"
                        min="1"
                        value={smallTension}
                        onChange={(e) => setSmallTension(Number(e.target.value) || "")}
                        required
                    />

                    <button
                        className="bg-[#28a745] text-white border-[#28a745] hover:bg-[#218838] border-[#1e7e34] rounded-md p-2 transition duration-150 hover:ease-in w-1/4 mx-auto my-4"
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}
