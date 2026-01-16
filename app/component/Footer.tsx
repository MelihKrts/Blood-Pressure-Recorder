export function Footer() {
    const time = new Date();
    let currentYear = time.getFullYear()
    return(
        <footer className="w-full bg-[#1F2937]">
            <div className="container flex justify-center items-center">
                <p className="text-white py-2">{currentYear} Tüm hakları saklıdır.</p>
            </div>
        </footer>
    )
}