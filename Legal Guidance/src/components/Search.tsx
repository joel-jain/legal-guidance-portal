import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, BookOpen, ChevronDown, Loader2 } from 'lucide-react';

// Define the structure for our case data
interface CaseResult {
  id: string; // Added an ID for key prop
  title: string;
  link: string; // Keep for potential future links, maybe to internal pages or dummy links
  snippet: string;
  court: string;
  date: string; // Format: YYYY-MM-DD for easier filtering
}

// --- Static Legal Case Data ---
// Includes original landmark cases + representative examples for each State/UT
const allCasesData: CaseResult[] = [
  // --- Original Landmark Cases ---
  {
    id: 'case001',
    title: 'Kesavananda Bharati Sripadagalvaru v. State of Kerala',
    link: '#case001',
    snippet: 'Historic case establishing the basic structure doctrine of the Indian Constitution. Parliament cannot alter basic structure.',
    court: 'Supreme Court of India',
    date: '1973-04-24',
  },
  {
    id: 'case002',
    title: 'Maneka Gandhi v. Union of India',
    link: '#case002',
    snippet: 'Expanded Article 21 (Right to Life). Procedure established by law must be fair, just, and reasonable.',
    court: 'Supreme Court of India',
    date: '1978-01-25',
  },
  {
    id: 'case003',
    title: 'Indra Sawhney & Ors v. Union of India (Mandal Case)',
    link: '#case003',
    snippet: 'Upheld OBC reservations, introduced creamy layer concept, capped total reservations at 50%.',
    court: 'Supreme Court of India',
    date: '1992-11-16',
  },
  {
    id: 'case004',
    title: 'Vishaka & Ors v. State Of Rajasthan & Ors',
    link: '#case004',
    snippet: 'Laid down guidelines (Vishaka Guidelines) for preventing sexual harassment at the workplace.',
    court: 'Supreme Court of India',
    date: '1997-08-13',
  },
  {
    id: 'case005',
    title: 'Shreya Singhal v. Union of India',
    link: '#case005',
    snippet: 'Struck down Section 66A of the IT Act as unconstitutional (violating free speech).',
    court: 'Supreme Court of India',
    date: '2015-03-24',
  },
  {
    id: 'case006',
    title: 'Justice K.S. Puttaswamy (Retd.) v. Union Of India',
    link: '#case006',
    snippet: 'Recognized Right to Privacy as a fundamental right under Article 21.',
    court: 'Supreme Court of India',
    date: '2017-08-24',
  },
  {
    id: 'case007',
    title: 'Navtej Singh Johar v. Union of India',
    link: '#case007',
    snippet: 'Decriminalized consensual homosexual acts between adults (reading down Section 377 IPC).',
    court: 'Supreme Court of India',
    date: '2018-09-06',
  },
  {
    id: 'case008',
    title: 'Joseph Shine v. Union of India',
    link: '#case008',
    snippet: 'Struck down Section 497 IPC (Adultery) as unconstitutional and discriminatory.',
    court: 'Supreme Court of India',
    date: '2018-09-27',
  },
  {
    id: 'case009',
    title: 'M.C. Mehta v. Union of India (Oleum Gas Leak Case)',
    link: '#case009',
    snippet: 'Established the principle of absolute liability for hazardous industries.',
    court: 'Supreme Court of India',
    date: '1986-12-20',
  },
  {
    id: 'case010',
    title: 'A.K. Gopalan v. State of Madras',
    link: '#case010',
    snippet: 'Early narrow interpretation of Article 21. Later overruled by Maneka Gandhi.',
    court: 'Supreme Court of India',
    date: '1950-05-19',
  },
  {
    id: 'case011',
    title: 'Shah Bano Begum v. Mohd. Ahmed Khan',
    link: '#case011',
    snippet: 'Upheld Muslim woman\'s right to maintenance under CrPC Sec 125. Led to political controversy.',
    court: 'Supreme Court of India',
    date: '1985-04-23',
  },
  {
    id: 'case012',
    title: 'NALSA v. Union of India',
    link: '#case012',
    snippet: 'Recognized transgender people as \'third gender\', affirming their fundamental rights.',
    court: 'Supreme Court of India',
    date: '2014-04-15',
  },
  {
    id: 'case013',
    title: 'Lily Thomas v. Union of India',
    link: '#case013',
    snippet: 'Held immediate disqualification of MPs/MLAs upon conviction (2+ years sentence).',
    court: 'Supreme Court of India',
    date: '2013-07-10',
  },
  {
    id: 'case014',
    title: 'Common Cause v. Union of India (Passive Euthanasia)',
    link: '#case014',
    snippet: 'Legalized passive euthanasia and recognized "living wills" / advance directives.',
    court: 'Supreme Court of India',
    date: '2018-03-09',
  },
  {
    id: 'case015',
    title: 'S.R. Bommai v. Union of India',
    link: '#case015',
    snippet: 'Restricted arbitrary use of Article 356 (President\'s Rule). Secularism as basic structure.',
    court: 'Supreme Court of India',
    date: '1994-03-11',
  },
  // --- Representative Cases for States & UTs ---

  // States
  {
    id: 'case_ap_01',
    title: 'Farmers Welfare Association vs State of Andhra Pradesh',
    link: '#case_ap_01',
    snippet: 'PIL regarding fair compensation for land acquired for the Amaravati capital project. Court examined valuation methods.',
    court: 'High Court of Andhra Pradesh',
    date: '2022-11-15',
  },
  {
    id: 'case_ar_01',
    title: 'Tawang Monastery Committee vs Arunachal Pradesh Govt.',
    link: '#case_ar_01',
    snippet: 'Dispute over land use near a protected monastery area. HC directed status quo pending survey.',
    court: 'Gauhati High Court - Itanagar Bench',
    date: '2023-03-02',
  },
  {
    id: 'case_as_01',
    title: 'Brahmaputra River Protection Samiti vs Union of India & State of Assam',
    link: '#case_as_01',
    snippet: 'PIL seeking directions for flood control measures and dredging of the Brahmaputra river. NGT intervention sought.',
    court: 'Gauhati High Court',
    date: '2021-08-20',
  },
   {
    id: 'case_br_01',
    title: 'State of Bihar vs Liquor Ban Enforcement Cell',
    link: '#case_br_01',
    snippet: 'Challenge to the procedural aspects of liquor ban enforcement leading to numerous arrests. HC reviewed guidelines.',
    court: 'Patna High Court',
    date: '2023-01-10',
  },
  {
    id: 'case_cg_01',
    title: 'Chhattisgarh Mining Workers Union vs Coal India Ltd.',
    link: '#case_cg_01',
    snippet: 'Case concerning safety standards and compensation for accidents in coal mines. HC directed safety audit.',
    court: 'High Court of Chhattisgarh',
    date: '2022-09-05',
  },
  {
    id: 'case_ga_01',
    title: 'Goa Coastal Zone Management Authority vs Resort Developer',
    link: '#case_ga_01',
    snippet: 'Action against illegal construction within the Coastal Regulation Zone (CRZ). Demolition orders upheld.',
    court: 'Bombay High Court - Panaji Bench',
    date: '2023-04-18',
  },
  {
    id: 'case_gj_01',
    title: 'Ahmedabad Textile Mills Association vs State of Gujarat',
    link: '#case_gj_01',
    snippet: 'Dispute over water tariff increase for industrial use. HC examined reasonableness of the hike.',
    court: 'High Court of Gujarat',
    date: '2022-06-30',
  },
  {
    id: 'case_hr_01',
    title: 'Haryana Urban Development Authority (HUDA) Plot Owners vs State',
    link: '#case_hr_01',
    snippet: 'Challenge regarding delays in providing basic amenities in newly developed sectors. Directions issued to HUDA.',
    court: 'Punjab and Haryana High Court',
    date: '2023-05-11',
  },
   {
    id: 'case_hp_01',
    title: 'Save the Himalayas Foundation vs Himachal Pradesh Power Corp.',
    link: '#case_hp_01',
    snippet: 'PIL challenging environmental clearances for a hydroelectric project in a sensitive ecological zone.',
    court: 'High Court of Himachal Pradesh',
    date: '2022-10-25',
  },
  {
    id: 'case_jh_01',
    title: 'Jharkhand Displaced Peoples Forum vs State Govt.',
    link: '#case_jh_01',
    snippet: 'Case demanding proper rehabilitation and resettlement for families displaced by a new steel plant project.',
    court: 'High Court of Jharkhand',
    date: '2023-02-14',
  },
   {
    id: 'case_ka_01',
    title: 'Bangalore Water Supply Action Group vs BWSSB',
    link: '#case_ka_01',
    snippet: 'PIL regarding inequitable water distribution and leakage issues in Bangalore city. HC sought action plan.',
    court: 'High Court of Karnataka',
    date: '2022-12-01',
  },
  {
    id: 'case_kl_01',
    title: 'Kerala Fishermen Union vs State Fisheries Dept.',
    link: '#case_kl_01',
    snippet: 'Challenge to new regulations impacting traditional fishing rights and zones. HC reviewed impact assessment.',
    court: 'High Court of Kerala',
    date: '2023-06-08',
  },
  {
    id: 'case_mp_01',
    title: 'Madhya Pradesh Wildlife Protection Society vs Forest Department',
    link: '#case_mp_01',
    snippet: 'Case concerning alleged illegal tree felling in a protected forest area. Investigation ordered.',
    court: 'High Court of Madhya Pradesh - Jabalpur Bench',
    date: '2022-07-19',
  },
  {
    id: 'case_mh_01',
    title: 'Mumbai Housing Action Group vs Slum Rehabilitation Authority (SRA)',
    link: '#case_mh_01',
    snippet: 'PIL alleging irregularities and delays in SRA projects. HC directed transparency measures.',
    court: 'Bombay High Court',
    date: '2023-07-20',
  },
  {
    id: 'case_mn_01',
    title: 'All Manipur Students Union vs State Education Board',
    link: '#case_mn_01',
    snippet: 'Dispute over examination schedules and syllabus changes impacting students. HC mediated resolution.',
    court: 'High Court of Manipur',
    date: '2022-03-15',
  },
  {
    id: 'case_ml_01',
    title: 'Meghalaya Indigenous Miners Assn. vs State Govt.',
    link: '#case_ml_01',
    snippet: 'Challenge to restrictions on traditional mining practices (rat-hole mining) and seeking sustainable alternatives.',
    court: 'High Court of Meghalaya',
    date: '2021-11-22',
  },
  {
    id: 'case_mz_01',
    title: 'Mizoram Border Villagers Council vs Union Home Ministry',
    link: '#case_mz_01',
    snippet: 'Petition regarding border fencing issues and its impact on local communities and cross-border movement.',
    court: 'Gauhati High Court - Aizawl Bench',
    date: '2023-01-25',
  },
  {
    id: 'case_nl_01',
    title: 'Nagaland Govt. Employees Federation vs State Finance Dept.',
    link: '#case_nl_01',
    snippet: 'Case concerning delayed payment of salaries and pension benefits to government employees.',
    court: 'Gauhati High Court - Kohima Bench',
    date: '2022-08-10',
  },
  {
    id: 'case_od_01',
    title: 'Puri Temple Administration Committee vs State of Odisha',
    link: '#case_od_01',
    snippet: 'Case related to heritage corridor development around Jagannath Temple, Puri, balancing development and conservation.',
    court: 'High Court of Orissa',
    date: '2022-05-09',
  },
  {
    id: 'case_pb_01',
    title: 'Punjab Farmers Union vs State Power Corporation',
    link: '#case_pb_01',
    snippet: 'Protest against electricity tariff hikes for agricultural tube wells. Stay granted temporarily.',
    court: 'Punjab and Haryana High Court',
    date: '2023-08-01',
  },
  {
    id: 'case_rj_01',
    title: 'Rajasthan Tourism Development Corp Employees vs State Govt.',
    link: '#case_rj_01',
    snippet: 'Service matter regarding regularization and pay scales of contractual employees in RTDC.',
    court: 'Rajasthan High Court - Jaipur Bench',
    date: '2022-04-28',
  },
  {
    id: 'case_sk_01',
    title: 'Sikkim Environment Protection Group vs National Highway Authority',
    link: '#case_sk_01',
    snippet: 'PIL concerning environmental damage caused during highway expansion project in ecologically sensitive Sikkim.',
    court: 'High Court of Sikkim',
    date: '2023-03-22',
  },
  {
    id: 'case_tn_01',
    title: 'Tamil Nadu River Conservation Trust vs State Industries Dept.',
    link: '#case_tn_01',
    snippet: 'Action sought against industrial units polluting the Noyyal River. TNPCB directed to take action.',
    court: 'Madras High Court',
    date: '2022-11-08',
  },
  {
    id: 'case_ts_01',
    title: 'Telangana Junior Doctors Association vs Director of Medical Education',
    link: '#case_ts_01',
    snippet: 'Dispute regarding stipend payments and working conditions for junior doctors in government hospitals.',
    court: 'High Court for the State of Telangana',
    date: '2023-06-15',
  },
  {
    id: 'case_tr_01',
    title: 'Tripura Rubber Growers Society vs State Commerce Dept.',
    link: '#case_tr_01',
    snippet: 'Petition seeking better price support mechanism for natural rubber growers facing market fluctuations.',
    court: 'High Court of Tripura',
    date: '2022-09-20',
  },
  {
    id: 'case_up_01',
    title: 'Allahabad Advocates Association vs District Administration',
    link: '#case_up_01',
    snippet: 'Case concerning infrastructure and facilities within the court premises. Directions issued for improvements.',
    court: 'High Court of Judicature at Allahabad',
    date: '2023-02-01',
  },
  {
    id: 'case_uk_01',
    title: 'Uttarakhand Char Dham Vikas Parishad vs Environmental Activists',
    link: '#case_uk_01',
    snippet: 'Legal challenge regarding the scope and environmental impact of the Char Dham road widening project.',
    court: 'High Court of Uttarakhand',
    date: '2022-10-12',
  },
  {
    id: 'case_wb_01',
    title: 'West Bengal Teachers Recruitment Action Committee vs School Service Commission',
    link: '#case_wb_01',
    snippet: 'Allegations of irregularities in the teacher recruitment process. CBI investigation ordered in related matters.',
    court: 'Calcutta High Court',
    date: '2023-05-18',
  },

  // Union Territories
  {
    id: 'case_an_01',
    title: 'Andaman Indigenous Tribes Protection Forum vs A&N Administration',
    link: '#case_an_01',
    snippet: 'PIL seeking stricter enforcement of regulations protecting tribal reserves from encroachment and tourism impact.',
    court: 'Calcutta High Court - Port Blair Bench',
    date: '2022-08-25',
  },
  {
    id: 'case_ch_01',
    title: 'Chandigarh Residents Welfare Federation vs Municipal Corporation',
    link: '#case_ch_01',
    snippet: 'Challenge to increased property tax rates and demand for better civic amenities in Chandigarh.',
    court: 'Punjab and Haryana High Court',
    date: '2023-04-05',
  },
  {
    id: 'case_dn_dd_01',
    title: 'Daman Industries Association vs UT Administration of DNH&DD',
    link: '#case_dn_dd_01',
    snippet: 'Dispute over revised land lease policies affecting industrial units in Daman and Diu.',
    court: 'Bombay High Court', // Jurisdiction lies with Bombay HC
    date: '2022-11-30',
  },
  {
    id: 'case_dl_01',
    title: 'Delhi Clean Air Action Group vs EPCA & Others',
    link: '#case_dl_01',
    snippet: 'Ongoing litigation regarding implementation of measures to combat air pollution in Delhi-NCR.',
    court: 'Delhi High Court / Supreme Court (often involved)',
    date: '2023-07-11',
  },
  {
    id: 'case_jk_01',
    title: 'Jammu Fruit Growers Association vs National Highway Authority',
    link: '#case_jk_01',
    snippet: 'Petition concerning frequent highway closures impacting the transport of perishable goods from Kashmir valley.',
    court: 'High Court of Jammu & Kashmir and Ladakh',
    date: '2022-09-15',
  },
  {
    id: 'case_la_01',
    title: 'Ladakh Autonomous Hill Development Council (Leh) vs UT Administration',
    link: '#case_la_01',
    snippet: 'Dispute regarding devolution of powers and funds between the LAHDC and the UT administration.',
    court: 'High Court of Jammu & Kashmir and Ladakh',
    date: '2023-03-30',
  },
  {
    id: 'case_ld_01',
    title: 'Lakshadweep Save Forum vs Administrator, UT of Lakshadweep',
    link: '#case_ld_01',
    snippet: 'Challenge to controversial administrative reforms and regulations introduced in Lakshadweep.',
    court: 'High Court of Kerala', // Jurisdiction lies with Kerala HC
    date: '2021-06-22',
  },
  {
    id: 'case_py_01',
    title: 'Puducherry Government Staff Federation vs Lt. Governor & Chief Secretary',
    link: '#case_py_01',
    snippet: 'Case relating to administrative control over services and appointments, reflecting LG-Govt friction.',
    court: 'Madras High Court', // Jurisdiction lies with Madras HC
    date: '2022-12-10',
  }
];


const LegalCaseSearch = () => {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [results, setResults] = useState<CaseResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Determine available years from the data once
  useEffect(() => {
    const yearsInData = Array.from(new Set(allCasesData.map(c => parseInt(c.date.substring(0, 4)))))
                             .filter(y => !isNaN(y)) // Ensure only valid numbers
                             .sort((a, b) => b - a); // Sort descending (newest first)
    setAvailableYears(yearsInData);
  }, []);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResults([]); // Clear previous results immediately

    // Simulate a short delay for UX, even though filtering is fast
    setTimeout(() => {
      try {
        const queryLower = query.toLowerCase().trim();

        // Start with all cases
        let filteredResults = allCasesData;

        // Filter by query term (in title, snippet, court)
        if (queryLower) {
          filteredResults = filteredResults.filter(caseItem =>
            caseItem.title.toLowerCase().includes(queryLower) ||
            caseItem.snippet.toLowerCase().includes(queryLower) ||
            caseItem.court.toLowerCase().includes(queryLower)
          );
        }

        // Filter by year
        if (year) {
          filteredResults = filteredResults.filter(caseItem =>
            caseItem.date.startsWith(year) // Assumes YYYY-MM-DD format
          );
        }

        // Update results state
        if (filteredResults.length > 0) {
          setResults(filteredResults);
        } else {
           setError(`No cases found matching "${query}" ${year ? `in ${year}` : ''}. Try different keywords.`);
        }

      } catch (err) {
        // Catch any unexpected errors during filtering
        setError('An error occurred during the search.');
        console.error('Search filter error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250); // Slightly increased delay for larger dataset perception
  };

  // Function to highlight search term in results (optional but enhances UX)
  const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query || !text) {
      return text;
    }
    const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? <mark key={index} className="bg-yellow-200 font-semibold px-0.5">{part}</mark> : part
    );
  };


  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="h-7 w-7 mr-3 text-indigo-600" />
          Search Local Legal Case Database (All States/UTs)
        </h1>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search cases (e.g., 'environment', 'punjab', '2022', 'Madras High Court')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-150 ease-in-out text-gray-700 placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="relative">
               <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none outline-none transition duration-150 ease-in-out bg-white text-gray-700 cursor-pointer pr-8" // Added pr-8 for arrow space
              >
                <option value="">Any Year</option>
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-150 ease-in-out flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium ${isLoading ? 'cursor-wait' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon className="h-5 w-5 mr-2" />
                  Search Cases
                </>
              )}
            </button>
          </div>
           {/* Display query info if not loading and results exist */}
           {!isLoading && results.length > 0 && (query || year) && (
             <p className="text-sm text-gray-600 pt-2">
               Showing results {query ? <>for: <span className="font-medium">"{query}"</span></> : ''} {year && `in year ${year}`}
             </p>
           )}
        </form>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="mx-auto h-8 w-8 text-indigo-600 animate-spin" />
          <p className="mt-2 text-gray-600">Searching local database...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg shadow-sm">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

       {!isLoading && !error && results.length === 0 && (query || year) && ( // Show "not found" only if a search was attempted
         <div className="text-center py-8 text-gray-500">
           No cases found matching your criteria. Please try different keywords or adjust the year filter.
         </div>
       )}


      {results.length > 0 && !isLoading && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 px-1">
            Found {results.length} case{results.length !== 1 ? 's' : ''}
          </h3>

          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-150 ease-in-out">
                <div className="p-5">
                   <h3 className="text-base font-semibold text-indigo-700 mb-2 hover:text-indigo-900">
                    <a href={result.link} onClick={(e) => e.preventDefault()} className="cursor-pointer">
                      {highlightMatch(result.title, query)}
                    </a>
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                     <span className="font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.33 6.33a6 6 0 118.34 8.34A6 6 0 014.33 6.33zm1.74 8.93A6 6 0 0113.67 5.67a.75.75 0 00-1.06-1.06A7.5 7.5 0 106.07 15.26z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M10 4a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 4zM10 10a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                         </svg>
                         Court: <span className="ml-1 font-normal">{highlightMatch(result.court, query)}</span>
                    </span>
                    <span className="font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M5.75 3a.75.75 0 01.75.75v.5h7V3.75a.75.75 0 011.5 0V4h.75A2.25 2.25 0 0118 6.25v9.5A2.25 2.25 0 0115.75 18h-11.5A2.25 2.25 0 012 15.75v-9.5A2.25 2.25 0 014.25 4H5v-.25A.75.75 0 015.75 3zm0 2.5h-1.5V15.75a.75.75 0 00.75.75h11.5a.75.75 0 00.75-.75V6.25a.75.75 0 00-.75-.75H5.75V5.5z" clipRule="evenodd" />
                         </svg>
                        Date: <span className="ml-1 font-normal">{new Date(result.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed">{highlightMatch(result.snippet, query)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalCaseSearch;