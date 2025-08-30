import axios from "axios";
import Parser from "rss-parser";
const parser = new Parser();

const getTopHeadlines = async (req, res) => {
  try {
    const { category, country, sources, pageSize = 20, page = 1 } = req.query;

    if (sources && (country || category)) {
      return res.status(400).json({
        success: false,
        message: "Cannot use 'sources' with 'country' or 'category' together",
      });
    }
    const params = {
      apiKey: process.env.NEWSORG_API_KEY,
      pageSize,
      page,
    };

    if (category) params.category = category;
    if (country) params.country = country;
    if (sources) params.sources = sources;

    const response = await axios.get(
      `${process.env.NEWS_API_BASE_URL}/top-headlines`,
      { params }
    );

    if (!response.data) {
      return res.status(502).json({
        success: false,
        message: "Error fetching data from NewsAPI",
      });
    }
    return res.status(200).json({
      success: true,
      totalResults: response.data.totalResults,
      articles: response.data.articles,
    });
  } catch (error) {
    console.error("Error fetching top headlines:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Top Headlines",
    });
  }
};

const getEverythingNews = async (req, res) => {
  try {
    const {
      qSearch,
      from,
      to,
      sortBy,
      sources,
      language,
      pageSize = 100,
      page = 1,
    } = req.query;

    const params = {
      apiKey: process.env.NEWSORG_API_KEY,
      pageSize,
      page,
    };

    if (qSearch) params.q = qSearch;
    if (from) params.from = from;
    if (to) params.to = to;
    if (sortBy) params.sortBy = sortBy;
    if (sources) params.sources = sources;
    if (language) params.language = language;

    const response = await axios.get(
      `${process.env.NEWS_API_BASE_URL}/everything`,
      { params }
    );

    if (!response.data) {
      return res.status(502).json({
        success: false,
        message: "Error fetching data from NewsAPI",
      });
    }
    return res.status(200).json({
      success: true,
      totalResults: response.data.totalResults,
      articles: response.data.articles,
    });
  } catch (error) {
    console.error("Error fetching Everythings News :", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Everything",
    });
  }
};

const getGoogleNews = async (req, res) => {
  try {
    const newsCategories = [
      "Business", "Technology", "Science", "Health", "Entertainment", "Sports",
      "World", "Politics", "Environment", "Education", "Lifestyle", "Travel",
      "Food", "Automobile", "Military", "Crime", "Opinion"
    ];

    const {
      qSearch = "AI",
      categories, // optional, comma-separated
      hl = "en-IN",
      gl = "IN",
      ceid = "IN:en",
    } = req.query;

    let searchQuery = qSearch.trim().replace(/\s+/g, "-");

    if (categories) {
      const categoryList = categories.split(",").map(c => c.trim());
      const validCategories = categoryList.filter(c => newsCategories.includes(c));
      if (validCategories.length) {
        // Combine categories with OR for RSS search
        searchQuery += " " + validCategories.map(c => `"${c}"`).join(" OR ");
      }
    }

    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
      searchQuery
    )}&hl=${hl}&gl=${gl}&ceid=${ceid}`;

    const response = await axios.get(rssUrl);
    const feed = await parser.parseString(response.data);

    const articles = feed.items.map(item => {
      const sourceName =
        (item.source && item.source._) ||
        item.creator ||
        item.author ||
        "Unknown";

      const rawDescription =
        item.contentSnippet || item["content:encoded"] || item.description || "";
      const cleanDescription = rawDescription.replace(/<[^>]*>/g, "").trim();

      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: cleanDescription,
        sourceName,
      };
    });

    return res.status(200).json({
      success: true,
      totalResults: articles.length,
      articles,
    });
  } catch (error) {
    console.error("Error fetching Google News:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Google News",
    });
  }
};


export { getTopHeadlines, getEverythingNews, getGoogleNews };
