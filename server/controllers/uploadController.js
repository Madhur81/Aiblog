const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

exports.getAuth = (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    console.log('ImageKit auth response:', result);
    res.json(result);
  } catch (err) {
    console.error('ImageKit auth error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Server-side upload
exports.uploadImage = async (req, res) => {
  try {
    if (!req.body.file || !req.body.fileName) {
      return res.status(400).json({ message: 'File and fileName are required' });
    }

    const result = await imagekit.upload({
      file: req.body.file,
      fileName: req.body.fileName,
      tags: ["aiblog"]
    });

    console.log('Image uploaded successfully:', result.url);
    res.json({ url: result.url });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: error.message });
  }
};
