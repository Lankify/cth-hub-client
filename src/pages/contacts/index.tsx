import { FaUsers } from "react-icons/fa";
import { MdTravelExplore } from "react-icons/md";
import { Card, Button } from "../../components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface DashboardCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  onClick: () => void;
  badgeColor?: string;
  badgeText?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, icon, onClick, badgeColor, badgeText }) => (
  <Card width="w-full" className="flex flex-col justify-between p-6">
    <div className="flex flex-col flex-grow gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-txt">{title}</h3>
          <span className="text-3xl font-bold">{count}</span>
        </div>
        <div className="text-4xl text-primary-txt">{icon}</div>
      </div>

      {badgeText && (
        <div
          className={`inline-block rounded px-2 py-1 text-xs font-medium ${badgeColor || "bg-green-100 text-green-600"}`}
        >
          {badgeText}
        </div>
      )}
    </div>

    <div className="mt-4">
      <Button onClick={onClick} variant="secondary" className="w-full">
        View {title}
      </Button>
    </div>
  </Card>
);

const Contacts: React.FC = () => {
  const navigate = useNavigate();

  const [totalClients, setTotalClients] = useState<number>(0);
  const [newClients, setNewClients] = useState<number>(0);
  const [totalTravelAgents, setTotalTravelAgents] = useState<number>(0);
  const [newTravelAgents, setNewTravelAgents] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Travel Agents
        const travelAgentsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/travel-agents/find-all`);
        const allTravelAgents = travelAgentsRes.data;
        setTotalTravelAgents(allTravelAgents.length);

        const newTA = allTravelAgents.filter((agent: any) => new Date(agent.createdAt) > yesterday).length;
        setNewTravelAgents(newTA);

        // Clients
        const clientsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/clients/find-all`);
        const allClients = clientsRes.data;
        setTotalClients(allClients.length);

        const newCl = allClients.filter((client: any) => new Date(client.createdAt) > yesterday).length;
        setNewClients(newCl);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-semibold">CTH Contact Overview</h2>
      <p className="pb-4 text-secondary-txt text-md">
        Get a quick snapshot of all your contacts. Click "View" to explore detailed records and monitor recent activity.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Clients"
          count={loading ? 0 : totalClients}
          icon={<FaUsers />}
          badgeText={loading ? "Loading..." : `+${newClients} added in last 24h`}
          badgeColor="bg-green-100 text-green-600"
          onClick={() => navigate("/contacts/clients")}
        />

        <DashboardCard
          title="Travel Agents"
          count={loading ? 0 : totalTravelAgents}
          icon={<MdTravelExplore />}
          badgeText={loading ? "Loading..." : `+${newTravelAgents} added in last 24h`}
          badgeColor="bg-green-100 text-green-600"
          onClick={() => navigate("/contacts/travel-agents")}
        />
      </div>
    </div>
  );
};

export default Contacts;
