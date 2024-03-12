import Navbar from "@/components/Navbar";

export default function DemoPage() {
    return (
        <div>
            <Navbar />
            <div className="bg-white1 flex items-center justify-center">
                <iframe
                    width={1200}
                    height={800}
                    src="https://calendly.com/tryeducado"
                ></iframe>
            </div>
        </div>
    );
}
