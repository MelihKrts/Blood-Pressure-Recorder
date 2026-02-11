import { ImageResponse } from "next/og";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0f172a, #020617)",
                    color: "white",
                    fontSize: 64,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                }}
            >
                Blood Pressure Record
            </div>
        ),
        size
    );
}
