# AI News Assistant

**AI News Assistant** is a full-stack, AI-powered news platform designed to provide users with intelligent and interactive news consumption. It leverages advanced AI capabilities to analyze news content, detect misinformation, summarize articles, translate content, and discover related news, while offering a robust backend for news aggregation, user management, and analytics.

---

## Features

### AI Backend Features
The AI backend powers all intelligent news analysis:

- **Fact-Checking**: Automatically verify the accuracy of news articles against multiple sources and provide reliability scores.  
- **Bias Detection**: Analyze the content to identify potential political, ideological, or regional bias.  
- **Summarization**: Generate concise summaries of long-form news articles for quick understanding.  
- **Translation**: Translate news articles into multiple languages for global accessibility.  
- **Related News Discovery**: Suggest relevant articles based on a submitted URL or topic for comprehensive coverage.  

### Backend Features
The backend supports core application functionality and data management:

- **News Aggregation**: Automatically fetch news from Google RSS feeds and News.org APIs.  
- **Save News**: Users can bookmark and save favorite articles for later reference.  
- **Profile Management**: Create, update, and manage user profiles, including preferences and activity.  
- **Stats & Analytics**: Track user activity, such as saved articles, searches, and reads, for insights and recommendations.  
- **Authentication & Authorization**: Secure registration, login, and role-based access control using JWT tokens.  

### Frontend Features
The React-based frontend offers an interactive and responsive user experience:

- Browse news feeds with AI-generated insights for every article.  
- Submit URLs or topics to fetch related articles quickly.  
- View results from fact-checking, bias detection, summarization, and translation.  
- Manage saved articles, view activity stats, and update user profiles.  
- Responsive UI built with Tailwind CSS, with interactive components, toast notifications, and smooth navigation.  

---

## Tech Stack

### Frontend
- React.js, Redux (state management)  
- Axios (API requests)  
- React-icons, Lucide-react, React-hot-toast  
- Tailwind CSS for responsive and modern UI  

### Backend
- Node.js / Express.js or FastAPI  
- REST APIs for communication with frontend  
- MongoDB for storing users, news, and analytics  

### AI Backend
- Groq, LangSmith for AI orchestration  
- FastAPI & Uvicorn for serving AI endpoints  
- LangChain for embeddings, RAG, and AI pipelines  
- AI modules for fact-checking, bias detection, summarization, translation, and related news  

### Authentication
- JWT-based authentication  
- Role-based authorization for secure access control  
