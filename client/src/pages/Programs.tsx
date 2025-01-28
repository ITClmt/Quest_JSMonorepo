import { useEffect, useState } from "react";
import "../styles/programs.css";

interface Program {
  id: number;
  title: string;
  poster: string;
  synopsis: string;
  country: string;
  year: number;
}

export default function Programs() {
  const [programs, setPrograms] = useState([] as Program[]);

  useEffect(() => {
    fetch("http://localhost:3310/api/programs")
      .then((response) => response.json())
      .then((data) => setPrograms(data));
  }, []);

  if (programs.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="programs-container">
      <h1 className="programs-title">Programs</h1>
      <div className="programs-grid">
        {programs.map((program) => (
          <div key={program.id} className="program-card">
            <h2 className="program-title">{program.title}</h2>
            <img src={program.poster} alt={program.title} width={200} />
            <p className="program-synopsis">{program.synopsis}</p>
            <div className="program-meta">
              <p>{program.country}</p>
              <p>{program.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
