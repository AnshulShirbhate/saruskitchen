'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/redux/store';
import { setUser } from '@/redux/userSlice';
import { toast } from 'react-toastify';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/updateprofile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        dispatch(setUser(updatedUser));
        toast.success('Profile updated successfully');
        setEditMode(false);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        User not logged in.
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-16 bg-gradient-to-br from-white to-pink-50 rounded-xl shadow-2xl p-8 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center border-b pb-4">
        My Profile
      </h2>

      <div className="space-y-6">
        <ProfileField label="User ID" value={user.id} />
        <ProfileField label="Email" value={user.email} />

        <ProfileField label="Name" editMode={editMode}>
          {editMode ? (
            <input
              type="text"
              className="input-style border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-pink-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <span>{user.name}</span>
          )}
        </ProfileField>

        <ProfileField label="Phone" editMode={editMode}>
          {editMode ? (
            <input
              type="text"
              className="input-style border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-pink-400"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          ) : (
            <span>{user.phone}</span>
          )}
        </ProfileField>

        <div className="pt-6 flex justify-end gap-4">
          {editMode ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEdit}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                <FiSave />
                {loading ? 'Saving...' : 'Save'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditMode(false);
                  setName(user.name);
                  setPhone(user.phone);
                }}
                className="flex items-center gap-2 bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
              >
                <FiX />
                Cancel
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
            >
              <FiEdit2 />
              Edit
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProfileField = ({
  label,
  value,
  children,
  editMode = false,
}: {
  label: string;
  value?: string | number;
  children?: React.ReactNode;
  editMode?: boolean;
}) => (
  <motion.div
    className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    whileHover={{ scale: 1.02 }}
  >
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <div className="mt-1 text-lg text-gray-800">{children || value}</div>
  </motion.div>
);

export default ProfilePage;
