export async function GET() {
  return new Response(
    'google.com, pub-6392082764157185, DIRECT, f08c47fec0942fa0\n',
    {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400',
      },
    }
  )
}
