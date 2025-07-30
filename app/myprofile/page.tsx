'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/redux/store';
import { setUser } from '@/redux/userSlice';
import { toast } from 'react-toastify';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { SiTicktick } from "react-icons/si";

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

  const handleSendVerificationEmail = async (email: string) => {
    try {
      const res = await fetch('/api/sendverificationemail', {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        toast.success('Verification email sent successfully');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to send verification email');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg text-center px-4">
        User not logged in.
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl w-full mx-auto mt-16 bg-gradient-to-br from-white to-pink-50 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 text-center border-b pb-4">
        My Profile
      </h2>

      <div className="space-y-6">
        <ProfileField label="User ID" value={user.id} />
        
        <ProfileField label="Email">
          <div className="flex items-center justify-between">
            <span>{user.email}</span>
            {user.isVerified ? (
              <span className="text-green-500 flex items-center gap-1">
                <SiTicktick className="text-lg" />
                Verified
              </span>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendVerificationEmail(user.email)}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all text-sm sm:text-base"
              >
                Verify Email
              </motion.button>
            )}
          </div>
        </ProfileField>

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

        <div className="pt-4 sm:pt-6 flex flex-wrap justify-end gap-3 sm:gap-4">
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
    className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden break-words"
    whileHover={{ scale: 1.02 }}
  >
    <label className="text-sm font-medium text-gray-500 block mb-1">{label}</label>
    <div className="text-base sm:text-lg text-gray-800 break-words w-full max-w-full">
      {children || value}
    </div>
  </motion.div>
);

export default ProfilePage;
