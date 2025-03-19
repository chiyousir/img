import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

const MAX_FILES = 50;
const MAX_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files: File[] = [];
    const rotations: number[] = [];
    let quality = 'medium';

    // Extract files and their rotations from the form data
    for (let i = 0; i < MAX_FILES; i++) {
      const file = formData.get(`file-${i}`) as File | null;
      if (!file) break;
      
      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type not supported: ${file.type}. Only JPG, PNG and WebP are allowed.` },
          { status: 400 }
        );
      }
      
      // Check file size
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Maximum file size is 100MB.` },
          { status: 400 }
        );
      }
      
      files.push(file);
      
      const rotation = formData.get(`rotation-${i}`);
      rotations.push(rotation ? parseInt(rotation as string, 10) : 0);
    }

    // Get quality setting
    const qualitySetting = formData.get('quality');
    if (qualitySetting && ['low', 'medium', 'high'].includes(qualitySetting as string)) {
      quality = qualitySetting as string;
    }
    
    // Check if there are files to process
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }
    
    // Check if there are too many files
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: 'Too many files' }, { status: 400 });
    }
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    try {
      // Convert each image to a page in the PDF
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const rotation = rotations[i];
        
        try {
          // Read the file as ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();
          
          // Process the image with sharp
          const processedImageBuffer = await processImage(arrayBuffer, rotation, quality);
          
          // Get image dimensions
          const metadata = await sharp(processedImageBuffer).metadata();
          const { width = 0, height = 0 } = metadata;
          
          // Add a new page to the PDF with the image dimensions
          const page = pdfDoc.addPage([width, height]);
          
          // Convert the processed image to a format PDF can embed
          const jpgImage = await pdfDoc.embedJpg(processedImageBuffer);
          
          // Draw the image on the page
          page.drawImage(jpgImage, {
            x: 0,
            y: 0,
            width: width,
            height: height,
          });
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          return NextResponse.json(
            { error: `Failed to process file: ${file.name}` },
            { status: 500 }
          );
        }
      }
      
      // Save the PDF as bytes
      const pdfBytes = await pdfDoc.save();
      
      // Return the PDF as a response
      return new NextResponse(pdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=converted.pdf',
        },
      });
    } catch (pdfError) {
      console.error('Error creating PDF:', pdfError);
      return NextResponse.json(
        { error: 'Failed to create PDF document' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error converting images to PDF:', error);
    return NextResponse.json(
      { error: 'Failed to convert images to PDF' },
      { status: 500 }
    );
  }
}

async function processImage(
  imageBuffer: ArrayBuffer,
  rotation: number,
  quality: string
): Promise<Buffer> {
  try {
    let sharpInstance = sharp(imageBuffer);
    
    // Apply rotation if needed
    if (rotation !== 0) {
      sharpInstance = sharpInstance.rotate(rotation);
    }
    
    // Apply quality settings
    const qualityValue = getQualityValue(quality);
    
    // Convert to JPEG with the specified quality
    return sharpInstance
      .jpeg({ quality: qualityValue })
      .toBuffer();
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image');
  }
}

function getQualityValue(quality: string): number {
  switch (quality) {
    case 'low':
      return 60;
    case 'high':
      return 90;
    case 'medium':
    default:
      return 75;
  }
} 