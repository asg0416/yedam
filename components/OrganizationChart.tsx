'use client';

import { useState, useEffect } from 'react';
import { Organization } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface OrganizationChartProps {
  organizations: Organization[];
}

export default function OrganizationChart({ organizations }: OrganizationChartProps) {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedMemberImage, setSelectedMemberImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (selectedOrg || selectedMemberImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOrg, selectedMemberImage]);

  const getOrgIcon = (name: string) => {
    if (name.includes('목사')) return '👨‍💼';
    if (name.includes('임원')) return '👥';
    if (name.includes('새가족')) return '🤝';
    if (name.includes('가디언')) return '🛡️';
    if (name.includes('블레싱')) return '👶';
    return '👫';
  };

  if (!isClient) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-8 animate-pulse h-48"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {organizations.map((org, index) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedOrg(org)}
            className="group bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-100 cursor-pointer hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center h-full active:scale-95 transition-transform"
          >

            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-50 mb-4 md:mb-6 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
              {org.members && org.members.length > 0 && org.members[0].image_url ? (
                <img
                  src={org.members[0].image_url}
                  alt={org.members[0].name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl text-gray-400">
                  <i className="ri-team-line"></i>
                </span>
              )}
            </div>

            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors break-keep">
              {org.name}
            </h4>
            <p className="text-xs md:text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4 break-keep">
              {org.description}
            </p>

            <div className="mt-auto flex items-center text-xs md:text-sm font-medium text-gray-400 group-hover:text-gray-900 transition-colors">
              <span>자세히 보기</span>
              <i className="ri-arrow-right-line ml-1 md:ml-2 transform group-hover:translate-x-1 transition-transform"></i>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOrg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedOrg(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedOrg.name}</h3>
                  <p className="text-gray-500 leading-relaxed">{selectedOrg.description}</p>
                </div>
                <button
                  onClick={() => setSelectedOrg(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <i className="ri-close-line text-2xl text-gray-400"></i>
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-opacity-50 border-b pb-2">Team Members</h4>
                <div className="grid gap-3">
                  {selectedOrg.members?.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-4 p-4 rounded-xl border border-gray-100 hover:border-green-100 hover:bg-green-50/30 transition-all cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (member.image_url) setSelectedMemberImage(member.image_url);
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm group-hover:border-green-200 transition-colors">
                        {member.image_url ? (
                          <img
                            src={member.image_url}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                            <i className="ri-user-smile-line"></i>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{member.role}</p>
                        <p className="text-sm text-gray-500">{member.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedMemberImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedMemberImage(null);
            }}
          >
            <div className="relative max-w-2xl w-full">
              <button
                onClick={() => setSelectedMemberImage(null)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
              >
                <i className="ri-close-line text-3xl"></i>
              </button>
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={selectedMemberImage}
                alt="확대된 사진"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
