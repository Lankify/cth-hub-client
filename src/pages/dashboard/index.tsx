import { FiUsers, FiHome, FiBox, FiUserCheck } from "react-icons/fi";
import * as theme from "../../theme";
import { Card } from "../../components";

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2 className={theme.text["main-title"]}>Welcome back, Enuka</h2>
      <p className={theme.text["sub-title"]}>Let's get started! Here's what’s happening across your dashboard today.</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Customers */}
        <Card title="Customers" icon={<FiUsers />} width="w-full" height="h-36">
          <div className="flex items-center justify-between mt-4">
            <span className="text-4xl font-bold">1,245</span>
            <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded">+12% growth</span>
          </div>
        </Card>

        {/* Hotels */}
        <Card title="Hotels" icon={<FiHome />} width="w-full" height="h-36">
          <div className="flex items-center justify-between mt-4">
            <span className="text-4xl font-bold">218</span>
            <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded">+5 added</span>
          </div>
        </Card>

        {/* Inventory */}
        <Card title="Inventory" icon={<FiBox />} width="w-full" height="h-36">
          <div className="flex items-center justify-between mt-4">
            <span className="text-4xl font-bold">74</span>
            <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded">-2 expired</span>
          </div>
        </Card>

        {/* Users */}
        <Card title="Users" icon={<FiUserCheck />} width="w-full" height="h-36">
          <div className="flex items-center justify-between mt-4">
            <span className="text-4xl font-bold">912</span>
            <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded">Active</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
