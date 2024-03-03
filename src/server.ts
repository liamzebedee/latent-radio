const express = require('express');
const { createServer: createViteServer } = require('vite');

const Replicate = require("replicate");
if(process.env.REPLICATE_API_TOKEN === undefined) {
  throw new Error("Please set the REPLICATE_API_TOKEN environment variable");
}
const replicate = new Replicate({
    // get your token from https://replicate.com/account
    auth: process.env.REPLICATE_API_TOKEN,
});

async function newImage(req, res) {
  const imageURLs = await replicate.run(
    "fofr/latent-consistency-model:683d19dc312f7a9f0428b04429a9ccefd28dbf7785fef083ad5cf991b65f406f",
    {
      input: {
        // image: "https://replicate.delivery/pbxt/JlG0Efd2ubBp9yGnlOi7I9Se2rXnJSrPFogLf0YieKgjnWN6/download-6.png",
        width: 768,
        height: 768,
        prompt: req.query.prompt,
        num_images: 10,
        guidance_scale: 8,
        archive_outputs: false,
        prompt_strength: 0.45,
        sizing_strategy: "width/height",
        lcm_origin_steps: 50,
        canny_low_threshold: 100,
        num_inference_steps: 4,
        canny_high_threshold: 200,
        control_guidance_end: 1,
        control_guidance_start: 0,
        controlnet_conditioning_scale: 2
      }
    }
  );
  console.log(imageURLs);

  return res.json({ imageURLs });
}

async function createServer() {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: 'html' }
  });

  app.get('/images/new', newImage)

  app.use(vite.middlewares);

  app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
  });
}

createServer();
