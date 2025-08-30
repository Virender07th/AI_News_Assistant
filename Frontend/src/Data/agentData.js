import NewsImage from "../assets/NewsImage.png";
import FactChecker from "../assets/FactChecker.png";
import biasDetection from "../assets/biasDetection.png";
import summaries from "../assets/summeries.png";
import translator from "../assets/translator.png";
import trendTopic from "../assets/trendTopic.png";

export const aiJournalistagentData = [
  {
    heading: "News Fetch & Scrape Agent",
    content:
      "Automatically fetch and scrape real-time headlines from trusted news websites and RSS feeds, ensuring continuous news flow for analysis and generation.",
    image: NewsImage,
    route: "/news-fetch",
  },
  {
    heading: "Fact-Checking Agent",
    content:
      "Verify the accuracy of news claims by cross-referencing multiple reputable sources and APIs to detect misinformation or inconsistencies.",
    image: FactChecker,
    route: "/fact-check",
  },
  {
    heading: "Bias Detection Agent",
    content:
      "Analyze articles for tone, sentiment, and political bias using NLP techniques, helping identify ideological slants or unfair reporting.",
    image: biasDetection,
    route: "/bias-detection",
  },
  {
    heading: "Summary Agent",
    content:
      "Generate concise and readable summaries of long news articles using extractive or abstractive summarization powered by LLMs.",
    image: summaries,
    route: "/summary-generation",
  },
  {
    heading: "Multilingual Translator Agent",
    content:
      "Translate news content into multiple languages while preserving context and tone, enabling global accessibility and understanding.",
    image: translator,
    route: "/translator",
  },
];
