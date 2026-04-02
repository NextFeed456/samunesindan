export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname !== "/thumb-proxy") {
      return new Response("Not Found", { status: 404 });
    }

    const videoId = url.searchParams.get("id");

    if (!videoId) {
      return new Response("Missing video id", { status: 400 });
    }

    const candidates = [
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    ];

    for (const candidate of candidates) {
      const response = await fetch(candidate, {
        cf: {
          cacheTtl: 86400,
          cacheEverything: true
        }
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type") || "image/jpeg";

        return new Response(response.body, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=86400"
          }
        });
      }
    }

    return new Response("Thumbnail not found", { status: 404 });
  }
};
