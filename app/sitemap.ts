import {MetadataRoute} from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 1
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.9,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/register`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.9
        },
    ]
}