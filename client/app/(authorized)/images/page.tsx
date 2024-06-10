"use client";

import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Scan from "@/components/Scan";  // Adjust the import path according to your project structure

const ImagesPage = () => {
    const router = useRouter();
    const authContext = useAuth();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    if (!authContext || !authContext.user) {
        router.push("/");
        return null;
    }

    const username = authContext.user.username;

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`http://localhost:8000/get-images?username=${username}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch images");
                }
                const data = await response.json();
                setImages(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchImages();
    }, [username]);

    const handleDelete = (imageId) => {
        // Implement the delete functionality here
        console.log(`Delete image with ID: ${imageId}`);
    };

    const handleReport = (imageId) => {
        // Implement the report functionality here
        console.log(`Report image with ID: ${imageId}`);
    };

    if (loading) {
        return <div className="w-screen h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const index = Math.ceil(images.length / 2);
    const firstHalf = images.slice(0, index);
    const secondHalf = images.slice(index);

    return (
        <div className="bg-black">
            <div className="h-[10vh] bg-black"></div> 
            <div className="flex flex-col items-center justify-center w-screen bg-black pb-20 text-white">
                <h1 className="text-2xl font-bold mb-4">Images for {username}</h1>
                <div className="w-3/5 flex flex-row space-x-4">
                    <div className="flex flex-col w-1/2 space-y-4">
                        {firstHalf.map((image) => (
                            <Scan
                                key={image.id}
                                fileurl={image.fileurl}
                                onDelete={() => handleDelete(image.id)}
                                onReport={() => handleReport(image.id)}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col w-1/2 space-y-4">
                        {secondHalf.map((image) => (
                            <Scan
                                key={image.id}
                                fileurl={image.fileurl}
                                onDelete={() => handleDelete(image.id)}
                                onReport={() => handleReport(image.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImagesPage;
