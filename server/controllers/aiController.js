const aiService = require('../services/aiService');

const aiController = {
  // Generate blog title
  generateTitle: async (req, res) => {
    try {
      const { topic, keywords } = req.body;

      if (!topic) {
        return res.status(400).json({ message: 'Topic is required' });
      }

      const titles = await aiService.generateTitle(topic, keywords || []);
      console.log('Generated titles:', titles);
      res.json({ titles });
    } catch (error) {
      console.error('Error generating title:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      res.status(500).json({ message: 'Failed to generate title', error: error.message });
    }
  },

  // Generate blog content
  generateContent: async (req, res) => {
    try {
      const { title, keywords, tone } = req.body;

      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }

      const content = await aiService.generateContent(title, keywords || [], tone || 'professional');
      res.json({ content });
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(500).json({ message: 'Failed to generate content', error: error.message });
    }
  },

  // Improve existing content
  improveContent: async (req, res) => {
    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ message: 'Content is required' });
      }

      const improved = await aiService.improveContent(content);
      res.json({ content: improved });
    } catch (error) {
      console.error('Error improving content:', error);
      res.status(500).json({ message: 'Failed to improve content', error: error.message });
    }
  },

  // Suggest category
  suggestCategory: async (req, res) => {
    try {
      const { content, availableCategories } = req.body;

      if (!content) {
        return res.status(400).json({ message: 'Content is required' });
      }

      const category = await aiService.suggestCategories(content, availableCategories || []);
      res.json({ category });
    } catch (error) {
      console.error('Error suggesting category:', error);
      res.status(500).json({ message: 'Failed to suggest category', error: error.message });
    }
  }
};

module.exports = aiController;
