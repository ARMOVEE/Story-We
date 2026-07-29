import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('audio') as Blob | null;

        if (!file) {
            return NextResponse.json({ error: 'No audio file found' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Define path to public/uploads directory
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        
        // Ensure directory exists
        try {
            await mkdir(uploadsDir, { recursive: true });
        } catch (err) {
            console.error('Error creating uploads directory', err);
        }

        // Generate filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `doa-${timestamp}.webm`;
        const filepath = path.join(uploadsDir, filename);

        // Write file to disk
        await writeFile(filepath, buffer);

        console.log(`Audio saved successfully to ${filepath}`);

        return NextResponse.json({ success: true, filename, url: `/uploads/${filename}` });
    } catch (error) {
        console.error('Error uploading audio:', error);
        return NextResponse.json({ error: 'Failed to upload audio' }, { status: 500 });
    }
}
