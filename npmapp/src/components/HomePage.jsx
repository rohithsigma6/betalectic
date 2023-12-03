import React, { useState, useEffect } from "react";

const HomePage = () => {
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.npms.io/v2/search?q=${searchQuery}`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setResults(data.results);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, [searchQuery]);

  const handleCheckboxChange = (index) => {
    setSelectedItem(index);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedItem !== null && reason.trim() !== "") {
      const selectedPackage = results[selectedItem];
      const savedPackages = JSON.parse(localStorage.getItem("favoritePackages")) || [];
      const isPackageAlreadySaved = savedPackages.some((pkg) => pkg.name === selectedPackage.package.name);

      if (!isPackageAlreadySaved) {
        const newPackage = { ...selectedPackage.package, reason };
        savedPackages.push(newPackage);
        localStorage.setItem("favoritePackages", JSON.stringify(savedPackages));

    
        setSelectedItem(null);
        setReason("");
        setIsDialogOpen(true);
        setDialogMessage("Success! Package added to favorites.");
      } else {
        setIsDialogOpen(true);
        setDialogMessage("Error: This package is already in your favorites list.");
      }
    } else {
      setIsDialogOpen(true);
      setDialogMessage("Error: Please select a package and provide a reason.");
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setDialogMessage("");
  };

  return (
    <div className="bg-gray-100 min-h-screen fixed w-full">
      <div className="bg-white shadow p-4 fixed w-full z-10">
        <form onSubmit={handleSubmit} className="flex items-center">
        <p className="mb-2 text-lg font-semibold">Search for NPM packages</p>
          <input
            className="border rounded p-2 flex-grow"
            placeholder="Search for packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="container mx-auto mt-20 p-4">
        <div className="results-container max-h-60 overflow-y-auto border rounded p-4 mb-4">
        <p className="mb-2 text-lg font-semibold">Results</p>
          {error ? (
            <div className="text-red-500"></div>
          ) : (
            <div>
              {results.map((item, index) => (
                <div key={index} className="flex items-center mt-2 p-4 border rounded">
                  <input
                    type="checkbox"
                    className="mr-2 rounded"
                    checked={selectedItem === index}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  <h1 className="text-sm font-bold">{(item.package && item.package.name) || "No Name"}</h1>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border rounded p-4">
          <p className="mb-2 text-lg font-semibold">Why is this your favorite?</p>
          <textarea
            className="border rounded p-2 w-full"
            placeholder="Enter your reason..."
            value={reason}
            onChange={handleReasonChange}
          />
          <button type="submit" onClick={handleSubmit} className="bg-green-500 text-white rounded p-2 mt-2">
            Submit
          </button>
        </div>

        {isDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-4 border rounded shadow-md">
              <p>{dialogMessage}</p>
              <button onClick={handleCloseDialog} className="bg-blue-500 text-white rounded p-2 mt-2">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
