require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    console.log('Fetching available models...\n');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log('Available models:');
    console.log('='.repeat(80));

    if (data.models) {
      data.models.forEach(model => {
        console.log(`\n✓ ${model.name}`);
        console.log(`  Display Name: ${model.displayName || 'N/A'}`);
        console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      });

      console.log('\n' + '='.repeat(80));
      console.log(`Total models: ${data.models.length}`);

      // Find models that support generateContent
      const contentModels = data.models.filter(m =>
        m.supportedGenerationMethods?.includes('generateContent')
      );

      console.log(`\nModels supporting generateContent:`);
      contentModels.forEach(m => {
        console.log(`  - ${m.name.replace('models/', '')}`);
      });
    }

  } catch (error) {
    console.error('Error listing models:', error.message);
  }
}

listModels();
