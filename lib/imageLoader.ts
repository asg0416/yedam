export default function supabaseLoader({
    src,
    width,
    quality,
}: {
    src: string;
    width: number;
    quality?: number;
}) {
    // If the image is not from Supabase, return as is
    if (!src.includes('supabase.co')) {
        return src;
    }

    // If already a render/image URL, just append params
    if (src.includes('/render/image/')) {
        return `${src}?width=${width}&quality=${quality || 75}`;
    }

    // Transform standard Storage URL to Render URL
    // From: .../storage/v1/object/public/bucket/path/to/image.jpg
    // To:   .../storage/v1/render/image/public/bucket/path/to/image.jpg
    const renderUrl = src.replace('/object/public/', '/render/image/public/');

    return `${renderUrl}?width=${width}&quality=${quality || 75}`;
}
