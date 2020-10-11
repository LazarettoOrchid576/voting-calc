import React, { useState, useEffect } from 'react';

import './App.css';

const App = () => {
  const [voteTypes, setVoteTypes] = useState([["Loading...", 1.0]]);
  const [votes, setVotes] = useState(0);
  const [guideurl, setGuideURL] = useState("http://nymillennials.rocks");
  const [seasonNumber, setSeasonNumber] = useState("?");
  const [voteTotals, setVoteTotals] = useState({});
  const colorH = 115;
  const colorS = 100;
  const maxL = 45;
  const minL = 15;
  const debug = false;

  const loadData = async () => {
    const config = await fetch(`${process.env.PUBLIC_URL}/config.json`);
    const configJson = await config.json();
    setVoteTypes(configJson.votetypes);
    setGuideURL(configJson.guideurl);
    setSeasonNumber(configJson.season);
  };

  useEffect(() => {
    loadData();
  }, [])

  useEffect(() => {
    let votesleft = votes;
    let pctleft = 1.0;
    const totals = {};
    voteTypes.forEach(([name, pct], idx) => {
      if (idx === voteTypes.length - 1) {
        totals[name] = votesleft;
      } else {
        debugger;
        const calculatedVotes = Math.round((pct / pctleft) * votesleft);
        totals[name] = calculatedVotes || Math.min(votesleft, 1);
        pctleft -= pct;
        votesleft -= totals[name]
      }
    });
    setVoteTotals(totals);
  }, [votes, voteTypes]);

  const getLValue = (val) => {
    return maxL - ((maxL - minL) * val);
  };

  return (
    <div className="container">
      <label>How many votes do you have?</label>
      <input id="votes" type="number" inputMode="numeric" pattern="[0-9]*" value={votes} onChange={e => setVotes(e.target.value)} />
      <br />
      <br />
      {voteTypes.map((votetype) => {
        return (
          <div key={votetype[0]} className="voteType" style={{ "backgroundColor": `hsl(${colorH}, ${colorS}%, ${getLValue(votetype[1])}%)` }}>
            {debug ?
              `${votetype[0]}: ${voteTotals[votetype[0]] ?? 0} votes - ${votes <= 0 ? (0).toFixed(2) : (((voteTotals[votetype[0]] ?? 0) / votes) * 100.0).toFixed(2)}%` :
              `${votetype[0]}: ${voteTotals[votetype[0]] ?? 0} votes`
            }
          </div>
        );
      })}
      <br />
    <div>Why these picks? <a target="_blank" rel="noopener noreferrer" href={guideurl}>{`Read Newt's awesome voting guide for Season ${seasonNumber}!`}</a></div>
    </div>
  )
};

export default App;
