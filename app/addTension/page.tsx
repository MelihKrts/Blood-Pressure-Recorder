"use client"
import {Input} from "@/components/ui/input";
import {useState} from "react";

export default function AddTension() {
    const [bigTension, setBigTension] = useState("");
    const [smallTension, setSmallTension] = useState("");

    return (
        <div className="@container">
            <div className="flex items-center justify-center">
                <div className="w-1/2 py-4 flex flex-col">
                    <label htmlFor="bigTension">Big Tension</label>
                    <Input placeholder="bigTension" required type="number" min="1"
                           onChange={(e) => setBigTension(e.target.value.replace(/[^0-9]/g, ""))}
                           onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a valid number")}
                           value={bigTension}
                           onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}/>

                    <label className="py-2">Small Tension</label>

                    <Input placeholder="Enter a small tension"
                           type="number"
                           min="1"
                           value={smallTension}
                           onChange={(e) => setSmallTension(e.target.value.replace(/[^0-9]/g, ""))}
                           onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a valid number")}
                           onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                           required/>

                    <button
                        className="bg-[#28a745] text-white border-[#28a745] hover:bg-[#218838] border-[#1e7e34] rounded-md p-2 transition duration-150 hover:ease-in w-1/4 mx-auto my-4"
                        type="submit"
                    >
                        Submit
                    </button>
                </div>

            </div>
        </div>
    )
}