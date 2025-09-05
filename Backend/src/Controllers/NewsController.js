import axios from "axios";
import Parser from "rss-parser";
const parser = new Parser();

const getTopHeadlines = async (req, res) => {
  try {
    let { category, country, sources, language, pageSize = 20, page = 1 } = req.query;

    // Default: if no sources and no country provided, fallback to India
    if (!sources && !country) {
      country = "us";
    }

    // Validation: sources cannot be combined with country or category
    if (sources && (country || category)) {
      return res.status(400).json({
        success: false,
        message: "Cannot use 'sources' with 'country' or 'category' together",
      });
    }

    // Build request params
    const params = {
      apiKey: process.env.NEWS_API_KEY,
      pageSize: Math.min(pageSize, 100),
      page,
    };

    if (category) params.category = category;
    if (country) params.country = country;
    if (sources) params.sources = sources;
    if (language) params.language = language; // ✅ added language support

    const response = await axios.get(
      `${process.env.NEWS_API_BASE_URL}/top-headlines`,
      { params }
    );

    if (response.data.status !== "ok") {
      return res.status(400).json({
        success: false,
        message: response.data.message || "NewsAPI returned an error",
      });
    }

    return res.status(200).json({
      success: true,
      totalResults: response.data.totalResults || 0,
      articles: response.data.articles || [],
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
    let { qSearch = "General News", language="en", pageSize = 100, page = 1 } = req.query;

    const searchQuery = qSearch?.trim(); // keep spaces intact
    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: "qSearch parameter is required",
      });
    }

    const params = {
      apiKey: process.env.NEWS_API_KEY,
      pageSize: Math.min(Number(pageSize), 100),
      page: Number(page),
      q: searchQuery, // send raw string, do NOT encode
    };

    if (language) params.language = language;

    const response = await axios.get(
      `${process.env.NEWS_API_BASE_URL}/everything`,
      { params }
    );

    if (response.data.status === "error") {
      return res.status(400).json({
        success: false,
        message: response.data.message || "NewsAPI returned an error",
      });
    }

    return res.status(200).json({
      success: true,
      totalResults: response.data.totalResults,
      articles: response.data.articles,
    });
  } catch (error) {
    console.error("Error fetching Everything News:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Everything News",
    });
  }
};


const getGoogleNews = async (req, res) => {
  try {
    const {
      qSearch = "",
      categories = "",
      hl = "en-IN",
      gl = "IN",
      ceid = "IN:en",
    } = req.query;

    let searchQuery = qSearch.trim();
    if (categories) searchQuery += ` ${categories.trim()}`;

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: "qSearch cannot be empty",
      });
    }

    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
      searchQuery
    )}&hl=${hl}&gl=${gl}&ceid=${ceid}`;

    const response = await axios.get(rssUrl);
    const feed = await parser.parseString(response.data);

    // Map articles and fetch images from Pexels if needed
    const articles = await Promise.all(
      feed.items.map(async (item) => {
        const sourceName =
          (item.source && item.source._) || item.creator || item.author || "Unknown";

        const rawDescription =
          item.contentSnippet || item["content:encoded"] || item.description || "";
        const cleanDescription = rawDescription.replace(/<[^>]*>/g, "").trim();

        // Use enclosure/media:content if exists, otherwise fetch from Pexels
        let imageUrl =
          item.enclosure?.url || item["media:content"]?.url;

        if (!imageUrl) {
          // fallback to Pexels based on article title
         
          imageUrl = `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}`|| `https://robohash.org/${encodeURIComponent(item.title)}?size=600x400`;

        }

        return {
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          description: cleanDescription,
          sourceName,
          image: imageUrl,
        };
      })
    );

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


export default getGoogleNews;



export { getTopHeadlines, getEverythingNews, getGoogleNews };
