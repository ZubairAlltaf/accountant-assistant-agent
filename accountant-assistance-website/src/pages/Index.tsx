
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Loading FinPal...</h1>
        <p className="text-xl text-gray-600">Your friendly finance assistant</p>
      </div>
    </div>
  );
};

export default Index;
