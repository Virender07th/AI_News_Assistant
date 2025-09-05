import React , {useEffect} from "react";
import { TrendingUp, Eye, Shield, Bot, FileText } from "lucide-react";
import { useDispatch , useSelector } from "react-redux";
import { fetchUserActivity } from "../../Service/Operations/ProfileAPI";

// const recentActivity = [
//   { title: "AI in Education.", type:"Video", status:"Completed", date: "Generated on: 2024-07-21" },
//   { title: "Notes",type:"Video", status:"Completed", date: "Generated on: 2024-07-21" },
//   { title: "Student Data",type:"Video", status:"Completed", date: "Generated on: 2024-07-21" },
//   { title: "Presentation",type:"Video", status:"Completed", date: "Generated on: 2024-07-21" },
//   { title: "Classroom",type:"Video", status:"Completed", date: "Generated on: 2024-07-21" },
//   { title: "Research",type:"Video", status:"Completed", date: "Generated on: 2024-07-21" },
//   { title: "Research",type:"Video", status:"Completed", date: "Generated on: 2024-07-21" },
//   { title: "Research",type:"Video", status:"Completed", date: "Generated on: 2024-07-21" },
//   { title: "Research",type:"Video", status:"Completed", date: "Generated on: 2024-07-21" },
//   { title: "Research",type:"Video", status:"Completed", date: "Generated on: 2024-07-21" },
// ];

const detailCard = [
  { 
    title: "Total News Today", 
    number: "1234", 
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600"
  },
  { 
    title: "Latest News", 
    number: "5", 
    icon: TrendingUp,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-600"
  },
  { 
    title: "All News", 
    number: "12", 
    icon: Shield,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600"
  },
  { 
    title: "News Video Generation", 
    number: "13", 
    icon: Eye,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600"
  },
  // { 
  //   title: "Summary", 
  //   number: "10", 
  //   icon: Bot,
  //   color: "from-indigo-500 to-indigo-600",
  //   bgColor: "bg-indigo-50",
  //   textColor: "text-indigo-600"
  // },
  // { 
  //   title: "Multilingual Translator", 
  //   number: "10", 
  //   icon: Bot,
  //   color: "from-indigo-500 to-indigo-600",
  //   bgColor: "bg-indigo-50",
  //   textColor: "text-indigo-600"
  // },
];

const MainDashboard = () => {
  const dispatch = useDispatch();
  const { activities = [] } = useSelector((state) => state.dashboard || {}); // fallback
  const { loading } = useSelector((state) => state.auth || {});
  const token = localStorage.getItem("token");
  const userName = useSelector((state) => state.profile?.user?.userName || "User");

  console.log("token" , token);
  

  useEffect(() => {
    if (token) {
      dispatch(fetchUserActivity(token));
    }
  }, [dispatch, token]);

  console.log("activity" , activities);
  
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Welcome Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Welcome back, {userName}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Here's what's happening with your AI news today
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {detailCard.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className={`group relative overflow-hidden ${card.bgColor} rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  <div
                    className={`p-3 rounded-full ${card.bgColor} ring-2 ring-white shadow-md`}
                  >
                    <IconComponent className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 leading-tight">
                      {card.title}
                    </h3>
                    <p className={`text-3xl font-bold ${card.textColor} mt-1`}>
                      {card.number}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>
            );
          })}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200/50">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
            <p className="text-sm text-gray-600 mt-1">
              Latest updates from your AI news system
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr className="border-b border-gray-200/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <p className="text-gray-500 text-sm">Loading activities...</p>
                    </td>
                  </tr>
                ) : activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50/50 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                          <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                            {activity.title || "Untitled"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                          {activity.type || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                          {activity.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {activity.date || activity.createdAt || "No date"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">
                          No recent activity found.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;