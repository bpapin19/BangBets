// import React, {useContext, useState, useEffect} from 'react';
// import ActiveBets from '../components/ActiveBets';

// const BetContext = React.createContext();

// export function useBetContext() {
//     return useContext(BetContext);
// }

// export function ActiveBetProvider({children}) {
//     const [globalBetList, setGlobalBetList] = useState([]);
//     const [success, setSuccess] = useState("");
//     const [error, setError] = useState("");
//     var globalArray = [];

//     function addBetToGlobal(bet) {
//         globalArray = globalBetList.concat(bet);
//         setGlobalBetList(globalArray);
//     }

//     return(
//         <div>
//             <ActiveBets setActiveBets={setGlobalBetList} activeBets={globalBetList} setSuccess={setSuccess} setError={setError}/>
//         </div>
//     );
// }