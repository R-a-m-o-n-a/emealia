import { useEffect, useState } from 'react';
import './App.css';
import { TestHarness } from "./test/TestHarness";
import { getUserId } from "./utils/user/getUserId";

function App() {
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getUserId()
            .then((id) => setUserId(id))
            .catch((err) => {
                console.error('Failed to resolve user session:', err);
                setError(err.message || 'Authentication error');
            });
    }, []);

    if (error) {
        return <div>Error initializing session: {error}</div>;
    }

    if (!userId) {
        return <div>Loading session...</div>;
    }

    return <TestHarness userId={userId} />;
}

export default App;
