import {
  FaBrain,
  FaGlobeAmericas,
  FaCheckCircle,
  FaBalanceScale,
  FaRegNewspaper,
  FaFire,
  FaComments,
  FaBug,
  FaSearchPlus,
  FaLink,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { BiNews } from "react-icons/bi";
import { MdOutlineFactCheck } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import AiNewsAnchor from "../assets/AiNewsAnchor.png";
import AiJournalist from "../assets/AiJournalist.png";
import AskAIThings from "../assets/AskAIThings.png";

export const featuresData = [
  {
    title: "AI Article Summarization",
    description: "Summarize lengthy news articles into concise bullet points with AI.",
    icon: FaBrain,
    color: "bg-purple-600",
  },
  {
    title: "Multilingual Translation",
    description: "Read any article in 20+ languages with context-aware translation.",
    icon: FaGlobeAmericas,
    color: "bg-green-100",
  },
  {
    title: "Fact Verification Agents",
    description: "Cross-check facts using autonomous agents and trusted sources.",
    icon: FaCheckCircle,
    color: "bg-yellow-100",
  },
  {
    title: "Bias Analyzer",
    description: "Detect political or emotional bias to help you form an unbiased view.",
    icon: FaBalanceScale,
    color: "bg-blue-600",
  },
  {
    title: "Multi-Perspective Rewriting",
    description: "See how different ideologies interpret the same news — left, right, neutral.",
    icon: FaRegNewspaper,
    color: "bg-indigo-500",
  },
  {
    title: "Trending Topics Detector",
    description: "Catch global breaking stories in real-time using AI trend detection.",
    icon: FaFire,
    color: "bg-rose-600",
  },
  {
    title: "Tone Translator",
    description: "Make any news sound formal, friendly, serious, casual, or optimistic.",
    icon: FaComments,
    color: "bg-orange-500",
  },
  {
    title: "Misinformation Detector",
    description: "Automatically flag fake or misleading content with AI safeguards.",
    icon: FaBug,
    color: "bg-red-100",
  },
  {
    title: "Semantic Search (RAG)",
    description: "Search across your documents using vector search and RAG-based reasoning.",
    icon: FaSearchPlus,
    color: "bg-teal-600",
  },
  {
    title: "Source Traceability",
    description: "Trace every fact back to its original source with full link visibility.",
    icon: FaLink,
    color: "bg-gray-100",
  },
];

export const mainFeatures = [
  {
    title: "Ask AI Anything",
    description: "Ask real-time questions about any article and get instant, contextual answers.",
    image: AskAIThings,
  },
  {
    title: "AI Journalist Agents",
    description: "Generate complete, factual news stories from raw sources using AI agents.",
    image: AiJournalist,
  },
  {
    title: "AI News Anchor (Video & Audio)",
    description: "Convert articles into engaging video and voice formats powered by avatars.",
    image: AiNewsAnchor,
  },
];


export const workFlowData = [
  {
    title: "Fetch News from Trusted Sources",
    description: "Gathering news from reputable sources worldwide",
    icon: FiSearch,
  },
  {
    title: "Generate Article via Web + LLM",
    description: "Utilizing web data and large language models to create comprehensive articles",
    icon: BiNews,
  },
  {
    title: "Run Agents (Bias , Fact Check , Rewrite)",
    description: "Employing AI agents to analyze and refine content for accuracy and impartiality.",
    icon: MdOutlineFactCheck,
  },
  {
    title: "Deliver Insightful Content",
    description: "Providing you with clear, concise and verified news.",
    icon: AiOutlineCheckCircle,
  },
];
