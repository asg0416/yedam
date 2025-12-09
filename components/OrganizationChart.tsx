
'use client';

import { useState, useEffect } from 'react';
import { Organization } from '../lib/supabase';

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

  const getOrgColor = (name: string) => {
    if (name.includes('목사')) return 'from-blue-100 to-blue-200';
    if (name.includes('임원')) return 'from-green-100 to-green-200';
    if (name.includes('새가족')) return 'from-purple-100 to-purple-200';
    if (name.includes('가디언')) return 'from-orange-100 to-orange-200';
    if (name.includes('블레싱')) return 'from-pink-100 to-pink-200';
    return 'from-gray-100 to-gray-200';
  };

  if (!isClient) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-xl p-4 animate-pulse">
            <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {organizations.map((org) => (
          <div
            key={org.id}
            onClick={() => setSelectedOrg(org)}
            className="bg-white rounded-xl p-4 shadow-sm text-center cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${getOrgColor(org.name)} rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden`}>
              {org.members && org.members.length > 0 && org.members[0].image_url ? (
                <img
                  src={org.members[0].image_url}
                  alt={org.members[0].name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg">{getOrgIcon(org.name)}</span>
              )}
            </div>
            <h4 className="font-medium text-gray-800 text-sm mb-1">{org.name}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{org.description}</p>
          </div>
        ))}
      </div>

      {/* 조직 상세 모달 */}
      {selectedOrg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrg(null);
          }}
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">{selectedOrg.name}</h3>
              <button
                onClick={() => setSelectedOrg(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{selectedOrg.description}</p>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 text-sm">구성원</h4>
              {selectedOrg.members?.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (member.image_url) {
                      setSelectedMemberImage(member.image_url);
                    }
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 hover:scale-105 transition-transform duration-200">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm">{getOrgIcon(selectedOrg.name)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{member.role}</p>
                    <p className="text-xs text-gray-500">{member.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 이미지 확대 모달 */}
      {selectedMemberImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMemberImage(null);
          }}
        >
          <div className="relative max-w-md w-full">
            <button
              onClick={() => setSelectedMemberImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
            <img
              src={selectedMemberImage}
              alt="확대된 사진"
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
