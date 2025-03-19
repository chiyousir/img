# Image to PDF Converter

A modern web application that allows users to convert multiple images to a single PDF file with ease.

## Features

- **Simple Interface**: Clean and intuitive user interface
- **Multiple File Upload**: Support for uploading up to 50 images at once
- **Drag and Drop**: Easy drag and drop functionality for file uploading
- **Image Preview**: Preview uploaded images before conversion
- **Image Management**: Rearrange, delete, and rotate images
- **Quality Settings**: Choose between low, medium, and high PDF quality
- **Responsive Design**: Works well on both desktop and mobile devices
- **Multilingual Support**: Available in both English and Chinese

## Technical Stack

### Frontend
- Next.js with App Router
- TypeScript
- Tailwind CSS
- react-dropzone for file uploads
- @dnd-kit for drag-and-drop sorting
- @headlessui/react for accessible UI components
- next-intl for internationalization

### Backend
- Next.js API Routes
- sharp for image processing
- pdf-lib for PDF generation

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/image-to-pdf.git
   cd image-to-pdf
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

The application can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/yourusername/image-to-pdf)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-dropzone](https://react-dropzone.js.org/)
- [dnd kit](https://dndkit.com/)
- [pdf-lib](https://pdf-lib.js.org/)
- [sharp](https://sharp.pixelplumbing.com/)
- [next-intl](https://next-intl-docs.vercel.app/)
