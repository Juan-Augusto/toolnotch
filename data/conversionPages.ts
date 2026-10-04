import type { SupportedFormat } from '@/lib/imageTypes'

export interface ConversionPageConfig {
  slug: string
  h1: string
  metaTitle: string
  metaDescription: string
  defaultFormat: SupportedFormat
  faq: Array<{ q: string; a: string }>
}

export const conversionPages: ConversionPageConfig[] = [
  {
    slug: 'compress-jpg-online',
    h1: 'Compress JPG Online Free — No Upload to Server',
    metaTitle: 'Compress JPG Online Free — No Signup Required',
    metaDescription:
      'Reduce your JPG file size by up to 90% instantly in your browser. No signup, no upload — 100% private and free.',
    defaultFormat: 'jpg',
    faq: [
      {
        q: 'Will compressing my JPG reduce quality?',
        a: 'At 70–85% quality, most JPGs lose no visible quality while shrinking by 50–70%. You can preview the result before downloading.',
      },
      {
        q: 'Is my JPG uploaded to a server?',
        a: 'No. All processing happens entirely in your browser using the Canvas API. Your image never leaves your device.',
      },
      {
        q: 'How small can I make a JPG?',
        a: 'Typically 50–90% smaller depending on content and quality setting. Photos compress more than graphics.',
      },
      {
        q: 'What is the maximum file size?',
        a: 'We recommend files under 20MB for best performance. Larger files may take longer to process.',
      },
      {
        q: 'Can I change the dimensions while compressing?',
        a: 'Yes — set a max width in the settings and the image will be resized proportionally before compression.',
      },
    ],
  },
  {
    slug: 'compress-png-online',
    h1: 'Compress PNG Online Free — No Upload to Server',
    metaTitle: 'Compress PNG Online Free — No Signup Required',
    metaDescription:
      'Reduce your PNG file size instantly in your browser. Lossless-style compression with no upload — 100% private and free.',
    defaultFormat: 'png',
    faq: [
      {
        q: 'Can I compress a PNG without losing transparency?',
        a: 'Yes. PNG supports transparency and our tool preserves it. For the smallest file with transparency, consider converting to WebP.',
      },
      {
        q: 'Is my PNG uploaded to a server?',
        a: 'No. All processing happens in your browser. Your image never leaves your device.',
      },
      {
        q: 'Why is my compressed PNG larger than the original?',
        a: "PNG compression varies by image content. Images with many colors or gradients may not compress well. Try converting to WebP for better results.",
      },
      {
        q: 'Should I use PNG or WebP?',
        a: 'WebP offers better compression than PNG for most images. If browser compatibility is a concern, PNG is safer.',
      },
      {
        q: 'What is the maximum file size?',
        a: 'We recommend files under 20MB for best performance.',
      },
    ],
  },
  {
    slug: 'convert-jpg-to-png',
    h1: 'Convert JPG to PNG Online Free',
    metaTitle: 'Convert JPG to PNG Online Free — No Signup',
    metaDescription:
      'Convert JPG images to PNG format instantly in your browser. Lossless PNG output with transparency support.',
    defaultFormat: 'png',
    faq: [
      {
        q: 'Why convert JPG to PNG?',
        a: 'PNG is lossless, making it better for images that need editing, logos, or images with text. JPG degrades with each re-save.',
      },
      {
        q: 'Will the PNG be larger than my JPG?',
        a: 'Usually yes — PNG is lossless and typically larger. But the quality will be preserved perfectly without JPEG artifacts.',
      },
      {
        q: 'Can I get a transparent background?',
        a: "Converting a JPG to PNG does not automatically remove the background. JPGs don't contain transparency data.",
      },
      {
        q: 'Is my image uploaded to a server?',
        a: 'No. Conversion runs entirely in your browser.',
      },
      {
        q: 'What quality setting should I use?',
        a: "Quality settings don't affect PNG output — PNG is always lossless regardless of the slider.",
      },
    ],
  },
  {
    slug: 'convert-webp-to-jpg',
    h1: 'Convert WebP to JPG Online Free',
    metaTitle: 'Convert WebP to JPG Online Free — No Signup',
    metaDescription:
      'Convert WebP images to JPG format instantly in your browser. No upload required — 100% private and free.',
    defaultFormat: 'jpg',
    faq: [
      {
        q: 'Why convert WebP to JPG?',
        a: "JPG has wider compatibility with older software, email clients, and apps that don't support WebP yet.",
      },
      {
        q: 'Will I lose quality converting WebP to JPG?',
        a: 'Some quality loss occurs since JPG is lossy. Use 85–95% quality to minimize the difference.',
      },
      {
        q: 'Is my image uploaded to a server?',
        a: 'No. Conversion happens entirely in your browser.',
      },
      {
        q: 'Can I convert multiple WebP files at once?',
        a: 'Currently one file at a time. Batch conversion is coming soon.',
      },
      {
        q: 'What file size should I expect?',
        a: 'JPG files are usually similar to or slightly larger than WebP files at equivalent quality settings.',
      },
    ],
  },
  {
    slug: 'convert-png-to-jpg',
    h1: 'Convert PNG to JPG Online Free',
    metaTitle: 'Convert PNG to JPG Online Free — No Signup',
    metaDescription:
      'Convert PNG images to JPG format instantly in your browser. Smaller file sizes with adjustable quality.',
    defaultFormat: 'jpg',
    faq: [
      {
        q: 'Why convert PNG to JPG?',
        a: 'JPG files are much smaller than PNG for photos. Use PNG for graphics with text or transparency; use JPG for photographs.',
      },
      {
        q: 'Will transparency be preserved?',
        a: "No. JPG doesn't support transparency. Transparent areas will be filled with white.",
      },
      {
        q: 'What quality should I use?',
        a: '80–85% quality produces excellent results with significantly smaller file sizes than 100%.',
      },
      {
        q: 'Is my image uploaded to a server?',
        a: 'No. Everything runs in your browser.',
      },
      {
        q: 'Can I control the output file size?',
        a: 'Yes — lower the quality slider or set a max width to reduce the output file size.',
      },
    ],
  },
  {
    slug: 'compress-webp-online',
    h1: 'Compress WebP Online Free — No Upload to Server',
    metaTitle: 'Compress WebP Online Free — No Signup Required',
    metaDescription:
      'Reduce WebP file size instantly in your browser. No upload required — 100% private and free.',
    defaultFormat: 'webp',
    faq: [
      {
        q: 'Can I compress a WebP file without converting it?',
        a: 'Yes — select WebP as the output format and adjust the quality slider to reduce file size while keeping the WebP format.',
      },
      {
        q: 'Is my image uploaded to a server?',
        a: 'No. All processing runs in your browser.',
      },
      {
        q: 'How much smaller will my WebP be?',
        a: 'Depending on the original quality and content, you can typically reduce WebP size by 20–60%.',
      },
      {
        q: 'What quality setting should I use for WebP?',
        a: '75–85% is a good balance between quality and file size for most use cases.',
      },
      {
        q: 'What is the maximum file size?',
        a: 'We recommend files under 20MB for best performance.',
      },
    ],
  },
]
