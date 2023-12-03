import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  const savedPackages = JSON.parse(localStorage.getItem('favoritePackages')) || [];
  const [selectedPackageForAction, setSelectedPackageForAction] = useState(null);
  const [packageForDeletion, setPackageForDeletion] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    scope: '',
    version: '',
    description: '',
    reason: '',
  });

  const handleDelete = (pkg) => {
    setPackageForDeletion(pkg);
  };

  const confirmDelete = () => {
    const updatedPackages = savedPackages.filter((p) => p.name !== packageForDeletion.name);
    localStorage.setItem('favoritePackages', JSON.stringify(updatedPackages));
    setSelectedPackageForAction(null);
    setPackageForDeletion(null);
  };

  const closeViewDialog = () => {
    setSelectedPackageForAction(null);
    setPackageForDeletion(null);
    setEditingPackage(null);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setEditFormData({
      name: pkg.name,
      scope: pkg.scope,
      version: pkg.version,
      description: pkg.description,
      reason: pkg.reason,
    });
  };

  const handleEditInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const confirmEdit = () => {
    const updatedPackages = savedPackages.map((pkg) =>
      pkg.name === editingPackage.name ? { ...pkg, ...editFormData } : pkg
    );

    localStorage.setItem('favoritePackages', JSON.stringify(updatedPackages));
    setEditingPackage(null);
  };

  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold mb-4">Welcome to Favorite NPM packages</h1>

      {savedPackages.length === 0 ? (
        <div>
          <p className="text-lg mb-4">You don't have any favorites.</p>
          <Link to="/homepage">
            <button className="bg-blue-500 text-white rounded px-4 py-2">Add Fav</button>
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-lg mb-4">Your favorite packages:</p>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Package Name</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedPackages.map((pkg, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{pkg.name}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="mr-2 text-blue-500"
                      onClick={() => setSelectedPackageForAction(pkg)}
                    >
                      View
                    </button>
                    <button
                      className="mr-2 text-green-500"
                      onClick={() => handleEdit(pkg)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDelete(pkg)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/homepage">
            <button className="bg-blue-500 text-white rounded px-4 py-2 mt-4">
              Add More Fav
            </button>
          </Link>
        </div>
      )}

      {selectedPackageForAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 border rounded shadow-md max-w-lg">
            <h2 className="text-xl font-bold mb-4">{`Viewing ${selectedPackageForAction.name}`}</h2>
            <p><strong>Scope:</strong> {selectedPackageForAction.scope}</p>
            <p><strong>Version:</strong> {selectedPackageForAction.version}</p>
            <p><strong>Description:</strong> {selectedPackageForAction.description}</p>
            <p><strong>Author:</strong> {selectedPackageForAction.author?.name}</p>
            <p><strong>Publisher:</strong> {selectedPackageForAction.publisher?.username}</p>
            <p><strong>Reason:</strong> {selectedPackageForAction.reason}</p>
            <button
              onClick={closeViewDialog}
              className="bg-blue-500 text-white rounded p-2 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {packageForDeletion && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 border rounded shadow-md max-w-lg">
            <p>{`Are you sure you want to delete ${packageForDeletion.name}?`}</p>
            <button
              onClick={confirmDelete}
              className="bg-red-500 text-white rounded p-2 mt-2 mr-2"
            >
              Delete
            </button>
            <button
              onClick={closeViewDialog}
              className="bg-blue-500 text-white rounded p-2 mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {editingPackage && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 border rounded shadow-md max-w-lg">
            <h2 className="text-xl font-bold mb-4">{`Editing ${editingPackage.name}`}</h2>
            <form>
              <label className="block mb-2" htmlFor="editName">
                Package Name:
              </label>
              <input
                type="text"
                id="editName"
                name="name"
                value={editFormData.name}
                onChange={handleEditInputChange}
                className="border rounded p-2 mb-4 w-full"
              />

              <label className="block mb-2" htmlFor="editScope">
                Scope:
              </label>
              <input
                type="text"
                id="editScope"
                name="scope"
                value={editFormData.scope}
                onChange={handleEditInputChange}
                className="border rounded p-2 mb-4 w-full"
              />

              <label className="block mb-2" htmlFor="editVersion">
                Version:
              </label>
              <input
                type="text"
                id="editVersion"
                name="version"
                value={editFormData.version}
                onChange={handleEditInputChange}
                className="border rounded p-2 mb-4 w-full"
              />

              <label className="block mb-2" htmlFor="editDescription">
                Description:
              </label>
              <textarea
                id="editDescription"
                name="description"
                value={editFormData.description}
                onChange={handleEditInputChange}
                className="border rounded p-2 mb-4 w-full"
              />

              <label className="block mb-2" htmlFor="editReason">
                Reason:
              </label>
              <textarea
                id="editReason"
                name="reason"
                value={editFormData.reason}
                onChange={handleEditInputChange}
                className="border rounded p-2 mb-4 w-full"
              />

              <button
                type="button"
                onClick={confirmEdit}
                className="bg-green-500 text-white rounded p-2 mt-2"
              >
                Confirm Edit
              </button>
              <button
                type="button"
                onClick={closeViewDialog}
                className="bg-blue-500 text-white rounded p-2 mt-2 ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
