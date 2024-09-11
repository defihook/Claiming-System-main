import type { NextPage } from "next";
import { useRouter } from "next/router";
const Home: NextPage = () => {
  const router = useRouter();
  return (
    <main>
      <div className="main-page-home">
        <div className="list">
          <button className="btn-link" onClick={() => router.push("/claim")}>
            Claim $MAJ
          </button>
          <button className="btn-link">Stake $MAJ</button>
        </div>
      </div>
    </main>
  );
};

export default Home;
