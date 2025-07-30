'use client';
import LoadingComponent from '@/app/components/LoadingComponent';
import UserInterface from '@/interfaces/UserInterface';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const [users, setUsers] = useState<UserInterface[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserInterface | null>(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  useEffect(() => {
    async function getAllUsers() {
      try {
        const response = await fetch('/api/getallusers');
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Cannot connect to server!");
      }
    }

    getAllUsers();
  }, []);

  const handleEditClick = (user: UserInterface) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setIsLoadingEdit(true);
    try {
      const response = await fetch('/api/updateuser', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedUser),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('User updated successfully!');
        setUsers((prevUsers) =>
          prevUsers?.map((user) =>
            user.id === selectedUser.id ? { ...selectedUser } : user
          ) || null
        );
        setIsModalOpen(false);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user!');
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const handleDeleteClick = (user: UserInterface) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsLoadingDelete(true);
    try {
      const response = await fetch(`/api/deleteuser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userToDelete.id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('User deleted successfully!');
        setUsers((prevUsers) =>
          prevUsers?.filter((user) => user.id !== userToDelete.id) || null
        );
        setIsDeleteModalOpen(false);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user!');
    } finally {
      setIsLoadingDelete(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>
      {users ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3 text-gray-600 font-medium">Name</th>
                <th className="px-6 py-3 text-gray-600 font-medium">Email</th>
                <th className="px-6 py-3 text-gray-600 font-medium">Phone</th>
                <th className="px-6 py-3 text-gray-600 font-medium">Is Verified?</th>
                <th className="px-6 py-3 text-gray-600 font-medium">Role</th>
                <th className="px-6 py-3 text-gray-600 font-medium">Joining Date</th>
                <th className="px-6 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-gray-800">{user.email}</td>
                  <td className="px-6 py-4 text-gray-800">{user.phone}</td>
                  <td className="px-6 py-4 text-gray-800">{user.isVerified ? "Yes" : "No"}</td>
                  <td className="px-6 py-4 text-gray-800 capitalize">{user.role}</td>
                  <td className="px-6 py-4 text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      className="text-blue-600 hover:underline mr-4"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteClick(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <LoadingComponent loaderName="Users" />
      )}

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit User</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Name"
              />
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser((prev) =>
                    prev ? { ...prev, email: e.target.value } : null
                  )
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Email"
              />
              <input
                type="text"
                value={selectedUser.phone}
                onChange={(e) =>
                  setSelectedUser((prev) =>
                    prev ? { ...prev, phone: e.target.value } : null
                  )
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Phone"
              />
              <select
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser((prev) =>
                    prev ? { ...prev, role: e.target.value } : null
                  )
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
              <select
                value={selectedUser.isVerified ? 'true' : 'false'}
                onChange={(e) =>
                  setSelectedUser((prev) =>
                    prev ? { ...prev, isVerified: e.target.value === 'true' } : null
                  )
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleUpdateUser}
                className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                disabled={isLoadingEdit}
              >
                {isLoadingEdit ? 'Updating...' : 'Update'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <b>{userToDelete.name}</b>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
                disabled={isLoadingDelete}
              >
                {isLoadingDelete ? 'Deleting...' : 'Confirm Delete'}
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 rounded bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;