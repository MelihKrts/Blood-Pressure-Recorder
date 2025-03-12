import {FormEvent, useState} from "react";
// import axios from "axios";
// import {Slide, toast, ToastContainer} from "react-toastify";
import InputField from "../component/ui/InputField.tsx";
import ContentBox from "../component/ui/ContentBox.tsx";

const Content = () => {
    const [bigTension, setBigTension] = useState("");
    const [smallTension, setSmallTension] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            // .env dosyasındaki API URL'yi kullan
            const API_URL = import.meta.env.VITE_API_URL || 'https://pressure-recorder.vercel.app/api';


            const response = await fetch(`${API_URL}/tensions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bigTension: parseInt(bigTension),
                    smallTension: parseInt(smallTension)
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Veriler başarıyla kaydedildi!");
                setBigTension("");
                setSmallTension("");
            } else {
                setMessage(`Hata: ${data.message || 'Bir şeyler yanlış gitti'}`);
            }
        } catch (error: any) {
            setMessage(`Hata: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <ContentBox>
            <div className="container flex justify-center items-center flex-col">
                {message && <div className={`p-2 mb-4 rounded ${message.includes('Hata') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}

                <form onSubmit={handleSubmit} className="flex w-6/12 flex-col gap-2">
                    <label htmlFor="bigTension">Big Tension</label>
                    <InputField
                        placeholder="Enter a big tension"
                        type="number"
                        min="1"
                        value={bigTension}
                        onChange={(e) => setBigTension(e.target.value.replace(/[^0-9]/g, ""))}
                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a valid number")}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                        required
                    />

                    <label htmlFor="smallTension">Small Tension</label>
                    <InputField
                        placeholder="Enter a small tension"
                        type="number"
                        min="1"
                        value={smallTension}
                        onChange={(e) => setSmallTension(e.target.value.replace(/[^0-9]/g, ""))}
                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a valid number")}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                        required
                    />

                    <button
                        className="bg-[#28a745] text-white border-[#28a745] hover:bg-[#218838] border-[#1e7e34] rounded-md p-2 transition duration-150 hover:ease-in"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </form>

            </div>
        </ContentBox>
    );
};

export default Content;