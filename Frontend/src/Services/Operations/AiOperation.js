import { AiEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { setLoading } from "../../Slice/authSlice";
import toast from "react-hot-toast";

const {
  PARAGRAPH_SUMMARIZER_API,
  BULLETS_SUMMARIZER_API,
  HIGHLIGHT_SUMMARIZER_API,
  TRANSLATE_API,
  GENERATE_NEWS_ARTICLE_API,
  FETCH_NEWS_ARTICLES_API,
  BIAS_DETECTION_API,
  FACT_CHECK_NEWS_API,
} = AiEndpoints;

function createAIAction(endpoint, successMessage) {
  return (formData, token) => {
    return async (dispatch) => {
      const toastBar = toast.loading("Loading...");
      dispatch(setLoading(true));

      try {
        const response = await apiConnector("POST", endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data || !response.data.success) {
          throw new Error(response.data?.message || "Unknown error occurred");
        }

        toast.dismiss(toastBar);
        toast.success(successMessage);

        return response.data;
      } catch (error) {
        toast.dismiss(toastBar);
        console.error(`${endpoint} ERROR`, error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    };
  };
}

export const paragraphSummarizer = createAIAction(
  PARAGRAPH_SUMMARIZER_API,
  "Paragraph summarization successful"
);

export const bulletPointSummarizer = createAIAction(
  BULLETS_SUMMARIZER_API,
  "Bullet-point summarization successful"
);

export const highlightSummarizer = createAIAction(
  HIGHLIGHT_SUMMARIZER_API,
  "Highlight summarization successful"
);

export const translate = createAIAction(
  TRANSLATE_API,
  "Translation successful"
);

export const generateNewsArticle = createAIAction(
  GENERATE_NEWS_ARTICLE_API,
  "News article generated successfully"
);

export const fetchNews = createAIAction(
  FETCH_NEWS_ARTICLES_API,
  "Fetched latest news articles"
);

export const factCheckNews = createAIAction(
  FACT_CHECK_NEWS_API,
  "Fact check completed"
);

export const biasDetection = createAIAction(
  BIAS_DETECTION_API,
  "Bias detection completed"
);
