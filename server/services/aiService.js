const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
const aiService = {
  // Generate blog title suggestions
  generateTitle: async (topic, keywords = []) => {
    const prompt = `Generate 3 engaging, SEO-friendly blog post titles about "${topic}".
${keywords.length > 0 ? `Include these keywords: ${keywords.join(', ')}` : ''}

Requirements:
- Titles should be catchy and click-worthy
- Keep them between 50-60 characters
- Make them specific and valuable

Return only the 3 titles, one per line, without numbering.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text.split('\n').filter(line => line.trim());
  },

  // Generate blog content
  generateContent: async (title, keywords = [], tone = 'professional') => {
    const prompt = `Write a comprehensive blog post with the title: "${title}"

${keywords.length > 0 ? `Focus on these keywords: ${keywords.join(', ')}` : ''}
Tone: ${tone}

Requirements:
- Write 400-600 words
- Include an engaging introduction
- Use clear headings and subheadings (<h2>, <h3>)
- Provide actionable insights
- End with a strong conclusion
- Use ONLY HTML body tags (<p>, <ul>, <li>, <strong>, <em>, etc.)
- DO NOT include <html>, <head>, <body>, or <!DOCTYPE> tags
- DO NOT use markdown formatting or code blocks (like \`\`\`html)
- Return ONLY the raw HTML content string

Write the complete blog post body:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    // Aggressive cleanup
    text = text.replace(/```html/g, '').replace(/```/g, '');
    text = text.replace(/<!DOCTYPE html>/gi, '');
    text = text.replace(/<html>/gi, '').replace(/<\/html>/gi, '');
    text = text.replace(/<head>[\s\S]*?<\/head>/gi, ''); // Remove entire head section
    text = text.replace(/<body>/gi, '').replace(/<\/body>/gi, '');

    return text.trim();
  },

  // Improve existing content
  improveContent: async (content) => {
    const prompt = `Improve the following blog post content while maintaining its core message:

${content}

Requirements:
- Enhance clarity and readability
- Fix any grammar or spelling issues
- Improve sentence structure
- Make it more engaging
- Keep the same approximate length
- Maintain existing HTML tags
- DO NOT include <html>, <head>, <body>, or <!DOCTYPE> tags
- DO NOT use markdown formatting or code blocks
- Return ONLY the raw HTML content string for the body

Return the improved content:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    // Aggressive cleanup
    text = text.replace(/```html/g, '').replace(/```/g, '');
    text = text.replace(/<!DOCTYPE html>/gi, '');
    text = text.replace(/<html>/gi, '').replace(/<\/html>/gi, '');
    text = text.replace(/<head>[\s\S]*?<\/head>/gi, ''); // Remove entire head section
    text = text.replace(/<body>/gi, '').replace(/<\/body>/gi, '');

    return text.trim();
  },

  // Suggest categories based on content
  suggestCategories: async (content, availableCategories = []) => {
    const categoriesList = availableCategories.length > 0
      ? `Choose from: ${availableCategories.join(', ')}`
      : 'Suggest appropriate categories';

    const prompt = `Based on this blog post content, suggest the most relevant category:

${content.substring(0, 500)}...

${categoriesList}

Return only ONE category name that best fits this content.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  }
};

module.exports = aiService;
